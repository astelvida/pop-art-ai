import {
  integer,
  text,
  boolean,
  pgTable,
  serial,
  varchar,
  timestamp,
  index,
  uuid,
  vector,
} from 'drizzle-orm/pg-core'
import { InferInsertModel, InferSelectModel, relations, sql } from 'drizzle-orm'

export const Users = pgTable('users', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  avatarUrl: varchar('avatarUrl', { length: 2083 }),
  credits: integer('credits').default(10),
  stripeCustomerId: varchar('stripeCustomerId', { length: 255 }).unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
})

export const AiImages = pgTable(
  'aiImages',
  {
    id: serial('id').primaryKey(),
    prompt: text('prompt').notNull(),
    aspectRatio: varchar('aspectRatio', { length: 255 }).notNull(),
    imageUrl: varchar('imageUrl', { length: 2083 }).notNull().unique(), // Max URL length
    title: text('title'),
    caption: text('caption'),
    description: text('description'),

    numLikes: integer('numLikes').default(0),
    // embedding: sql<number[]>`vector`,
    embedding: vector('embedding', { dimensions: 1536 }),
    userId: varchar('userId', { length: 255 })
      .notNull()
      .references(() => Users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    userIdIdx: index('aiImage_userId_idx').on(table.userId),
    embeddingIdx: index('aiImage_embedding_idx').using(
      'hnsw',
      table.embedding.op('vector_cosine_ops')
    ),
  })
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
  })
)

export const Payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  userId: varchar('userId', { length: 255 })
    .notNull()
    .references(() => Users.id),
  amount: integer('amount').notNull(), // Amount in cents
  credits: integer('credits').notNull(), // Number of credits purchased
  status: varchar('status', { length: 50 }).notNull(), // 'succeeded', 'pending', 'failed'
  stripePaymentId: varchar('stripePaymentId', { length: 255 }).unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

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

export const paymentsRelations = relations(Payments, ({ one }) => ({
  user: one(Users, {
    fields: [Payments.userId],
    references: [Users.id],
  }),
}))

export type User = InferSelectModel<typeof Users>
export type UserInsert = InferInsertModel<typeof Users>

export type AiImage = InferSelectModel<typeof AiImages>
export type AiImageInsert = InferInsertModel<typeof AiImages>

export type Like = InferSelectModel<typeof Likes>
export type LikeInsert = InferInsertModel<typeof Likes>

export type Payment = InferSelectModel<typeof Payments>
export type PaymentInsert = InferInsertModel<typeof Payments>

export interface AiImageResult extends AiImage {
  isLikedByUser: boolean
}
