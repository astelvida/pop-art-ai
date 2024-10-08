import { integer, text, boolean, pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";

// /**
//  * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
//  * database instance for multiple projects.
//  *
//  * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
//  */
// export const createTable = pgTableCreator((name) => `nuvela_${name}`);

export const aiImage = pgTable("aiImage", {
  id: serial("id").primaryKey(),
  userId: varchar("userId", { length: 255 }).notNull(),
  url: varchar("url", { length: 2083 }).notNull(), // Max URL length
  prompt: text("prompt").notNull(),
  model: varchar("model"),
  title: text("title"),
  description: text("description"),
  isFavorite: boolean("isFavorite").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});


export type AiImageInsertModel = InferInsertModel<typeof aiImage>;
export type AiImageSelectModel = InferSelectModel<typeof aiImage>;

