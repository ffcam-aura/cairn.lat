"use server";

import { db } from "@/lib/db";
import { debriefs, debriefMembers, users, debriefInvitations } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { randomBytes } from "node:crypto";
import { auth, signIn } from "@/auth";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";

/* ─── Création d'un débrief ──────────────────────────────── */

export async function createDebrief(formData: FormData) {
  const outingName = (formData.get("outingName") as string | null)?.trim();
  if (!outingName) return;

  const session = await auth();
  const slug = randomBytes(5).toString("hex");

  const locationLink = (formData.get("locationLink") as string)?.trim() || null;

  let gpxData: string | null = null;
  const gpxFile = formData.get("gpxFile") as File | null;
  if (gpxFile && gpxFile.size > 0 && gpxFile.size <= 3 * 1024 * 1024) {
    gpxData = await gpxFile.text();
  }

  const [debrief] = await db
    .insert(debriefs)
    .values({
      slug,
      outingName,
      massif: ((formData.get("massif") as string) ?? "").trim(),
      outingDate: ((formData.get("outingDate") as string) ?? "").trim(),
      participants: ((formData.get("participants") as string) ?? "").trim(),
      ownerId: session?.user?.id ?? null,
      locationLink,
      gpxData,
    })
    .returning({ id: debriefs.id });

  // Si authentifié, inscrire comme owner dans debrief_members
  if (session?.user?.id && debrief) {
    await db.insert(debriefMembers).values({
      debriefId: debrief.id,
      userId: session.user.id,
      role: "owner",
    });
  }

  redirect(`/d/${slug}`);
}

/* ─── Mise à jour de la sortie (§ 01) ───────────────────── */

export async function updateSortie(
  slug: string,
  _prev: { ok: boolean } | null,
  formData: FormData,
): Promise<{ ok: boolean }> {
  const outingName = (formData.get("outingName") as string)?.trim();
  if (!outingName) return { ok: false };

  const locationLink = (formData.get("locationLink") as string)?.trim() || null;

  const updates: Partial<typeof debriefs.$inferInsert> & { updatedAt: Date } = {
    outingName,
    massif: ((formData.get("massif") as string) ?? "").trim(),
    outingDate: ((formData.get("outingDate") as string) ?? "").trim(),
    participants: ((formData.get("participants") as string) ?? "").trim(),
    locationLink,
    updatedAt: new Date(),
  };

  const gpxFile = formData.get("gpxFile") as File | null;
  if (gpxFile && gpxFile.size > 0) {
    if (gpxFile.size <= 3 * 1024 * 1024) {
      updates.gpxData = await gpxFile.text();
    }
  }

  await db.update(debriefs).set(updates).where(eq(debriefs.slug, slug));

  revalidatePath(`/d/${slug}`);
  return { ok: true };
}

/* ─── Mise à jour d'une section ──────────────────────────── */

const WRITABLE_KEYS = [
  "recit",
  "divergence",
  "vigilancesAttention",
  "vigilancesSignaux",
  "vigilancesGroupe",
  "ecartPourquoi",
  "ecartRefaire",
  "suiteEnseignements",
  "suiteVigilance",
] as const;

export async function updateSection(
  slug: string,
  _prevState: { ok: boolean } | null,
  formData: FormData,
): Promise<{ ok: boolean }> {
  const updates: Partial<typeof debriefs.$inferInsert> & { updatedAt: Date } =
    { updatedAt: new Date() };

  for (const key of WRITABLE_KEYS) {
    const val = formData.get(key);
    if (typeof val === "string") {
      (updates as Record<string, unknown>)[key] = val;
    }
  }

  await db.update(debriefs).set(updates).where(eq(debriefs.slug, slug));

  return { ok: true };
}

/* ─── Rejoindre un débrief ───────────────────────────────── */

export async function joinDebrief(slug: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");

  const [debrief] = await db
    .select({ id: debriefs.id })
    .from(debriefs)
    .where(eq(debriefs.slug, slug))
    .limit(1);

  if (!debrief) return;

  // Vérifier qu'il n'est pas déjà membre
  const [existing] = await db
    .select({ id: debriefMembers.id })
    .from(debriefMembers)
    .where(
      and(
        eq(debriefMembers.debriefId, debrief.id),
        eq(debriefMembers.userId, session.user.id),
      ),
    )
    .limit(1);

  if (!existing) {
    await db.insert(debriefMembers).values({
      debriefId: debrief.id,
      userId: session.user.id,
      role: "member",
    });
  }

  revalidatePath(`/d/${slug}`);
  redirect(`/d/${slug}`);
}

/* ─── Connexion par email + mot de passe ─────────────────── */

export async function loginWithCredentials(formData: FormData): Promise<void> {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const rawCallback = formData.get("callbackUrl") as string | null;
  // N'utiliser le callbackUrl que pour les invitations — sinon toujours mes-debriefs
  const redirectTo = rawCallback?.startsWith("/rejoindre/") ? rawCallback : "/mes-debriefs";

  if (!email || !password) {
    redirect("/connexion?error=" + encodeURIComponent("Remplis tous les champs."));
  }

  try {
    await signIn("credentials", { email, password, redirectTo });
  } catch (e) {
    if (e instanceof AuthError) {
      redirect("/connexion?error=" + encodeURIComponent("Email ou mot de passe incorrect."));
    }
    throw e;
  }
}

/* ─── Inscription par email + mot de passe ───────────────── */

export async function registerUser(
  _prev: { error: string } | null,
  formData: FormData,
): Promise<{ error: string }> {
  const name = (formData.get("name") as string)?.trim() || null;
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "Remplis tous les champs." };
  if (password.length < 8) return { error: "Le mot de passe doit faire au moins 8 caractères." };

  const [existing] = await db
    .select({ id: users.id, passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing) {
    if (!existing.passwordHash) {
      return { error: "Cet email est associé à un compte Google. Connectez-vous avec Google." };
    }
    return { error: "Cet email est déjà utilisé." };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await db.insert(users).values({ name, email, passwordHash });

  redirect("/connexion?registered=1");
}

/* ─── Inviter par email ──────────────────────────────────── */

export async function inviteByEmail(
  slug: string,
  _prev: { ok: boolean; message: string } | null,
  formData: FormData,
): Promise<{ ok: boolean; message: string }> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, message: "Non authentifié." };

  const email = (formData.get("email") as string)?.trim().toLowerCase();
  if (!email || !email.includes("@")) return { ok: false, message: "Email invalide." };
  if (session.user.email?.toLowerCase() === email) {
    return { ok: false, message: "Tu ne peux pas t'inviter toi-même." };
  }

  const [debrief] = await db
    .select({ id: debriefs.id, outingName: debriefs.outingName })
    .from(debriefs)
    .where(eq(debriefs.slug, slug))
    .limit(1);
  if (!debrief) return { ok: false, message: "Débrief introuvable." };

  // Vérifier que l'invitant est bien owner
  const [membership] = await db
    .select({ role: debriefMembers.role })
    .from(debriefMembers)
    .where(
      and(
        eq(debriefMembers.debriefId, debrief.id),
        eq(debriefMembers.userId, session.user.id),
      ),
    )
    .limit(1);
  if (!membership) return { ok: false, message: "Accès refusé." };

  // Vérifier si l'email est déjà membre
  const [existingUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser) {
    const [alreadyMember] = await db
      .select({ id: debriefMembers.id })
      .from(debriefMembers)
      .where(
        and(
          eq(debriefMembers.debriefId, debrief.id),
          eq(debriefMembers.userId, existingUser.id),
        ),
      )
      .limit(1);
    if (alreadyMember) {
      return { ok: true, message: "Cette personne est déjà membre du débrief." };
    }
  }

  // Toujours créer une invitation + envoyer un email
  // L'ajout n'est effectif qu'après que l'invité clique sur le lien
  const token = randomBytes(20).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 jours

  await db.insert(debriefInvitations).values({
    debriefId: debrief.id,
    email,
    token,
    invitedBy: session.user.id,
    expiresAt,
  });

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return { ok: false, message: "Service email non configuré." };
  }

  const { Resend } = await import("resend");
  const resend = new Resend(resendKey);
  const baseUrl = process.env.AUTH_URL ?? "https://cairn.lat";
  const inviteUrl = `${baseUrl}/rejoindre/${token}`;
  // RESEND_FROM_EMAIL : "Cairn <noreply@cairn.lat>" une fois le domaine vérifié
  // Par défaut : onboarding@resend.dev (fonctionne sans vérification de domaine)
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "Cairn <onboarding@resend.dev>";

  const escapedName = debrief.outingName.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: `Invitation au débrief « ${debrief.outingName} »`,
    html: `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F5F2EE;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#F5F2EE;padding:48px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:520px;">

        <!-- Logo / marque -->
        <tr><td style="padding:0 0 28px;text-align:center;">
          <p style="margin:0;font-size:13px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#2E4A3A;">Cairn</p>
          <p style="margin:4px 0 0;font-size:11px;color:#999;letter-spacing:0.04em;">Débriefs de montagne</p>
        </td></tr>

        <!-- Carte principale -->
        <tr><td style="background:#ffffff;border-radius:6px;border:1px solid #E8E4DE;padding:40px 36px 36px;">

          <p style="margin:0 0 10px;font-size:10.5px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#2E4A3A;">Invitation</p>
          <h1 style="margin:0 0 16px;font-size:21px;font-weight:700;color:#1a1a1a;line-height:1.3;">Vous avez été invité à un débrief</h1>

          <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 28px;background:#F5F2EE;border-radius:4px;border-left:3px solid #2E4A3A;">
            <tr><td style="padding:14px 16px;">
              <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#888;">Sortie</p>
              <p style="margin:4px 0 0;font-size:16px;font-weight:600;color:#1a1a1a;">${escapedName}</p>
            </td></tr>
          </table>

          <p style="margin:0 0 28px;font-size:14.5px;color:#444;line-height:1.65;">
            Quelqu'un vous a invité à rejoindre ce débrief sur Cairn. Cliquez ci-dessous pour rejoindre le groupe et contribuer à l'analyse de la sortie.
          </p>

          <!-- Bouton CTA -->
          <table cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 32px;">
            <tr><td style="background:#2E4A3A;border-radius:3px;">
              <a href="${inviteUrl}" style="display:inline-block;padding:13px 26px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;letter-spacing:0.02em;">
                Rejoindre le débrief →
              </a>
            </td></tr>
          </table>

          <p style="margin:0 0 24px;font-size:12.5px;color:#999;line-height:1.6;">
            Ou copiez ce lien dans votre navigateur :<br>
            <a href="${inviteUrl}" style="color:#2E4A3A;word-break:break-all;">${inviteUrl}</a>
          </p>

          <!-- Séparateur -->
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 20px;">
            <tr><td style="border-top:1px solid #E8E4DE;"></td></tr>
          </table>

          <p style="margin:0;font-size:12px;color:#aaa;line-height:1.6;">
            Ce lien expire dans 7 jours. Si vous n'attendiez pas cette invitation, vous pouvez ignorer cet email.
          </p>
        </td></tr>

        <!-- Pied de page -->
        <tr><td style="padding:20px 0 0;text-align:center;">
          <p style="margin:0;font-size:11px;color:#bbb;">Cairn · Outil de débrief pour les sorties de montagne</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });

  if (error) {
    console.error("[Resend] send error:", JSON.stringify(error));
    return { ok: false, message: "Échec de l'envoi de l'email. Réessayez." };
  }

  return { ok: true, message: `Invitation envoyée à ${email}.` };
}

/* ─── Accepter une invitation ────────────────────────────── */

export async function acceptInvitation(token: string): Promise<{ slug: string } | { error: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "auth" };

  const [invitation] = await db
    .select()
    .from(debriefInvitations)
    .where(eq(debriefInvitations.token, token))
    .limit(1);

  if (!invitation) return { error: "Invitation introuvable ou expirée." };
  if (invitation.acceptedAt) return { error: "Cette invitation a déjà été utilisée." };
  if (invitation.expiresAt < new Date()) return { error: "Cette invitation a expiré." };
  if (invitation.email !== session.user.email) {
    return { error: `Cette invitation est destinée à ${invitation.email}.` };
  }

  // Vérifier si déjà membre
  const [existing] = await db
    .select({ id: debriefMembers.id })
    .from(debriefMembers)
    .where(
      and(
        eq(debriefMembers.debriefId, invitation.debriefId),
        eq(debriefMembers.userId, session.user.id),
      ),
    )
    .limit(1);

  if (!existing) {
    await db.insert(debriefMembers).values({
      debriefId: invitation.debriefId,
      userId: session.user.id,
      role: "member",
    });
  }

  await db
    .update(debriefInvitations)
    .set({ acceptedAt: new Date() })
    .where(eq(debriefInvitations.token, token));

  const [debrief] = await db
    .select({ slug: debriefs.slug })
    .from(debriefs)
    .where(eq(debriefs.id, invitation.debriefId))
    .limit(1);

  return { slug: debrief?.slug ?? "" };
}

/* ─── Supprimer un débrief ───────────────────────────────── */

export async function deleteDebrief(slug: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");

  const [debrief] = await db
    .select({ id: debriefs.id, ownerId: debriefs.ownerId })
    .from(debriefs)
    .where(eq(debriefs.slug, slug))
    .limit(1);

  if (!debrief || debrief.ownerId !== session.user.id) return;

  await db.delete(debriefs).where(eq(debriefs.id, debrief.id));
  redirect("/mes-debriefs");
}

/* ─── Quitter un débrief ─────────────────────────────────── */

export async function leaveDebrief(slug: string) {
  const session = await auth();
  if (!session?.user?.id) return;

  const [debrief] = await db
    .select({ id: debriefs.id, ownerId: debriefs.ownerId })
    .from(debriefs)
    .where(eq(debriefs.slug, slug))
    .limit(1);

  if (!debrief || debrief.ownerId === session.user.id) return; // owner ne peut pas quitter

  await db
    .delete(debriefMembers)
    .where(
      and(
        eq(debriefMembers.debriefId, debrief.id),
        eq(debriefMembers.userId, session.user.id),
      ),
    );

  revalidatePath(`/d/${slug}`);
  redirect(`/mes-debriefs`);
}
