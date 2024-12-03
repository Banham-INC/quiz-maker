"use client";
import { Field, Label, Radio, RadioGroup } from "@headlessui/react";
import { CheckCircleIcon, ArchiveBoxIcon } from "@heroicons/react/24/solid";
import { type Dispatch, type SetStateAction, useState } from "react";
import { Toaster, toast } from "sonner";

export type Question = {
  name: string;
  options: string[];
  correct_anwser: number;
};

export default function CreateQuiz() {
  const [name, setName] = useState("The WORST quiz ever");
  const [questions, setQuestions] = useState<Question[]>([
    {
      name: "Example question 1",
      correct_anwser: 2,
      options: [
        "Anwser choice 1",
        "Anwser choice 2",
        "Anwser choice 3",
        "Anwser choice 4..",
      ],
    },
    {
      name: "Example question 2",
      correct_anwser: 0,
      options: ["Anwser choice 1", "Anwser choice 2"],
    },
  ]);
  const [index, setIndex] = useState(questions.length + 1);

  return (
    <div className="mx-auto mt-[10rem] max-w-2xl px-[2rem]">
      <Toaster />
      <div className="flex flex-col">
        <input
          className="smooth_transition rounded-md border border-blue-700/30 p-[0.5rem] outline-none hover:border-blue-700/100 active:border-blue-700/100"
          type="text"
          placeholder="Quiz name...."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mt-[2rem] flex flex-col gap-3">
        {questions.map((q) => {
          return (
            <div
              key={questions.indexOf(q)}
              className="flex w-full items-center justify-center gap-3"
            >
              <div className="flex w-full justify-between rounded-md border border-black/15 p-3">
                {q.name}
                <span className="opacity-30">{q.options.length} Options</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  const question = questions.filter(
                    (z, i) => i !== questions.indexOf(q),
                  );
                  setQuestions([...question]);
                }}
                className="flex h-[45px] w-[50px] items-center justify-center rounded-md bg-red-500 text-white"
              >
                <ArchiveBoxIcon className="h-[20px] w-[20px]" />
              </button>
            </div>
          );
        })}
      </div>
      <div className="mt-[2rem]">
        <AddQuestion setQuestions={setQuestions} questions={questions} />
      </div>

      <div className="w-full">
        <button
          type="submit"
          onClick={() => {
            fetch("/api/create", {
              method: "POST",
              body: JSON.stringify({
                name: name,
                questions: questions,
              }),
            }).then(async (r) => {
              const body = await r.json();
            //   navigator.clipboard.write(body.result_id);
              toast(
                `Quiz created. \nPlayable ID: ${body.id} (also viewable on home page)\nResults ID: ${body.result_id} (i cba to implement auth so whoever gets this can see all the results)`,
              );
            });
          }}
          className="my-[3rem] w-full rounded-md bg-blue-700 px-3 py-2 text-white"
        >
          Create quiz
        </button>
      </div>
    </div>
  );
}

type QuesitonAddProps = {
  questions: Question[];
  setQuestions: Dispatch<SetStateAction<Question[]>>;
};
function AddQuestion({ setQuestions, questions }: QuesitonAddProps) {
  const [question, _] = useState<Question>({
    name: "Example question",
    correct_anwser: 0,
    options: ["Anwser 1", "Anwser 2"],
  });
  const [nq, setNq] = useState("");
  const [options, setOptions] = useState(question.options);
  const [correctAnwser, setCorrectAnwser] = useState(question.correct_anwser);
  const [title, setTitle] = useState(question.name);

  return (
    <div className="flex flex-col gap-2">
      <div
        className="flex flex-col rounded-md border border-black/30 p-[1.5rem]"
        key={question.name}
      >
        <div className="flex flex-col gap-1">
          <h1 className="text-sm opacity-40">Title</h1>
          <input
            type="text"
            className="smooth_transition rounded-md border border-blue-700/30 p-[0.5rem] outline-none hover:border-blue-700/100 active:border-blue-700/100"
            value={title}
            placeholder={"Question name"}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>

        <div className="mt-[2rem] flex flex-col gap-1">
          <h1 className="text-sm opacity-35">Options</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              //   const newQuestions = questions;
              //   questions[questions.indexOf(z)] = {
              //     name: z.name,
              //     correct_anwser: z.correct_anwser,
              //     options: [...z.options, nq],
              //   };
              //   setQuestions([...questions]);
              //   setNq("");

              setOptions([...options, nq]);
              setNq("");
            }}
            className="flex w-full gap-2"
          >
            <input
              type="text"
              value={nq}
              placeholder="Add a new question"
              className="smooth_transition w-full rounded-md border border-blue-700/30 p-[0.5rem] outline-none hover:border-blue-700/100 active:border-blue-700/100"
              onChange={(e) => setNq(e.target.value)}
            />
            <button
              type="submit"
              className="rounded-md bg-blue-700 px-3 py-2 text-white"
            >
              Submit
            </button>
          </form>
          <div className="mt-[1rem] flex flex-col">
            <h1 className="text-sm opacity-35">Select correct anwser</h1>
            <RadioGroup
              value={correctAnwser}
              onChange={(va) => {
                setCorrectAnwser(va);
              }}
              className={"mt-[0.5rem] flex flex-wrap gap-2"}
            >
              {options.map((z) => {
                return (
                  <div
                    key={`${z}-${z}`}
                    className="flex w-full items-center justify-center gap-3"
                  >
                    <Field className={"flex w-full gap-3"}>
                      <Radio
                        value={z}
                        className="smooth_transition w-full rounded-md border border-blue-700/10 p-2 data-[checked]:border-blue-700/60"
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
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        const opt = options.filter(
                          (q, i) => i !== options.indexOf(z),
                        );
                        setOptions([...opt]);
                      }}
                      className="flex h-[45px] w-[50px] items-center justify-center rounded-md bg-red-500 text-white"
                    >
                      <ArchiveBoxIcon className="h-[20px] w-[20px]" />
                    </button>
                  </div>
                );
              })}
            </RadioGroup>
          </div>
        </div>
        <div className="flex w-full">
          <button
            type="submit"
            onClick={() => {
              if (!title || !correctAnwser || !options || options.length <= 0) {
                toast("Please ensure all sections are filled out.");
                return;
              }
              const ca = options.indexOf(correctAnwser as unknown as string);
              setQuestions([
                ...questions,
                {
                  name: title,
                  correct_anwser: ca < 0 ? 0 : ca,
                  options: options,
                },
              ]);
              setNq("");
              setCorrectAnwser(question.correct_anwser);
              setTitle(question.name);
              setOptions(question.options);
            }}
            className="mt-[1rem] w-full rounded-md bg-blue-700 px-3 py-2 text-white"
          >
            Create Question
          </button>
        </div>
      </div>
    </div>
  );
}
