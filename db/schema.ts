import { integer, text, boolean, pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";

// export const usersTable = pgTable("users", {
//   id: integer().primaryKey().generatedAlwaysAsIdentity(),
//   name: varchar({ length: 255 }).notNull(),
//   email: varchar({ length: 255 }).notNull().unique(),
// });


// /**
//  * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
//  * database instance for multiple projects.
//  *
//  * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
//  */
// export const createTable = pgTableCreator((name) => `nuvela_${name}`);

// userld
// tier
// credits
// stripe_customer_id
// stripe_subscription_id

// export const users = pgTable("users", {
//   id: serial("id").primaryKey(),
//   userId: varchar("userId", { length: 255 }).notNull(),
//   tier: varchar("tier", { length: 255 }),
//   credits: integer("credits"),
//   stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
//   stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
//   createdAt: timestamp("createdAt").notNull().defaultNow(),
//   updatedAt: timestamp("updatedAt")
//     .notNull()
//     .$onUpdate(() => new Date()),
// });


export const AiImages = pgTable("aiImage", {
  id: serial("id").primaryKey(),
  url: varchar("url", { length: 2083 }).notNull(), // Max URL length
  name: varchar("name", { length: 255 }),
  title: text("title"),
  description: text("description"),
  prompt: text("prompt").notNull(),
  model: varchar("model"),
  isFavorite: boolean("isFavorite").default(false),
  userId: varchar("userId", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});



// ## aiImages table
//   id
//   img_url
//   prompt
//   num_likes
//   creator_userld


export type AiImageInsertModel = InferInsertModel<typeof aiImage>;
export type AiImageType = InferSelectModel<typeof aiImage>;

