import { sql } from "drizzle-orm";
import type { Question } from "~/app/create/page";
import { db } from "~/server/db";
import { quizzes } from "~/server/db/schema";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    id: string;
    name: string;
    anwsers: number[];
  };
  const previousData = (
    await db
      .select()
      .from(quizzes)
      .where(sql`${quizzes.unique_id} = ${body.id}`)
  )[0];

  const correct_anwsers: Question[] = [];
  previousData?.questions?.forEach((z, i) => {
    const q = JSON.parse(z) as Question;
    if (body.anwsers[i] === q.correct_anwser) {
      correct_anwsers.push(q);
    }
  });
  console.log(correct_anwsers);
  await db.update(quizzes).set({
    results: [
      ...(previousData?.results as string[]),
      JSON.stringify({
        name: body.name,
        anwsers: body.anwsers,
        correct: correct_anwsers,
      }),
    ],
  });

  return new Response(
    JSON.stringify({
      ok: true,
      message: "results posted fr",
    }),
    {
      status: 200,
    },
  );
}
