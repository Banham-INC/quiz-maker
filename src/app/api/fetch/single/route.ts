import { sql } from "drizzle-orm";
import { db } from "~/server/db";
import { quizzes } from "~/server/db/schema";

export async function POST(req: Request) {
	const body = (await req.json()) as {
		id: string;
	};

	const quiz = await db
		.select()
		.from(quizzes)
		.where(sql`${quizzes.unique_id} = ${body.id}`);
	if (!quiz || quiz.length < 1)
		return new Response(
			JSON.stringify({
				ok: false,
				data: null,
			}),
			{
				status: 500,
			},
		);

	return new Response(
		JSON.stringify({
			ok: true,
			data: quiz[0],
		}),
		{
			status: 200,
		},
	);
}
