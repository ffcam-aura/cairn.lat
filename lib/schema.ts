import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  primaryKey,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/* ─── Auth.js — tables requises par @auth/drizzle-adapter ── */

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  passwordHash: text("password_hash"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ]
);

export const sessions = pgTable("sessions", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationTokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })]
);

/* ─── Cairn — tables métier ─────────────────────────────── */

export const debriefs = pgTable("debriefs", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  ownerId: text("owner_id").references(() => users.id, {
    onDelete: "set null",
  }),
  // § 01 — La sortie
  outingName: text("outing_name").notNull(),
  massif: text("massif").notNull().default(""),
  outingDate: text("outing_date").notNull().default(""),
  participants: text("participants").notNull().default(""),
  // § 02 — Ce qui s'est passé
  recit: text("recit").notNull().default(""),
  divergence: text("divergence").notNull().default(""),
  // § 03 — Les vigilances
  vigilancesAttention: text("vigilances_attention").notNull().default(""),
  vigilancesSignaux: text("vigilances_signaux").notNull().default(""),
  vigilancesGroupe: text("vigilances_groupe").notNull().default(""),
  // § 04 — L'écart plan / vécu
  ecartPourquoi: text("ecart_pourquoi").notNull().default(""),
  ecartRefaire: text("ecart_refaire").notNull().default(""),
  // § 05 — Pour la suite
  suiteEnseignements: text("suite_enseignements").notNull().default(""),
  suiteVigilance: text("suite_vigilance").notNull().default(""),
  // Localisation & trace
  locationLink: text("location_link"),
  gpxData: text("gpx_data"),
  // Méta
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const debriefMembers = pgTable(
  "debrief_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    debriefId: uuid("debrief_id")
      .notNull()
      .references(() => debriefs.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: text("role").notNull().default("member"), // "owner" | "member"
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("debrief_members_uniq").on(t.debriefId, t.userId)]
);

export const debriefInvitations = pgTable("debrief_invitations", {
  id: uuid("id").primaryKey().defaultRandom(),
  debriefId: uuid("debrief_id")
    .notNull()
    .references(() => debriefs.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  token: text("token").notNull().unique(),
  invitedBy: text("invited_by")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  acceptedAt: timestamp("accepted_at"),
});

export type Debrief = typeof debriefs.$inferSelect;
export type DebriefMember = typeof debriefMembers.$inferSelect;
export type User = typeof users.$inferSelect;
