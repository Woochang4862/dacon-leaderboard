import { format, isValid, parse } from "date-fns";

import type { LeaderboardRow } from "@/types/leaderboard";

interface LeaderboardTableProps {
  rows: LeaderboardRow[];
}

const DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";

const scoreFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 6,
  maximumFractionDigits: 6
});

export function LeaderboardTable({ rows }: LeaderboardTableProps) {
  if (rows.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white/60 p-12 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400">
        현재 조건에 맞는 제출 기록이 없습니다.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/80 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed divide-y divide-slate-200 dark:divide-slate-800">
          <thead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800/80 dark:text-slate-300">
            <tr>
              <th scope="col" className="px-4 py-3 text-left sm:w-20">
                순위
              </th>
              <th scope="col" className="px-4 py-3 text-left">
                팀 정보
              </th>
              <th scope="col" className="px-4 py-3 text-right sm:w-36">
                점수
              </th>
              <th scope="col" className="px-4 py-3 text-center sm:w-32">
                제출 횟수
              </th>
              <th scope="col" className="px-4 py-3 text-left sm:w-48">
                제출 시간
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700 dark:divide-slate-800 dark:text-slate-200">
            {rows.map((row, index) => {
              const isTop = index === 0;
              const memberNames = row.team_info
                .map((member) => member.name)
                .filter(Boolean);

              return (
                <tr
                  key={row.sub_id}
                  className={
                    isTop
                      ? "bg-primary/10 font-semibold text-slate-900 dark:bg-primary/20 dark:text-white"
                      : index % 2 === 1
                        ? "bg-slate-50/60 dark:bg-slate-900/20"
                        : ""
                  }
                >
                  <td className="px-4 py-3 text-left text-sm font-semibold">
                    #{row.ranking}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-base font-semibold text-slate-900 dark:text-white">
                        {row.team_name}
                      </span>
                      {memberNames.length > 0 && (
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {memberNames.join(", ")}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-base font-semibold tabular-nums text-indigo-600 dark:text-indigo-300">
                    {scoreFormatter.format(Number(row.score))}
                  </td>
                  <td className="px-4 py-3 text-center text-sm tabular-nums">
                    {row.submission_cnt}
                  </td>
                  <td className="px-4 py-3 text-left text-sm text-slate-500 dark:text-slate-400">
                    {formatSubmissionTime(row.c_time)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatSubmissionTime(value: string): string {
  const parsed = parse(value, DATETIME_FORMAT, new Date());
  if (!isValid(parsed)) {
    return value;
  }
  return format(parsed, "yyyy.MM.dd HH:mm");
}

