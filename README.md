<div align="center">

```
        ◠
      ◠◠◠◠
    ◠◠◠◠◠◠◠◠
  ━━━━━━━━━━━━
```

# Cairn

[![Keyway Secrets](https://www.keyway.sh/badge.svg?repo=ffcam-aura/cairn.lat)](https://www.keyway.sh/vaults/ffcam-aura/cairn.lat)

### Débriefer nos sorties en montagne, pour progresser ensemble.

**Une application simple, collective et open source, pour capitaliser sur chaque sortie.**

[cairn.lat](https://cairn.lat) · [Contribuer](#contribuer) · [La démarche](#la-démarche)

</div>

---

## Pourquoi Cairn&nbsp;?

Après une sortie, les enseignements du terrain se perdent souvent dans le retour à la voiture. Pourtant, c'est le moment où les écarts entre **ce qu'on avait prévu** et **ce qu'on a vécu** sont les plus parlants.

Cairn est un **outil de poche** pensé pour être sorti au pied de la voie, à la pause de midi, ou au parking avant de rouler. Il donne un fil conducteur simple pour **ancrer l'expérience**, **faire circuler la vigilance** et **alimenter les sorties suivantes**.

## Ce que propose Cairn

| # | Principe | En pratique |
|---|----------|-------------|
| 001 | **Un fil conducteur simple** | Pour animer le débrief à 2, 4 ou 8, sans qu'il se délite. |
| 002 | **Une trace écrite partageable** | Avec le groupe et les sorties suivantes, relisible six mois plus tard. |
| 003 | **Le maillon débriefing de la chaîne ReTex** | Préparation de sortie, débriefing, récit, ReTex — Cairn outille le deuxième, en lien avec Camptocamp. |

## La démarche

Cairn s'inscrit dans la lignée de la **CSV — Cartographie Systémique des Vigilances** proposée par Paulo Grobel ([csv-news.com](https://www.csv-news.com/)). L'outil n'invente pas une méthode concurrente&nbsp;: il cherche à **rendre utilisable sur le terrain** un cadre qui a déjà fait ses preuves en formation.

Le projet est pensé pour **s'articuler avec les pratiques existantes** — FFCAM, FFME, FSGT, guides ENSA — plutôt que s'y substituer. Il est délibérément **open source**, pour rester au service de la communauté, et non d'un éditeur.

---

## Ce dépôt

Ce dépôt contient l'**intégralité de l'application** Cairn, publiée sur [cairn.lat](https://cairn.lat).

### Stack

| Couche | Technologie |
|--------|-------------|
| Framework | [Next.js 16](https://nextjs.org) — App Router, React 19, Server Actions |
| Auth | [Auth.js v5](https://authjs.dev) — Google OAuth + email/mot de passe (bcrypt) |
| Base de données | [Neon](https://neon.tech) — PostgreSQL serverless |
| ORM | [Drizzle ORM](https://orm.drizzle.team) |
| Emails | [Resend](https://resend.com) — invitations collaboratives |
| Carte | [Leaflet](https://leafletjs.com) + OpenStreetMap — visualisation trace GPX |
| Style | CSS natif, palette IGN (crème, vert sapin, orange brûlé) |
| Police | [Geist](https://vercel.com/font) via `next/font` |
| Landing | [MailerLite](https://www.mailerlite.com) — capture pré-lancement |

---

## Démarrer en local

### Prérequis

- Node.js 18+
- Un projet [Neon](https://neon.tech) (plan gratuit suffisant)
- Un projet [Google Cloud](https://console.cloud.google.com) avec OAuth 2.0 activé
- Un compte [Resend](https://resend.com) pour les emails d'invitation (optionnel en dev)

### Installation

```bash
git clone https://github.com/ffcam-aura/cairn.lat.git
cd cairn.lat
npm install
cp .env.example .env.local
```

Éditez `.env.local` avec vos clés (voir [Variables d'environnement](#variables-denvironnement)).

```bash
# Créer les tables en base
npm run db:push

# Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

### Variables d'environnement

Toutes les variables sont documentées dans [`.env.example`](.env.example). Voici les étapes pour chacune&nbsp;:

#### `DATABASE_URL` — Neon Postgres

1. Créer un projet sur [neon.tech](https://neon.tech)
2. Copier la **connection string** (mode pooled) depuis l'onglet "Connection Details"
3. La coller dans `DATABASE_URL`

Puis initialiser le schéma&nbsp;:
```bash
npm run db:push
```

#### `AUTH_SECRET`

```bash
npx auth secret
```

Copier la valeur générée dans `AUTH_SECRET`.

#### `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Google OAuth

1. [Google Cloud Console](https://console.cloud.google.com) → sélectionner ou créer un projet
2. **APIs & Services → Bibliothèque** → activer **"Identity Toolkit API"**
3. **APIs & Services → Identifiants → Créer des identifiants → ID client OAuth 2.0**
4. Type d'application : **Application Web**
5. Dans **"URI de redirection autorisées"** (pas "Origines autorisées"), ajouter&nbsp;:
   - `http://localhost:3000/api/auth/callback/google` (développement)
   - `https://votre-domaine.com/api/auth/callback/google` (production)
6. Copier l'ID client et le secret dans les variables correspondantes

#### `RESEND_API_KEY` — Emails d'invitation (optionnel en dev)

1. Créer un compte sur [resend.com](https://resend.com)
2. **API Keys → Create API Key**
3. Laisser `RESEND_FROM_EMAIL` vide en local → les emails partent depuis `onboarding@resend.dev` sans configuration supplémentaire

En production, pour envoyer depuis votre domaine&nbsp;:
1. **Resend → Domains → Add Domain** → ajouter votre domaine
2. Ajouter les enregistrements DNS SPF et DKIM fournis par Resend
3. Une fois le domaine vérifié&nbsp;: `RESEND_FROM_EMAIL="Cairn <noreply@votre-domaine.com>"`

---

## Architecture

```
app/
├── page.tsx                  # Landing page (cairn.lat)
├── layout.tsx                # Layout global
├── globals.css               # Styles — CSS natif, toutes les pages
├── actions.ts                # Server Actions — toutes les mutations
│
├── nouveau/                  # Créer un débrief
│   ├── page.tsx
│   └── NouveauForm.tsx       # Formulaire client (feedback live GPX/Maps)
│
├── d/[slug]/                 # Page débrief (édition collaborative)
│   ├── page.tsx
│   ├── SortieForm.tsx        # § 01 — édition + carte GPX + localisation
│   ├── SectionForm.tsx       # §§ 02-05 — édition
│   ├── CopyLink.tsx
│   ├── sections.ts           # Définition des 5 sections
│   └── trace/                # Vue partageable (lecture seule)
│       ├── page.tsx
│       └── PrintButton.tsx
│
├── mes-debriefs/             # Dashboard utilisateur
│   └── page.tsx
│
├── connexion/                # Authentification — connexion
│   ├── page.tsx
│   ├── CredentialsForm.tsx
│   └── SubmitButton.tsx
│
├── inscription/              # Authentification — inscription
│   ├── page.tsx
│   └── RegisterForm.tsx
│
├── rejoindre/[token]/        # Accepter une invitation
│   └── page.tsx
│
├── api/auth/[...nextauth]/   # Route Auth.js
│   └── route.ts
│
└── components/
    ├── Header.tsx            # Barre de navigation
    ├── AuthNavLink.tsx       # Lien contextuel connexion/inscription
    ├── InviteButton.tsx      # Popover invitation email
    ├── PasswordInput.tsx     # Input mot de passe avec toggle visibilité
    ├── GpxMap.tsx            # Carte Leaflet — trace GPX
    └── LocationMap.tsx       # Carte Leaflet — point de localisation

auth.ts                       # Configuration Auth.js
auth.d.ts                     # Typage Auth.js (session.user.id)
lib/
├── db.ts                     # Client Drizzle + Neon
└── schema.ts                 # Schéma de base de données
drizzle.config.ts             # Configuration Drizzle Kit
```

### Modèle de données

```
users               — comptes utilisateurs (Google OAuth + credentials)
accounts            — comptes OAuth liés (Auth.js)
sessions            — sessions (Auth.js — non utilisé en mode JWT)
verificationTokens  — tokens de vérification (Auth.js)
debriefs            — débriefs (slug, sections § 01-05, localisation, GPX)
debrief_members     — membres d'un débrief (role: owner | member)
debrief_invitations — invitations en attente par email
```

### Flux d'authentification

- **Google OAuth** : `signIn("google")` → Auth.js → Google → callback → session JWT
- **Email/mot de passe** : `Credentials` provider → bcrypt compare → session JWT
- **Session** : stratégie JWT (`strategy: "jwt"`) — compatible avec le provider Credentials
- **Invitation** : token aléatoire → email Resend → `/rejoindre/[token]` → ajout en base

---

## Scripts

```bash
npm run dev          # Serveur de développement (http://localhost:3000)
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # ESLint
npm run db:push      # Appliquer le schéma Drizzle en base (sans migration)
npm run db:studio    # Interface graphique Drizzle Studio
```

### Avant de pousser

```bash
npm run lint
npx tsc --noEmit
npm run build
```

---

## Contribuer

Le code est ouvert dès le premier jour. Les contributions, issues et relectures sont bienvenues.

- **Issues&nbsp;:** [github.com/ffcam-aura/cairn.lat/issues](https://github.com/ffcam-aura/cairn.lat/issues)
- **Contact&nbsp;:** [bonjour@cairn.lat](mailto:bonjour@cairn.lat)

Que vous soyez **encadrant·e**, **pratiquant·e** ou **développeur·se**, il y a de la place. Le projet se construit avec la communauté, pas à côté d'elle.

### Conventions

- **Server Actions** dans `app/actions.ts` — toutes les mutations passent par là
- **CSS natif** dans `app/globals.css` — pas de Tailwind, pas de CSS Modules
- **Pas de commentaires de code** sauf pour une contrainte non évidente
- **Composants client** (`"use client"`) uniquement quand la réactivité est nécessaire — le reste est Server Component

---

## Licence

[AGPL-3.0](./LICENSE) — le choix est cohérent avec le positionnement&nbsp;: le code reste ouvert, et toute réutilisation (y compris sur un service en ligne) doit rester ouverte elle aussi. Pensé pour protéger le projet d'une appropriation par un éditeur.

---

<div align="center">

_45°55′N · 006°52′E_

**Cairn — projet open source indépendant.**

</div>
