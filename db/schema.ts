import { integer, text, boolean, pgTable, serial, varchar, timestamp, index, uuid } from 'drizzle-orm/pg-core'
import { InferInsertModel, InferSelectModel, relations, sql } from 'drizzle-orm'

export const AiImages = pgTable(
  'aiImages',
  {
    id: serial('id').primaryKey(),
    predictionId: varchar('predictionId', { length: 255 }).unique().notNull(),
    userId: varchar('userId', { length: 255 }).notNull(),
    imageUrl: varchar('imageUrl', { length: 2083 }).notNull().unique(), // Max URL length
    aspectRatio: varchar('aspectRatio', { length: 255 }).notNull(),
    prompt: text('prompt').notNull(),
    title: text('title'),
    caption: text('caption'),
    description: text('description'),
    liked: boolean('liked').default(false),
    numLikes: integer('numLikes').default(0),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    userIdIdx: index('aiImage_userId_idx').on(table.userId),
  }),
)

export const Likes = pgTable(
  'likes',
  {
    id: serial('id').primaryKey(),
    userId: varchar('userId', { length: 255 }).notNull(),
    aiImageId: integer('aiImageId')
      .notNull()
      .references(() => AiImages.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    userIdAiImageIdIdx: index('likes_userId_aiImageId_idx').on(table.userId, table.aiImageId),
  }),
)

export type AiImageInsertModel = InferInsertModel<typeof AiImages>
export type AiImage = InferSelectModel<typeof AiImages>
