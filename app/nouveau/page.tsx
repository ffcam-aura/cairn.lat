import { Header } from "@/app/components/Header";
import { NouveauForm } from "./NouveauForm";

export const metadata = {
  title: "Nouveau débrief — Cairn",
};

const STEPS = [
  { num: "01", label: "La sortie", current: true },
  { num: "02", label: "Ce qui s'est passé", current: false },
  { num: "03", label: "Les vigilances", current: false },
  { num: "04", label: "L'écart", current: false },
  { num: "05", label: "Pour la suite", current: false },
];

export default async function NouveauPage() {

  return (
    <div className="wrap">
      <Header />
      <main className="nouveau-main">

        <div className="nouveau-header">
          <p className="eyebrow">§ 01 — La sortie</p>
          <h1 className="section-title">Nouveau débrief</h1>
          <p className="body-text">
            Cinq sections, dix minutes. Le groupe répond ensemble — une
            personne saisit, tous contribuent.
          </p>
        </div>

        {/* Fil des étapes */}
        <div className="steps-strip" aria-label="Étapes du débrief">
          {STEPS.map((s, i) => (
            <div
              key={s.num}
              className={`step-item${s.current ? " step-item--current" : ""}`}
            >
              <span className="step-num">{s.num}</span>
              <span className="step-label">{s.label}</span>
              {i < STEPS.length - 1 && (
                <span className="step-arrow" aria-hidden="true">→</span>
              )}
            </div>
          ))}
        </div>

        <NouveauForm />

      </main>
    </div>
  );
}
