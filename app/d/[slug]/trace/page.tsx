import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { debriefs } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { Header } from "@/app/components/Header";
import { CopyLink } from "../CopyLink";
import { PrintButton } from "./PrintButton";
import { GpxMap } from "@/app/components/GpxMap";
import { SECTIONS } from "../sections";

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
    title: d ? `Trace — ${d.outingName} · Cairn` : "Trace · Cairn",
  };
}

export default async function TracePage({ params }: Props) {
  const { slug } = await params;
  const [debrief] = await db
    .select()
    .from(debriefs)
    .where(eq(debriefs.slug, slug))
    .limit(1);

  if (!debrief) notFound();

  const traceUrl = `https://cairn.lat/d/${slug}/trace`;

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

  const debriefDate = formatDate(debrief.outingDate);
  const createdDate = debrief.createdAt.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="wrap">
      {/* Masqué à l'impression */}
      <div className="no-print">
        <Header />
        <div className="trace-toolbar">
          <Link href={`/d/${slug}`} className="trace-back">
            ← Modifier
          </Link>
          <div className="trace-toolbar-right">
            <CopyLink url={traceUrl} label="Copier le lien" />
            <PrintButton />
          </div>
        </div>
      </div>

      {/* Document — visible à l'impression */}
      <main className="trace-main">

        {/* En-tête document */}
        <header className="trace-doc-header">
          <div className="trace-doc-kicker">
            <span className="trace-doc-brand">Cairn</span>
            <span className="trace-doc-divider">·</span>
            <span>Trace de débrief</span>
          </div>
          <h1 className="trace-doc-title">{debrief.outingName}</h1>
          <div className="trace-doc-meta">
            {debrief.massif && (
              <span className="trace-meta-item">
                <span className="trace-meta-key">Massif</span>
                {debrief.massif}
              </span>
            )}
            {debriefDate && (
              <span className="trace-meta-item">
                <span className="trace-meta-key">Date</span>
                {debriefDate}
              </span>
            )}
            {debrief.participants && (
              <span className="trace-meta-item">
                <span className="trace-meta-key">Participants</span>
                {debrief.participants}
              </span>
            )}
          </div>
        </header>

        {/* Corps du document */}
        <div className="trace-body">
          {SECTIONS.map((section) => {
            const hasContent = section.questions.some(
              (q) => debriefData[q.key]?.trim()
            );
            return (
              <section
                key={section.key}
                className={`trace-section${!hasContent ? " trace-section--empty" : ""}`}
              >
                <div className="trace-section-head">
                  <span className="trace-section-num">{section.number}</span>
                  <h2 className="trace-section-title">{section.title}</h2>
                </div>
                <div className="trace-fields">
                  {section.questions.map((q) => {
                    const answer = debriefData[q.key];
                    return (
                      <div key={q.key} className="trace-field">
                        <p className="trace-q">{q.label}</p>
                        {answer?.trim() ? (
                          <p className="trace-a">{answer}</p>
                        ) : (
                          <p className="trace-a trace-a--empty">
                            Non renseigné
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {/* Localisation & trace GPX */}
        {(debrief.locationLink || debrief.gpxData) && (
          <section className="trace-section trace-section--map no-print-map">
            <div className="trace-section-head">
              <span className="trace-section-num">§ 01</span>
              <h2 className="trace-section-title">Localisation</h2>
            </div>
            {debrief.locationLink && (
              <a
                href={debrief.locationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="gpx-map-link"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                Voir sur la carte
              </a>
            )}
            {debrief.gpxData && <GpxMap gpxData={debrief.gpxData} />}
          </section>
        )}

        {/* Maillon ReTex */}
        <div className="trace-retex">
          <p className="trace-retex-label">Chaîne ReTex — position de ce débrief</p>
          <div className="trace-retex-chain">
            <span className="retex-step">Préparation</span>
            <span className="retex-arrow">→</span>
            <span className="retex-step retex-step--current">Débriefing</span>
            <span className="retex-arrow">→</span>
            <span className="retex-step">Récit</span>
            <span className="retex-arrow">→</span>
            <span className="retex-step">ReTex</span>
          </div>
          <p className="trace-retex-hint">
            Prochaine étape : publiez le récit de cette sortie sur{" "}
            <a
              href="https://www.camptocamp.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              camptocamp.org
            </a>{" "}
            pour partager les enseignements au-delà du groupe.
          </p>
        </div>

        {/* Pied de document */}
        <footer className="trace-doc-footer">
          <span>Débrief créé le {createdDate}</span>
          <span className="trace-footer-sep">·</span>
          <a href="https://cairn.lat">cairn.lat</a>
        </footer>

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
