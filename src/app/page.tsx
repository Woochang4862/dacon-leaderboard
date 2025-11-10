import { Fragment } from "react";

import { LeaderboardClient } from "@/components/LeaderboardClient";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <Fragment>
      <header className="mb-10 flex items-start justify-between gap-6">
        <div className="space-y-3">
          <p className="inline-flex rounded-full border border-indigo-200 bg-indigo-50/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-200">
            Dacon Challenge #{236590}
          </p>
          <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl dark:text-white">
            Dacon Leaderboard Explorer
          </h1>
          <p className="max-w-2xl text-base text-slate-600 dark:text-slate-300">
            실시간 리더보드 데이터를 불러와 필터링하고, 원하는 기준으로 정렬해
            분석해보세요. 빠른 의사결정을 돕기 위한 모던한 인터페이스를
            제공합니다.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <LeaderboardClient />
    </Fragment>
  );
}

