import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Cairn",
  description:
    "Quelles données nous collectons sur cairn.lat, pourquoi, et vos droits dessus.",
};

export default function PolitiqueConfidentialite() {
  return (
    <div className="wrap">
      <header className="top">
        <Link className="brand" href="/" aria-label="Cairn, accueil">
          <svg
            className="brand-mark"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 19 H20"
              stroke="#2E4A3A"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
            <path
              d="M6.5 19 C6.5 16.2 9 14.5 12 14.5 C15 14.5 17.5 16.2 17.5 19"
              stroke="#2E4A3A"
              strokeWidth="1.3"
              fill="none"
              strokeLinejoin="round"
            />
            <path
              d="M8.5 14.8 C8.5 12.8 10 11.3 12 11.3 C14 11.3 15.5 12.8 15.5 14.8"
              stroke="#2E4A3A"
              strokeWidth="1.3"
              fill="none"
              strokeLinejoin="round"
            />
            <path
              d="M10.3 11.5 C10.3 10 11 9 12 9 C13 9 13.7 10 13.7 11.5"
              stroke="#A84912"
              strokeWidth="1.3"
              fill="none"
              strokeLinejoin="round"
            />
          </svg>
          <span className="brand-name">
            Cairn<span className="brand-dot" />
            <span className="brand-tld">cairn.lat</span>
          </span>
        </Link>
      </header>

      <section className="hero">
        <p className="eyebrow">Confidentialité</p>
        <h1 className="headline">Politique de confidentialité</h1>
        <p className="lede">
          Ce que nous collectons sur cairn.lat, pourquoi, et vos droits dessus.
        </p>
        <p className="capture-note">Dernière mise à jour&nbsp;: 17 avril 2026.</p>
      </section>

      <section>
        <p className="eyebrow">§ 01 — Qui sommes-nous</p>
        <h2 className="section-title">Responsable du traitement</h2>
        <p className="body-text">
          Cairn est un projet open source indépendant, porté par des bénévoles
          issus de la FFCAM. Le site cairn.lat présente le projet et collecte
          des adresses email pour prévenir du lancement public.
        </p>
        <p className="body-text">
          Contact&nbsp;:{" "}
          <a href="mailto:bonjour@cairn.lat">bonjour@cairn.lat</a>.
        </p>
      </section>

      <section>
        <p className="eyebrow">§ 02 — Quelles données</p>
        <h2 className="section-title">Une seule donnée&nbsp;: votre email</h2>
        <p className="body-text">
          Nous collectons <strong>uniquement l&apos;adresse email</strong> que
          vous saisissez dans le formulaire d&apos;inscription au lancement.
          Pas de nom, pas de prénom, pas de localisation, pas de profil.
        </p>
        <p className="body-text">
          Vercel, notre hébergeur, enregistre des logs techniques standards
          (adresse IP, user-agent) pour assurer la diffusion du site. Ces logs
          ne sont pas croisés avec votre adresse email.
        </p>
      </section>

      <section>
        <p className="eyebrow">§ 03 — Pourquoi</p>
        <h2 className="section-title">Finalité et base légale</h2>
        <p className="body-text">
          Un seul usage&nbsp;: <strong>vous envoyer un email quand Cairn sera
          disponible publiquement</strong>. Pas de newsletter périodique, pas
          de revente, pas de partage avec des tiers à d&apos;autres fins.
        </p>
        <p className="body-text">
          Base légale&nbsp;: votre <strong>consentement explicite</strong>{" "}
          (art. 6.1.a du RGPD), donné en soumettant le formulaire. Vous
          pouvez vous désinscrire à tout moment depuis le lien présent dans
          chaque email reçu.
        </p>
      </section>

      <section>
        <p className="eyebrow">§ 04 — Où</p>
        <h2 className="section-title">Sous-traitants</h2>
        <p className="body-text">
          Votre adresse email est stockée chez{" "}
          <strong>
            <a
              href="https://www.mailerlite.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              MailerLite
            </a>
          </strong>{" "}
          (UAB Mailerlite, Vilnius, Lituanie — UE), notre prestataire
          d&apos;envoi d&apos;emails.
        </p>
        <p className="body-text">
          Le site est hébergé par{" "}
          <strong>
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vercel
            </a>
          </strong>{" "}
          (Vercel Inc., États-Unis). Vercel peut traiter des données techniques
          de diffusion — pas votre email — dans le cadre du service.
        </p>
      </section>

      <section>
        <p className="eyebrow">§ 05 — Combien de temps</p>
        <h2 className="section-title">Durée de conservation</h2>
        <p className="body-text">
          Votre email reste dans la liste MailerLite{" "}
          <strong>jusqu&apos;à votre désinscription</strong> (lien présent dans
          chaque email envoyé) ou jusqu&apos;à la clôture du projet.
        </p>
      </section>

      <section>
        <p className="eyebrow">§ 06 — Cookies</p>
        <h2 className="section-title">Pas de cookies, pas de pistage</h2>
        <p className="body-text">
          cairn.lat n&apos;utilise <strong>aucun cookie</strong> et
          n&apos;intègre aucun outil d&apos;analyse tiers (pas de Google
          Analytics, pas de pixel publicitaire).
        </p>
        <p className="body-text">
          Un petit marqueur est enregistré dans le <code>localStorage</code>{" "}
          de votre navigateur pour se souvenir que vous vous êtes inscrit·e —
          il ne quitte jamais votre appareil.
        </p>
      </section>

      <section>
        <p className="eyebrow">§ 07 — Vos droits</p>
        <h2 className="section-title">Ce que vous pouvez faire</h2>
        <p className="body-text">
          Conformément au RGPD, vous pouvez à tout moment exercer vos droits
          d&apos;<strong>accès</strong>, <strong>rectification</strong>,{" "}
          <strong>effacement</strong>, <strong>opposition</strong>,{" "}
          <strong>portabilité</strong>, et <strong>retrait du consentement</strong>.
        </p>
        <p className="body-text">
          Pour désinscription immédiate&nbsp;: le lien figure en bas de chaque
          email reçu. Pour toute autre demande, écrivez à{" "}
          <a href="mailto:bonjour@cairn.lat">bonjour@cairn.lat</a> — réponse
          sous 30 jours.
        </p>
        <p className="body-text">
          Vous pouvez également introduire une réclamation auprès de la{" "}
          <a
            href="https://www.cnil.fr"
            target="_blank"
            rel="noopener noreferrer"
          >
            CNIL
          </a>
          .
        </p>
      </section>

      <section>
        <p className="eyebrow">§ 08 — Évolutions</p>
        <h2 className="section-title">Modifications de cette page</h2>
        <p className="body-text">
          Cette politique peut évoluer. La date de dernière mise à jour figure
          en tête de page. Les changements significatifs seront annoncés par
          email aux inscrit·es.
        </p>
      </section>

      <footer>
        <div>Cairn — projet open source indépendant.</div>
        <nav>
          <Link href="/">Retour à l&apos;accueil</Link>
          <a href="mailto:bonjour@cairn.lat">bonjour@cairn.lat</a>
        </nav>
        <div className="coord">45°55′N · 006°52′E</div>
      </footer>
    </div>
  );
}
