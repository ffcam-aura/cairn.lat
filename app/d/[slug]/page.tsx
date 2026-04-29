import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { debriefs, debriefMembers, users } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/auth";
import { joinDebrief } from "@/app/actions";
import { Header } from "@/app/components/Header";
import { SectionForm } from "./SectionForm";
import { SortieForm } from "./SortieForm";
import { InviteButton } from "@/app/components/InviteButton";
import { DeleteDebriefButton } from "./DeleteDebriefButton";
import { SECTIONS } from "./sections";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const [d] = await db
    .select({ outingName: debriefs.outingName })
    .from(debriefs)
    .where(eq(debriefs.slug, slug))
    .limit(1);
  return {
    title: d ? `${d.outingName} — Débrief · Cairn` : "Débrief · Cairn",
  };
}

export default async function DebriefPage({ params }: Props) {
  const { slug } = await params;

  const [session, [debrief]] = await Promise.all([
    auth(),
    db.select().from(debriefs).where(eq(debriefs.slug, slug)).limit(1),
  ]);

  if (!debrief) notFound();

  // Vérifier l'appartenance au débrief
  let membership: { role: string } | null = null;
  if (session?.user?.id) {
    const [m] = await db
      .select({ role: debriefMembers.role })
      .from(debriefMembers)
      .where(
        and(
          eq(debriefMembers.debriefId, debrief.id),
          eq(debriefMembers.userId, session.user.id),
        ),
      )
      .limit(1);
    membership = m ?? null;
  }

  // Un débrief sans owner est accessible à tous (rétrocompatibilité)
  const canEdit = !debrief.ownerId || !!membership;
  const isOwner = membership?.role === "owner";

  const debriefData: Record<string, string> = {
    recit: debrief.recit,
    divergence: debrief.divergence,
    vigilancesAttention: debrief.vigilancesAttention,
    vigilancesSignaux: debrief.vigilancesSignaux,
    vigilancesGroupe: debrief.vigilancesGroupe,
    ecartPourquoi: debrief.ecartPourquoi,
    ecartRefaire: debrief.ecartRefaire,
    suiteEnseignements: debrief.suiteEnseignements,
    suiteVigilance: debrief.suiteVigilance,
  };

  const meta = [
    debrief.massif,
    formatDate(debrief.outingDate),
    debrief.participants,
  ]
    .filter(Boolean)
    .join(" · ");

  const progress = [
    { number: "§ 01", label: "Sortie", filled: true },
    ...SECTIONS.map((s) => ({
      number: s.number,
      label: s.shortLabel,
      filled: s.questions.some((q) => debriefData[q.key]?.trim().length > 0),
    })),
  ];
  const filledCount = progress.filter((p) => p.filled).length;

  // Liste des membres (visible pour tous les membres)
  const members = membership
    ? await db
        .select({ name: users.name, email: users.email, role: debriefMembers.role })
        .from(debriefMembers)
        .innerJoin(users, eq(debriefMembers.userId, users.id))
        .where(eq(debriefMembers.debriefId, debrief.id))
        .orderBy(debriefMembers.joinedAt)
    : [];

  // Bannière pour rejoindre si connecté mais pas membre
  const showJoinBanner =
    !!debrief.ownerId && !membership && !!session?.user?.id;
  // Bannière pour se connecter si pas authentifié et débrief protégé
  const showLoginBanner = !!debrief.ownerId && !session?.user?.id;

  return (
    <div className="wrap">
      <Header />
      <main className="debrief-main">

        {/* Bannière : rejoindre */}
        {showJoinBanner && (
          <div className="debrief-banner debrief-banner--join">
            <p className="banner-text">
              Vous avez été invité à ce débrief. Rejoignez-le pour contribuer.
            </p>
            <form action={joinDebrief.bind(null, slug)}>
              <button type="submit" className="btn-save">
                Rejoindre ce débrief
              </button>
            </form>
          </div>
        )}

        {/* Bannière : se connecter */}
        {showLoginBanner && (
          <div className="debrief-banner debrief-banner--auth">
            <p className="banner-text">
              Ce débrief est collaboratif.{" "}
              <Link href="/connexion">Connectez-vous</Link> pour rejoindre le
              groupe et contribuer.
            </p>
          </div>
        )}

        {/* En-tête */}
        <div className="debrief-top">
          <div className="debrief-top-text">
            <p className="eyebrow">
              {isOwner ? "Référent" : "Contributeur"}
            </p>
            <h1 className="debrief-title">{debrief.outingName}</h1>
            {meta && <p className="debrief-meta">{meta}</p>}
            {members.length > 0 && (
              <div className="members-list">
                {members.map((m, i) => {
                  const label = m.name?.split(" ")[0] ?? m.email?.split("@")[0] ?? "Membre";
                  return (
                    <span
                      key={i}
                      className={`member-chip${m.role === "owner" ? " member-chip--owner" : ""}`}
                      title={m.role === "owner" ? `${label} (référent)` : label}
                    >
                      {label}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
          {isOwner && <InviteButton slug={slug} />}
        </div>

        {/* Progress strip */}
        <div
          className="debrief-progress"
          role="list"
          aria-label="Sections du débrief"
        >
          {progress.map((step, i) => (
            <div
              key={i}
              role="listitem"
              className={`dp-step${step.filled ? " dp-step--done" : ""}`}
            >
              <div className="dp-dot" />
              <span className="dp-num">{step.number}</span>
              <span className="dp-label">{step.label}</span>
            </div>
          ))}
        </div>
        <p className="progress-caption">
          {filledCount === 5
            ? "Toutes les sections sont renseignées."
            : `${filledCount} section${filledCount > 1 ? "s" : ""} sur 5 renseignée${filledCount > 1 ? "s" : ""}.`}
        </p>

        {/* § 01 — La sortie */}
        {canEdit ? (
          <SortieForm
            slug={slug}
            outingName={debrief.outingName}
            massif={debrief.massif}
            outingDate={debrief.outingDate}
            participants={debrief.participants}
            locationLink={debrief.locationLink ?? null}
            gpxData={debrief.gpxData ?? null}
          />
        ) : (
          <section className="debrief-section debrief-section--done">
            <div className="section-head">
              <span className="section-num">§ 01</span>
              <h2 className="section-title-app">La sortie</h2>
              <span className="section-badge" aria-label="Section renseignée">✓</span>
            </div>
            <dl className="sortie-info">
              <div><dt>Sortie</dt><dd>{debrief.outingName}</dd></div>
              {debrief.massif && <div><dt>Massif</dt><dd>{debrief.massif}</dd></div>}
              {debrief.outingDate && <div><dt>Date</dt><dd>{formatDate(debrief.outingDate)}</dd></div>}
              {debrief.participants && <div><dt>Participants</dt><dd>{debrief.participants}</dd></div>}
            </dl>
          </section>
        )}

        {/* §§ 02–05 */}
        {canEdit ? (
          SECTIONS.map((section) => (
            <SectionForm
              key={section.key}
              slug={slug}
              section={section}
              data={debriefData}
              filled={section.questions.some(
                (q) => debriefData[q.key]?.trim().length > 0,
              )}
            />
          ))
        ) : (
          /* Lecture seule si pas autorisé */
          SECTIONS.map((section) => (
            <section key={section.key} className="debrief-section">
              <div className="section-head">
                <span className="section-num">{section.number}</span>
                <h2 className="section-title-app">{section.title}</h2>
              </div>
              <p className="section-helper">{section.helper}</p>
              {section.questions.map((q) => (
                <div key={q.key} className="field-group">
                  <p className="field-label">{q.label}</p>
                  <p className="section-readonly">
                    {debriefData[q.key] || <em>Non renseigné</em>}
                  </p>
                </div>
              ))}
            </section>
          ))
        )}

        {/* Danger zone — référent uniquement */}
        {isOwner && (
          <div className="debrief-danger">
            <DeleteDebriefButton slug={slug} />
          </div>
        )}

        {/* Footer */}
        <div className="debrief-actions">
          <span className="debrief-actions-hint">
            Partagez la trace en lecture seule avec votre groupe.
          </span>
          <Link href={`/d/${slug}/trace`} className="btn-ghost">
            Voir la trace
            <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </div>

      </main>
    </div>
  );
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}
