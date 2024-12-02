import { db } from "~/server/db";
import { quizzes } from "~/server/db/schema";

export async function POST(request: Request) {
	const data = await db.select().from(quizzes);
	return new Response(JSON.stringify(data), {
		status: 200,
	});
}
