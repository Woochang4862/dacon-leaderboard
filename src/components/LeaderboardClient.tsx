"use client";

import { useMemo, useState } from "react";

import { FilterForm, type FilterFormValues } from "@/components/FilterForm";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import {
  SORT_OPTIONS,
  applyFilters,
  sortLeaderboard
} from "@/lib/leaderboard";
import type { LeaderboardRow, SortOption } from "@/types/leaderboard";

interface LeaderboardClientProps {
  rows: LeaderboardRow[];
}

type AppliedFilters = {
  minScore: number | null;
  startDate: string | null;
  endDate: string | null;
  sortBy: SortOption;
};

const DEFAULT_FILTERS: AppliedFilters = {
  minScore: null,
  startDate: null,
  endDate: null,
  sortBy: "recent"
};

export function LeaderboardClient({ rows }: LeaderboardClientProps) {
  const [filters, setFilters] = useState<AppliedFilters>(DEFAULT_FILTERS);

  const filteredRows = useMemo(() => {
    const filtered = applyFilters(rows, {
      minScore: filters.minScore ?? undefined,
      startDate: filters.startDate ?? undefined,
      endDate: filters.endDate ?? undefined
    });
    return sortLeaderboard(filtered, filters.sortBy);
  }, [rows, filters]);

  const totalSubmissions = rows.length;
  const filteredSubmissions = filteredRows.length;
  const latestSubmission = getLatestSubmission(filteredRows);
  const bestScore = getBestScore(filteredRows);

  return (
    <>
      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="전체 제출 수"
          value={formatNumber(totalSubmissions)}
          accent="bg-indigo-500/15 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-200"
          description="Dacon API에서 가져온 전체 제출 건수"
        />
        <StatCard
          title="필터 적용 결과"
          value={formatNumber(filteredSubmissions)}
          accent="bg-teal-500/15 text-teal-600 dark:bg-teal-500/15 dark:text-teal-200"
          description="현재 조건에 맞는 제출 건수"
        />
        <StatCard
          title="최고 점수"
          value={bestScore != null ? bestScore.toFixed(6) : "—"}
          accent="bg-amber-500/15 text-amber-600 dark:bg-amber-500/20 dark:text-amber-200"
          description="선택된 결과 중 가장 높은 점수"
        />
        <StatCard
          title="마지막 업데이트"
          value={latestSubmission ?? "정보 없음"}
          accent="bg-slate-500/15 text-slate-600 dark:bg-slate-500/15 dark:text-slate-200"
          description="필터 조건에 해당하는 가장 최근 제출 시간"
        />
      </section>

      <div className="mb-10">
        <FilterForm
          initialFilters={{
            minScore: filters.minScore,
            startDate: filters.startDate,
            endDate: filters.endDate,
            sortBy: filters.sortBy
          }}
          sortOptions={SORT_OPTIONS}
          onApply={(values: FilterFormValues) =>
            setFilters({
              minScore: values.minScore ?? null,
              startDate: values.startDate ?? null,
              endDate: values.endDate ?? null,
              sortBy: values.sortBy
            })
          }
        />
      </div>

      <LeaderboardTable rows={filteredRows} />
    </>
  );
}

function getLatestSubmission(rows: LeaderboardRow[]): string | null {
  if (rows.length === 0) return null;
  const latest = rows.reduce<Date | null>((acc, row) => {
    const parsed = new Date(row.c_time.replace(" ", "T"));
    if (Number.isNaN(parsed.getTime())) {
      return acc;
    }
    if (acc == null || parsed > acc) {
      return parsed;
    }
    return acc;
  }, null);

  if (!latest) return null;
  return formatDate(latest);
}

function getBestScore(rows: LeaderboardRow[]): number | null {
  if (rows.length === 0) return null;
  return rows.reduce<number | null>((max, row) => {
    const score = Number(row.score);
    if (Number.isNaN(score)) {
      return max;
    }
    if (max == null || score > max) {
      return score;
    }
    return max;
  }, null);
}

function formatDate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("ko-KR").format(value);
}

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  accent: string;
}

function StatCard({ title, value, description, accent }: StatCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/70 p-5 shadow-md shadow-slate-900/5 transition hover:-translate-y-0.5 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-black/40">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {title}
      </p>
      <p className={`mt-3 text-2xl font-bold ${accent}`}>{value}</p>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}

