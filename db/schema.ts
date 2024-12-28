import { integer, text, boolean, pgTable, serial, varchar, timestamp, index, uuid, vector } from 'drizzle-orm/pg-core'
import { InferInsertModel, InferSelectModel, relations, sql } from 'drizzle-orm'

export const Users = pgTable('users', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  credits: integer('credits').default(10),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
})

export const AiImages = pgTable(
  'aiImages',
  {
    id: serial('id').primaryKey(),
    userId: varchar('userId', { length: 255 })
      .notNull()
      .references(() => Users.id),
    imageUrl: varchar('imageUrl', { length: 2083 }).notNull().unique(), // Max URL length
    aspectRatio: varchar('aspectRatio', { length: 255 }).notNull(),
    prompt: text('prompt').notNull(),
    title: text('title'),
    caption: text('caption'),
    description: text('description'),
    numLikes: integer('numLikes').default(0),
    // embedding: sql<number[]>`vector`,
    embedding: vector('embedding', { dimensions: 1536 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    userIdIdx: index('aiImage_userId_idx').on(table.userId),
    embeddingIdx: index('aiImage_embedding_idx').using('hnsw', table.embedding.op('vector_cosine_ops')),
  }),
)

export const Likes = pgTable(
  'likes',
  {
    id: serial('id').primaryKey(),
    userId: varchar('userId', { length: 255 })
      .notNull()
      .references(() => Users.id),
    aiImageId: integer('aiImageId')
      .notNull()
      .references(() => AiImages.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    userIdAiImageIdIdx: index('likes_userId_aiImageId_idx').on(table.userId, table.aiImageId),
  }),
)

export const usersRelations = relations(Users, ({ many }) => ({
  aiImages: many(AiImages),
  likes: many(Likes),
}))

export const aiImagesRelations = relations(AiImages, ({ one, many }) => ({
  user: one(Users, {
    fields: [AiImages.userId],
    references: [Users.id],
  }),
  likes: many(Likes),
}))

export const likesRelations = relations(Likes, ({ one }) => ({
  user: one(Users, {
    fields: [Likes.userId],
    references: [Users.id],
  }),
  aiImage: one(AiImages, {
    fields: [Likes.aiImageId],
    references: [AiImages.id],
  }),
}))

export type User = InferSelectModel<typeof Users>
export type UserInsert = InferInsertModel<typeof Users>

export type AiImage = InferSelectModel<typeof AiImages>
export type AiImageInsert = InferInsertModel<typeof AiImages>

export type Like = InferSelectModel<typeof Likes>
export type LikeInsert = InferInsertModel<typeof Likes>

export interface AiImageResult extends AiImage {
  isLikedByUser: boolean
}
