<div align="center">

```
        ◠
      ◠◠◠◠
    ◠◠◠◠◠◠◠◠
  ━━━━━━━━━━━━
```

# Cairn

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
| 003 | **Un maillon dans la chaîne du RETEX** | En montagne, à terme en lien avec Camptocamp et la base Sérac. |

## La démarche

Cairn s'inscrit dans la lignée de la **CSV — Cartographie Systémique des Vigilances** proposée par Paulo Grobel ([csv-news.com](https://www.csv-news.com/)). L'outil n'invente pas une méthode concurrente&nbsp;: il cherche à **rendre utilisable sur le terrain** un cadre qui a déjà fait ses preuves en formation.

Le projet est pensé pour **s'articuler avec les pratiques existantes** — FFCAM, FFME, FSGT, guides ENSA — plutôt que s'y substituer. Il est délibérément **open source**, pour rester au service de la communauté, et non d'un éditeur.

## Ce dépôt

Ce dépôt contient le **site de présentation** du projet, publié sur [cairn.lat](https://cairn.lat). Il sert de point d'entrée&nbsp;: comprendre la démarche, rester informé du lancement, rejoindre les contributeurs.

L'application elle-même arrive ensuite.

### Stack

- [Next.js 16](https://nextjs.org) (App Router, React 19)
- [Geist](https://vercel.com/font) via `next/font`
- CSS natif, palette inspirée des cartes IGN (crème, vert sapin, orange brûlé)
- [MailerLite](https://www.mailerlite.com) pour la capture des inscriptions au lancement

### Démarrer en local

```bash
npm install
cp .env.example .env.local
# éditer .env.local avec vos clés MailerLite
npm run dev
```

Puis ouvrir [http://localhost:3000](http://localhost:3000).

### Variables d'environnement

| Variable | Description |
|----------|-------------|
| `MAILERLITE_API_KEY` | Clé générée depuis MailerLite → *Integrations* → *Developer API* |
| `MAILERLITE_GROUP_ID` | ID du groupe « Cairn — prélancement » |

Sans ces variables, le formulaire d'inscription renvoie une erreur serveur (la page se charge normalement).

### Vérifier avant de pousser

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Contribuer

Le code est ouvert dès le premier jour. Les contributions, issues et relectures sont bienvenues.

- **Issues&nbsp;:** [github.com/ffcam-aura/cairn.lat/issues](https://github.com/ffcam-aura/cairn.lat/issues)
- **Contact&nbsp;:** [bonjour@cairn.lat](mailto:bonjour@cairn.lat)

Que vous soyez **encadrant·e**, **pratiquant·e** ou **développeur·se**, il y a de la place. Le projet se construit avec la communauté, pas à côté d'elle.

## Licence

[AGPL-3.0](./LICENSE) — le choix est cohérent avec le positionnement&nbsp;: le code reste ouvert, et toute réutilisation (y compris sur un service en ligne) doit rester ouverte elle aussi. Pensé pour protéger le projet d'une appropriation par un éditeur.

---

<div align="center">

_45°55′N · 006°52′E_

**Cairn — projet open source indépendant.**

</div>
