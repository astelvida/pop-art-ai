CREATE TABLE IF NOT EXISTS "aiImage" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"url" varchar(2083) NOT NULL,
	"name" varchar(255),
	"prompt" text NOT NULL,
	"title" text,
	"model" varchar,
	"description" text,
	"isFavorite" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
