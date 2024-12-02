// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
	index,
	integer,
	pgTableCreator,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `quiz-app_${name}`);

export const quizzes = createTable("quizzes", {
	id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
	name: text("name"),
	unique_id: text("unique_id"),
	results_id: text("results_id"),
	questions: text("questions").array(), // {name: "question name", "options": ["option1", "option2"], "correct_anwser": 1 (index)}
	results: text("results").array().default([]),
	/* {name: "user_name", anwsers: ["a1", "a2", "30"] }*/
});

export type QuizSelect = typeof quizzes.$inferSelect;
