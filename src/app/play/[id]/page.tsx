"use client";

import { Field, Radio, RadioGroup } from "@headlessui/react";
import { CheckCircleIcon, PlayIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster, toast } from "sonner";
import type { Question } from "~/app/create/page";
import type { QuizSelect } from "~/server/db/schema";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default function PlayQuiz({ params }: Props) {
  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState<QuizSelect | null>(null);
  const [selectedAnwsers, setSelectedAwnsers] = useState<number[]>([]);
  const [name, setName] = useState("");
  const [submittedName, setSubmittName] = useState(false);
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
      <Toaster />

      {!submittedName ? (
        <div className="flex h-screen items-center justify-center">
          <form
            onSubmit={() => {
              if (name.length > 0) {
                setSubmittName(true);
              }
            }}
            className="flex gap-3"
          >
            <input
              type="text"
              value={name}
              placeholder="Username"
              onChange={(e) => setName(e.target.value)}
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
      ) : (
        <></>
      )}
      <div>
        {loading && !submittedName && (
          <div className="flex h-screen items-center justify-center">
            <PlayIcon className="h-[15px] w-[15px] animate-spin" />
          </div>
        )}
      </div>

      {!loading && submittedName && (
        <div className="mx-auto mt-[10rem] max-w-2xl px-[2rem]">
          <h1 className="text-xl font-bold">{quizData?.name}</h1>
          <div className="mt-[2rem] flex flex-col gap-7">
            {quizData?.questions?.map((q, i) => {
              const question = JSON.parse(q) as Question;
              return (
                <div className="flex flex-col" key={`${question.name}-${i}`}>
                  <h1 className="mb-2 text-sm opacity-35">{question.name}</h1>
                  <RadioGroup
                    value={selectedAnwsers[i]}
                    className={"mt-[0.5rem] flex flex-wrap gap-2"}
                    onChange={(va) => {
                      const selected = selectedAnwsers;
                      selected[i] = question.options.indexOf(
                        va as unknown as string,
                      ) as number;
                      setSelectedAwnsers(selected);
                    }}
                  >
                    {question.options.map((z) => {
                      return (
                        <Field
                          key={`${z}-${z}`}
                          className={"flex w-[49%] gap-3"}
                        >
                          <Radio
                            value={z}
                            className="smooth_transition w-full cursor-pointer rounded-md border border-blue-700/10 p-2 data-[checked]:border-blue-700/60"
                          >
                            <div className="flex w-full items-center justify-between">
                              <div className="max-w-full text-sm/6">
                                <h1>
                                  {z.length > 40 ? `${z.slice(0, 40)}...` : z}
                                </h1>
                              </div>
                            </div>
                            <CheckCircleIcon className="size-6 fill-white opacity-0 transition group-data-[checked]:opacity-100" />
                          </Radio>
                        </Field>
                      );
                    })}
                  </RadioGroup>
                </div>
              );
            })}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (
                selectedAnwsers.length <
                (quizData?.questions as unknown as Question[]).length
              ) {
                toast("Please anwser all questions.");
                return;
              }

              fetch("/api/submit", {
                method: "POST",
                body: JSON.stringify({
                  id: quizData?.unique_id,
                  name: name,
                  anwsers: selectedAnwsers,
                }),
              }).then((r) => {
                if (r.status !== 200) {
                  toast("Something went wrong...");
                } else {
                  window.location.href = "/finished";
                }
              });
            }}
            className="my-[3rem] w-full rounded-md bg-blue-700 px-3 py-2 text-white disabled:opacity-30"
          >
            Submit Anwsers
          </button>
        </div>
      )}
    </ErrorBoundary>
  );
}
