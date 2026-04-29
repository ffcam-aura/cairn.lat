import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { debriefs, debriefMembers } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { Header } from "@/app/components/Header";
import { InviteButton } from "@/app/components/InviteButton";
import { DeleteDebriefButton } from "@/app/d/[slug]/DeleteDebriefButton";

export const metadata = {
  title: "Mes débriefs — Cairn",
};

export default async function MesDebriefs() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");

  const rows = await db
    .select({
      slug: debriefs.slug,
      outingName: debriefs.outingName,
      massif: debriefs.massif,
      outingDate: debriefs.outingDate,
      participants: debriefs.participants,
      updatedAt: debriefs.updatedAt,
      role: debriefMembers.role,
    })
    .from(debriefMembers)
    .innerJoin(debriefs, eq(debriefMembers.debriefId, debriefs.id))
    .where(eq(debriefMembers.userId, session.user.id))
    .orderBy(desc(debriefs.updatedAt));

  const owned = rows.filter((r) => r.role === "owner");
  const joined = rows.filter((r) => r.role === "member");

  return (
    <div className="wrap">
      <Header />
      <main className="md-main">
        <div className="md-header">
          <p className="eyebrow">Espace personnel</p>
          <h1 className="section-title">Mes débriefs</h1>
          {session.user.name && (
            <p className="md-welcome">
              Bienvenue, {session.user.name.split(" ")[0]}.
            </p>
          )}
        </div>

        <div className="md-actions">
          <Link href="/nouveau" className="btn-ghost">
            Nouveau débrief
            <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </div>

        {rows.length === 0 ? (
          <div className="md-empty">
            <p>Vous n&apos;avez pas encore de débrief.</p>
            <p>
              <Link href="/nouveau">Créez votre premier débrief →</Link>
            </p>
          </div>
        ) : (
          <div className="md-lists">
            {owned.length > 0 && (
              <section className="md-section">
                <h2 className="md-section-title">Référent</h2>
                <ul className="md-list">
                  {owned.map((d) => (
                    <li key={d.slug}>
                      <DebriefCard debrief={d} />
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {joined.length > 0 && (
              <section className="md-section">
                <h2 className="md-section-title">Contributeur</h2>
                <ul className="md-list">
                  {joined.map((d) => (
                    <li key={d.slug}>
                      <DebriefCard debrief={d} />
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

type CardProps = {
  debrief: {
    slug: string;
    outingName: string;
    massif: string;
    outingDate: string;
    participants: string;
    updatedAt: Date;
    role: string;
  };
};

function DebriefCard({ debrief }: CardProps) {
  const meta = [
    debrief.massif,
    formatDate(debrief.outingDate),
    debrief.participants,
  ]
    .filter(Boolean)
    .join(" · ");

  const updated = debrief.updatedAt.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="md-card-row">
      <Link href={`/d/${debrief.slug}`} className="md-card">
        <div className="md-card-main">
          <p className="md-card-title">{debrief.outingName}</p>
          {meta && <p className="md-card-meta">{meta}</p>}
        </div>
        <div className="md-card-right">
          <span className="md-card-date">modifié le {updated}</span>
          <span className="arrow md-card-arrow" aria-hidden="true">→</span>
        </div>
      </Link>
      {debrief.role === "owner" && (
        <>
          <InviteButton slug={debrief.slug} compact />
          <DeleteDebriefButton slug={debrief.slug} compact />
        </>
      )}
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
