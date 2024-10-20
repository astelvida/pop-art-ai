import { integer, text, boolean, pgTable, serial, varchar, timestamp, index } from 'drizzle-orm/pg-core'
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm'

export const AiImages = pgTable(
  'aiImage',
  {
    id: serial('id').primaryKey(),
    userId: varchar('userId', { length: 255 }).notNull(),
    url: varchar('url', { length: 2083 }).notNull(), // Max URL length
    prompt: text('prompt').notNull(),
    name: varchar('name', { length: 255 }),
    title: text('title'),
    description: text('description'),
    caption: text('caption'),
    nextPrompt: text('nextPrompt'),
    isTextAccurate: boolean('isTextAccurate'),
    model: varchar('model'),
    isFavorite: boolean('isFavorite').default(false),
    favoriteCount: integer('favoriteCount').default(0),
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

// ## aiImages table
//   id
//   img_url
//   prompt
//   num_likes
//   creator_userld

export type AiImageInsertModel = InferInsertModel<typeof AiImages>
export type AiImageType = InferSelectModel<typeof AiImages>
