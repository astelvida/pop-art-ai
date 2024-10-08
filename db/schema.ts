import { integer, text, boolean, pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";

// /**
//  * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
//  * database instance for multiple projects.
//  *
//  * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
//  */
// export const createTable = pgTableCreator((name) => `nuvela_${name}`);

export const story = pgTable("story", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  userId: varchar("userId", { length: 255 }).notNull(),
  narrationUrl: varchar("narrationUrl", { length: 2083 }), // Max URL length
  isFavorite: boolean("isFavorite").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const storyRelations = relations(story, ({ many }) => ({
  chapter: many(chapter),
}));

export const chapter = pgTable("chapter", {
  id: serial("id").primaryKey(),
  storyId: integer("storyId")
    .notNull()
    .references(() => story.id, { onDelete: "cascade" }),
  num: integer("num").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  imageUrl: varchar("imageUrl", { length: 2083 }).notNull(), // Max URL length
});

export const chapterRelations = relations(chapter, ({ one }) => ({
  story: one(story, { fields: [chapter.storyId], references: [story.id] }),
}));

export type StoryModel = InferInsertModel<typeof story>;
export type ChapterModel = InferInsertModel<typeof chapter>;

export type StorySelect = InferSelectModel<typeof story>;
export type ChapterSelect = InferSelectModel<typeof chapter>;
