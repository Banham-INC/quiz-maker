import { createId } from "~/lib/utils";
import { db } from "~/server/db";
import { quizzes } from "~/server/db/schema";

export async function POST(request: Request) {
	const body = (await request.json()) as {
		name: string;
		questions: {
			name: string;
			options: string[];
			correct_anwser: number;
		}[];
	};
	const unique_id = createId(15);
	const result_id = createId(35);
	await db.insert(quizzes).values({
		name: body.name,
		questions: body.questions.map((z) => JSON.stringify(z)),
		results_id: result_id,
		unique_id: unique_id,
		results: [],
	});

	return new Response(
		JSON.stringify({
			ok: true,
			id: unique_id,
			result_id: result_id,
		}),
		{
			status: 200,
		},
	);
}
