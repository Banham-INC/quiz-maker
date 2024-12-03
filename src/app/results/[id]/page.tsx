"use client";

import { PlayIcon, QueueListIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast, Toaster } from "sonner";
import type { Question } from "~/app/create/page";
import type { QuizSelect } from "~/server/db/schema";

type Props = {
  params: Promise<{ id: string }>;
};

export type Result = {
  name: string;
  anwsers: number[];
  correct: Question[];
};

export default function ResultsPage({ params }: Props) {
  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState<QuizSelect | null>(null);
  const [resultsId, setResultsId] = useState("");
  const [confirmedResultsId, setResultsConfirmed] = useState(false);
  const [active, setActive] = useState<number | undefined>(undefined);
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    (async () => {
      fetch("/api/fetch/single", {
        method: "POST",
        body: JSON.stringify({
          id: (await params).id,
        }),
      }).then(async (d) => {
        setQuizData((await d.json()).data);
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      });
    })();
  }, []);
  return (
    <ErrorBoundary
      fallback={
        <div className="flex h-screen items-center justify-center text-sm">
          Something went wrong...
        </div>
      }
    >
      {JSON.stringify(quizData)}
      <Toaster />
      {loading && (
        <div className="flex h-screen items-center justify-center">
          <PlayIcon className="h-[15px] w-[15px] animate-spin" />
        </div>
      )}
      {!loading && !confirmedResultsId && (
        <div className="flex h-screen items-center justify-center">
          <form
            onSubmit={(e) => {
              e;
              e.preventDefault();
              if (quizData?.results_id === resultsId) {
                setResultsConfirmed(true);
              } else {
                setResultsConfirmed(false);
                toast("Invalid results token provided.");
              }
            }}
            className="flex gap-3"
          >
            <input
              type="text"
              value={resultsId}
              placeholder="That results token...."
              onChange={(e) => setResultsId(e.target.value)}
              className="smooth_transition rounded-md border border-blue-700/30 p-[0.5rem] outline-none hover:border-blue-700/100 active:border-blue-700/100"
            />

            <button
              type="submit"
              className="rounded-md bg-blue-700 px-3 py-2 text-white"
            >
              Submit
            </button>
          </form>
        </div>
      )}

      {!loading && resultsId && quizData && (
        <div className="mx-auto mt-[10rem] max-w-2xl px-[2rem]">
          <h1 className="text-xl font-bold mb-[2rem]">{quizData.name}</h1>
          <div className="flex flex-col gap-3">
            {quizData.results?.map((r) => {
              const result = JSON.parse(r) as Result;
              return (
                // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                <div
                  className="flex w-full cursor-pointer flex-col rounded-md border border-black/30 p-3"
                  onClick={() => {
                    console.log(active);
                    if (active !== quizData.results?.indexOf(r)) {
                      setActive(quizData.results?.indexOf(r));
                    } else {
                      setActive(undefined);
                    }
                  }}
                  key={result.name}
                >
                  <div className="flex w-full justify-between">
                    {result.name}
                    <span className="text-emerald-700">
                      {" "}
                      {result.correct?.length}
                    </span>
                  </div>

                  <div
                    className={`smooth_transition ${active === quizData.results?.indexOf(r) ? "mt-[1rem] h-fit opacity-100" : "mt-0 h-0 opacity-0"}`}
                  >
                    {quizData.questions?.map((q) => {
                      const question = JSON.parse(q) as Question;
                      const correct = result.correct.find((f) => f.name === question.name)
                      return (
                        <div
                          key={question.name}
                          className="flex justify-between"
                        >
                          {question.name}
                          <span className={`${correct ? "text-emerald-700" : "text-red-700"}`}>
                            {question.options[question.correct_anwser]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}{" "}
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
}
