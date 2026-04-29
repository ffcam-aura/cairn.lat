export type Question = {
  key: string;
  label: string;
  placeholder: string;
  rows: number;
};

export type SectionConfig = {
  key: string;
  number: string;
  shortLabel: string;
  title: string;
  helper: string;
  questions: Question[];
};

export const SECTIONS: SectionConfig[] = [
  {
    key: "vecu",
    number: "§ 02",
    shortLabel: "Vécu",
    title: "Ce qui s'est passé",
    helper:
      "Quelques phrases suffisent. L'objectif est de fixer la réalité de la journée avant que les détails s'effacent.",
    questions: [
      {
        key: "recit",
        label: "Décrivez la sortie en quelques mots",
        placeholder:
          "Départ à 5h, conditions nivo correctes jusqu'à la rimaye…",
        rows: 5,
      },
      {
        key: "divergence",
        label: "Qu'est-ce qui a divergé du plan initial ?",
        placeholder: "Demi-tour au col, horaire décalé de deux heures…",
        rows: 4,
      },
    ],
  },
  {
    key: "vigilances",
    number: "§ 03",
    shortLabel: "Vigilances",
    title: "Les vigilances",
    helper:
      "Ces moments où votre attention a changé de régime révèlent souvent les points de bascule de la journée.",
    questions: [
      {
        key: "vigilancesAttention",
        label: "Quels moments ont demandé le plus d'attention ?",
        placeholder:
          "Le passage de la rimaye, la traversée exposée en neige dure…",
        rows: 5,
      },
      {
        key: "vigilancesSignaux",
        label:
          "Y a-t-il eu des signaux faibles, des hésitations, des décisions importantes ?",
        placeholder:
          "Hésitation au départ sur la météo, remarque d'un participant non suivie…",
        rows: 5,
      },
      {
        key: "vigilancesGroupe",
        label: "Qu'est-ce qui a bien fonctionné dans le groupe ?",
        placeholder:
          "Communication fluide, décision collective pour le demi-tour…",
        rows: 4,
      },
    ],
  },
  {
    key: "ecart",
    number: "§ 04",
    shortLabel: "Écart",
    title: "L'écart plan / vécu",
    helper:
      "L'écart entre ce qu'on avait prévu et ce qu'on a vécu est la matière première du débriefing. Sans écart, pas d'enseignement.",
    questions: [
      {
        key: "ecartPourquoi",
        label:
          "Pourquoi cet écart ? (terrain, météo, groupe, fatigue, info manquante…)",
        placeholder:
          "Conditions nivologiques différentes de la prévision, fatigue accumulée…",
        rows: 5,
      },
      {
        key: "ecartRefaire",
        label: "Est-ce qu'on referait le même choix avec les mêmes infos ?",
        placeholder: "Oui / non, et pourquoi…",
        rows: 4,
      },
    ],
  },
  {
    key: "suite",
    number: "§ 05",
    shortLabel: "Suite",
    title: "Pour la suite",
    helper:
      "Ces enseignements alimentent la prochaine préparation et la mémoire collective du groupe.",
    questions: [
      {
        key: "suiteEnseignements",
        label: "Qu'est-ce qu'on emporte de cette sortie ?",
        placeholder:
          "Anticiper les conditions de neige de printemps, prévoir une marge horaire…",
        rows: 5,
      },
      {
        key: "suiteVigilance",
        label:
          "Un point de vigilance à transmettre pour les sorties suivantes ?",
        placeholder:
          "La rimaye de ce couloir est dangereuse en fin de saison…",
        rows: 4,
      },
    ],
  },
];
