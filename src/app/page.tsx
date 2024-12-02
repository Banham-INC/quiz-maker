"use client";

import { PencilIcon, PlayIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { QuizSelect } from "~/server/db/schema";

export default function HomePage() {
  const [quiz, setQuiz] = useState<QuizSelect[]>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      fetch("/api/fetch", {
        method: "POST",
      }).then(async (r) => {
        setQuiz(await r.json());
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      });
    })();
  }, []);
  return (
    <div>
      {loading && (
        <div className="flex h-screen items-center justify-center">
          <PlayIcon className="h-[15px] w-[15px] animate-spin" />
        </div>
      )}

      {!loading && (
        <div className="mx-auto mt-[10rem] max-w-2xl p-3">
          <div className="flex w-full flex-col gap-2">
            {quiz?.map((z) => (
              <a
                href={`/play/${z.unique_id}`}
                className="smooth_transition flex w-full justify-between border border-blue-700/20 p-3 hover:border-blue-700/70"
                key={z.unique_id}
              >
                {z.name}
                <span className="text-sm opacity-35">{z.unique_id}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
