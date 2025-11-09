"use client";

import { useEffect, useMemo, useState } from "react";

import type { SortOption } from "@/types/leaderboard";

type FilterState = {
  minScore: string;
  startDate: string;
  endDate: string;
  sortBy: SortOption;
};

export interface FilterFormValues {
  minScore?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  sortBy: SortOption;
}

interface FilterFormProps {
  initialFilters: FilterFormValues;
  sortOptions: SortOption[];
  onApply: (values: FilterFormValues) => void;
}

export function FilterForm({
  initialFilters,
  sortOptions,
  onApply
}: FilterFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const initialState = useMemo<FilterState>(
    () => ({
      minScore:
        initialFilters.minScore != null && Number.isFinite(initialFilters.minScore)
          ? String(initialFilters.minScore)
          : "",
      startDate: initialFilters.startDate ?? "",
      endDate: initialFilters.endDate ?? "",
      sortBy: initialFilters.sortBy
    }),
    [
      initialFilters.minScore,
      initialFilters.startDate,
      initialFilters.endDate,
      initialFilters.sortBy
    ]
  );

  const [state, setState] = useState<FilterState>(initialState);

  useEffect(() => {
    setState(initialState);
  }, [initialState]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    onApply({
      minScore: state.minScore.trim().length > 0 ? Number(state.minScore) : null,
      startDate: state.startDate.trim().length > 0 ? state.startDate : null,
      endDate: state.endDate.trim().length > 0 ? state.endDate : null,
      sortBy: state.sortBy
    });
    setIsSubmitting(false);
  };

  const handleReset = () => {
    const blankState: FilterState = {
      minScore: "",
      startDate: "",
      endDate: "",
      sortBy: "recent"
    };
    setState(blankState);
    onApply({
      minScore: null,
      startDate: null,
      endDate: null,
      sortBy: "recent"
    });
  };

  const handleShare = async () => {
    const params = new URLSearchParams();

    if (state.minScore.trim().length > 0) {
      params.set("min_score", state.minScore.trim());
    }
    if (state.startDate.trim().length > 0) {
      params.set("start_date", state.startDate.trim());
    }
    if (state.endDate.trim().length > 0) {
      params.set("end_date", state.endDate.trim());
    }
    if (state.sortBy !== "recent") {
      params.set("sort_by", state.sortBy);
    }

    const queryString = params.toString();
    const url = `${window.location.origin}${window.location.pathname}${queryString ? `?${queryString}` : ""}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Dacon Leaderboard",
          text: "리더보드 필터 설정을 공유합니다",
          url
        });
      } else {
        await navigator.clipboard.writeText(url);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        await navigator.clipboard.writeText(url);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-subtle backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-900/70"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-200">
          최소 점수
          <input
            type="number"
            name="min_score"
            inputMode="decimal"
            placeholder="예: 0.9"
            value={state.minScore}
            onChange={(event) =>
              setState((prev) => ({
                ...prev,
                minScore: event.target.value
              }))
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-200">
          시작 날짜
          <input
            type="date"
            name="start_date"
            value={state.startDate}
            onChange={(event) =>
              setState((prev) => ({
                ...prev,
                startDate: event.target.value
              }))
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-200">
          종료 날짜
          <input
            type="date"
            name="end_date"
            value={state.endDate}
            onChange={(event) =>
              setState((prev) => ({
                ...prev,
                endDate: event.target.value
              }))
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-200">
          정렬 기준
          <select
            name="sort_by"
            value={state.sortBy}
            onChange={(event) =>
              setState((prev) => ({
                ...prev,
                sortBy: event.target.value as SortOption
              }))
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            {sortOptions.map((option) => (
              <option key={option} value={option}>
                {SORT_LABEL[option]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center whitespace-nowrap rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-indigo-500 dark:hover:bg-indigo-400"
        >
          {isSubmitting ? "적용 중..." : "필터 적용"}
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={isSubmitting}
          className="flex items-center justify-center whitespace-nowrap rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-slate-100"
        >
          초기화
        </button>
        <button
          type="button"
          onClick={handleShare}
          disabled={isSubmitting}
          className="flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          title="현재 필터 설정을 URL로 공유"
        >
          {shareSuccess ? (
            <>
              <svg
                className="h-4 w-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>복사됨</span>
            </>
          ) : (
            <>
              <svg
                className="h-4 w-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              <span>공유</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

const SORT_LABEL: Record<SortOption, string> = {
  recent: "최근 제출 순",
  score_desc: "점수 높은 순",
  score_asc: "점수 낮은 순",
  ranking: "순위 오름차순"
};

