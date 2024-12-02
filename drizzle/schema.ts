import { sql } from "drizzle-orm"
  import { integer, pgTable, text } from "drizzle-orm/pg-core"




export const quizAppQuizzes = pgTable("quiz-app_quizzes", {
	id: integer("id").primaryKey().generatedByDefaultAsIdentity({ name: ""quiz-app_quizzes_id_seq"", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	name: text("name"),
	uniqueId: text("unique_id"),
	questions: text("questions").array(),
	results: text("results").array(),
	resultsId: text("results_id"),
});