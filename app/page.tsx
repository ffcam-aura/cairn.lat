import Link from "next/link";
import EmailCapture from "./EmailCapture";

export default function Home() {
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
        <h1 className="headline rise d1">
          Débriefer nos sorties&nbsp;en&nbsp;montagne,{" "}
          <span className="accent">pour progresser ensemble.</span>
        </h1>
        <p className="lede rise d2">
          Une application simple, collective et open source, pour capitaliser
          sur chaque sortie.
        </p>

        <div className="rise d3">
          <EmailCapture
            submitLabel="Être informé du lancement"
            successMessage="Bien reçu — nous vous écrirons au lancement de Cairn. Merci."
          />
        </div>
        <p className="capture-note rise d4">
          Un email, au lancement. Pas de newsletter, pas de revente.
        </p>

        <div className="hero-app-cta rise d4">
          <span className="hero-app-cta-label">L'application est disponible</span>
          <Link href="/nouveau" className="btn-ghost">
            Créer un débrief
            <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </div>

        <figure
          className="hero-illus rise d4"
          aria-label="Schéma : courbes de niveau avec cairn au sommet"
        >
          <span className="caption-l">Schéma — courbes&nbsp;de&nbsp;niveau</span>
          <svg viewBox="0 0 640 200" role="img">
            <path
              className="contour"
              d="M20,175 C120,170 220,160 320,140 C380,128 430,120 480,128 C540,138 600,150 620,160"
            />
            <path
              className="contour"
              d="M20,160 C120,150 220,135 320,115 C380,102 430,92 480,100 C540,112 600,128 620,140"
            />
            <path
              className="contour"
              d="M40,145 C130,130 230,112 320,92 C380,78 430,66 480,76 C540,90 600,108 620,122"
            />
            <path
              className="contour-strong"
              d="M70,132 C160,110 250,90 320,72 C380,58 430,46 480,58 C540,74 600,94 620,108"
            />
            <path
              className="contour"
              d="M110,118 C190,95 270,72 320,58 C365,44 415,32 460,46 C510,62 570,84 620,98"
            />
            <path
              className="contour burnt"
              d="M160,102 C220,78 290,55 340,45 C385,36 425,30 450,42 C490,58 540,76 620,88"
              strokeDasharray="4 3"
            />

            <g transform="translate(408,34)">
              <ellipse className="rock" cx="14" cy="40" rx="22" ry="7" />
              <ellipse className="rock" cx="14" cy="28" rx="16" ry="5.5" />
              <ellipse className="rock" cx="14" cy="19" rx="10" ry="4" />
              <ellipse
                className="rock-accent"
                cx="14"
                cy="11"
                rx="5.5"
                ry="3"
              />
            </g>

            <text className="tick" x="20" y="192">
              1650 m
            </text>
            <text className="tick" x="302" y="192">
              S O R T I E
            </text>
            <text className="tick" x="560" y="192">
              3100 m
            </text>

            <g stroke="#2E4A3A" strokeWidth="0.8" opacity="0.6">
              <line x1="200" y1="119" x2="200" y2="124" />
              <line x1="300" y1="97" x2="300" y2="102" />
              <line x1="540" y1="84" x2="540" y2="89" />
            </g>
          </svg>
          <figcaption className="caption">Fig. 01</figcaption>
        </figure>
      </section>

      <section>
        <p className="eyebrow">§ 01 — Le problème</p>
        <h2 className="section-title">Pourquoi débriefer&nbsp;?</h2>
        <p className="body-text">
          Un débriefing structuré permet de mettre l&apos;accent sur{" "}
          <strong>ce qui a bien fonctionné</strong>, et, par la réflexion
          collective, de trouver des axes d&apos;amélioration. Mais bien
          souvent, ces échanges se perdent au retour de la sortie.
        </p>
        <p className="body-text">
          Cairn aide à <strong>structurer l&apos;exercice</strong>,{" "}
          <strong>ancrer</strong> ce qui a été dit, <strong>capitaliser</strong>{" "}
          les enseignements, et <strong>valoriser</strong> les réflexions en
          les partageant au-delà du groupe.
        </p>
      </section>

      <section>
        <p className="eyebrow">§ 02 — La solution</p>
        <h2 className="section-title">Ce que propose Cairn</h2>
        <p className="body-text">
          Un outil de poche, toujours avec soi, pensé pour être utilisable au
          pied de la voie, à la terrasse du café, ou entre les participants
          avant de rentrer chez soi.
        </p>
        <ul className="tenets">
          <li>
            <span className="num">001</span>
            <span className="tenet-body">
              <span className="lead">Un fil conducteur simple</span>
              <span className="sub">
                pour animer le débrief à 2, 4 ou 8, sans qu&apos;il parte
                dans tous les sens.
              </span>
            </span>
          </li>
          <li>
            <span className="num">002</span>
            <span className="tenet-body">
              <span className="lead">Une trace écrite partageable</span>
              <span className="sub">
                avec le groupe et les sorties suivantes, relisible six mois plus
                tard.
              </span>
            </span>
          </li>
          <li>
            <span className="num">003</span>
            <span className="tenet-body">
              <span className="lead">Le maillon débriefing de la chaîne ReTex</span>
              <span className="sub">
                Préparation de sortie, débriefing, récit, ReTex —
                Cairn outille le deuxième, en lien avec Camptocamp.
              </span>
            </span>
          </li>
        </ul>
      </section>

      <section>
        <p className="eyebrow">§ 03 — La démarche</p>
        <h2 className="section-title">Une démarche alignée</h2>
        <p className="body-text">
          Cairn s&apos;inscrit dans la lignée de la{" "}
          <strong>
            CSV — Cartographie Systémique des Vigilances
          </strong>
          , vulgarisée par Paulo Grobel. L&apos;outil ne réinvente pas cette
          méthode&nbsp;: il s&apos;en inspire pour aller au-delà de la
          préparation de sortie, premier maillon de la chaîne ReTex.
        </p>
        <p className="body-text">
          Le projet est pensé pour{" "}
          <strong>s&apos;articuler avec les pratiques existantes</strong>, et
          reste <strong>ouvert aux retours</strong>{" "}de celles et ceux qui
          encadrent à la FFCAM, FFME, FSGT, ou côté guides ENSA — plutôt que de
          s&apos;y substituer. Il
          est délibérément <strong>open source</strong>, pour rester au service
          de la communauté, et non d&apos;un éditeur.
        </p>

        <figure
          className="demarche-illus"
          aria-label="Schéma CSV simplifié : cercles de vigilance sur un tracé"
        >
          <svg viewBox="0 0 520 180" role="img">
            <path
              className="trace"
              d="M30,130 Q110,50 200,80 T380,70 Q450,65 495,40"
            />
            <path
              className="trace-dash"
              d="M200,80 Q240,115 310,110 Q360,108 380,70"
            />

            <g>
              <circle className="v" cx="30" cy="130" r="6" />
              <circle className="v" cx="110" cy="82" r="9" />
              <circle className="v-burnt" cx="200" cy="80" r="11" />
              <circle className="v" cx="310" cy="110" r="8" />
              <circle className="v-burnt" cx="380" cy="70" r="9" />
              <circle className="v" cx="495" cy="40" r="6" />
              <circle className="v-fill" cx="200" cy="80" r="2.2" />
              <circle className="v-fill" cx="380" cy="70" r="2.2" />
            </g>

            <text className="lbl-m" x="12" y="152">
              Départ
            </text>
            <text className="lbl" x="92" y="62">
              Nivo
            </text>
            <text className="lbl" x="178" y="58">
              Groupe
            </text>
            <text className="lbl" x="290" y="132">
              Horaire
            </text>
            <text className="lbl" x="360" y="50">
              Engagement
            </text>
            <text className="lbl-m" x="470" y="24">
              Sommet
            </text>
          </svg>
          <div className="legend">
            <span>
              <span className="dot" role="presentation" />
              Vigilance observée
            </span>
            <span>
              <span className="dot burnt" role="presentation" />
              Point de bascule
            </span>
            <span>
              <span className="dot filled" role="presentation" />
              Décision actée
            </span>
          </div>
        </figure>

        <p className="attribution">
          Un projet porté par des bénévoles de la montagne, ouvert à toute
          personne qui pratique ou encadre.
        </p>
      </section>

      <section>
        <p className="eyebrow">§ 04 — Rejoindre</p>
        <h2 className="section-title">Rejoindre le projet</h2>
        <p className="body-text">
          Deux manières d&apos;avancer avec nous, selon ce que vous apportez.
        </p>

        <div className="two-col">
          <div>
            <div className="col-label">
              <span className="tick" />
              Pour&nbsp;/ 01
            </div>
            <h3 className="col-title">Vous encadrez ou vous pratiquez</h3>
            <p className="col-desc">
              Vous animez des sorties, ou vous en vivez côté cordée. Nous vous
              préviendrons quand l&apos;outil sera testable.
            </p>
            <EmailCapture
              submitLabel="Me tenir au courant"
              successMessage="Merci — c'est noté. À bientôt."
              placeholder="votre email"
              fullWidth
            />
          </div>
          <div>
            <div className="col-label">
              <span className="tick" />
              Pour&nbsp;/ 02
            </div>
            <h3 className="col-title">Vous développez ou contribuez côté tech</h3>
            <p className="col-desc">
              Le code est ouvert dès le premier jour. Les contributions, issues
              et relectures sont bienvenues.
            </p>
            <a
              className="btn-ghost"
              href="https://github.com/ffcam-aura/cairn.lat"
              target="_blank"
              rel="noopener noreferrer"
            >
              github.com/ffcam-aura/cairn.lat
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </a>
          </div>
        </div>
      </section>

      <footer>
        <div>Cairn — projet open source indépendant.</div>
        <nav>
          <Link href="/politique-confidentialite">Confidentialité</Link>
          <a href="mailto:bonjour@cairn.lat">bonjour@cairn.lat</a>
        </nav>
        <div className="coord">45°55′N · 006°52′E</div>
      </footer>
    </div>
  );
}
