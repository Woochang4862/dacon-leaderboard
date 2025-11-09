import { parse, isValid } from "date-fns";

import type {
  LeaderboardFilters,
  LeaderboardResponse,
  LeaderboardRow,
  SortOption
} from "@/types/leaderboard";

export const LEADERBOARD_URL =
  "https://newapi.dacon.io/leaderboard/V2/public?cpt_id=236590";

export const REQUEST_HEADERS: Record<string, string> = {
  accept: "application/json, text/plain, */*",
  "accept-language": "ko-KR,ko;q=0.9",
  origin: "https://dacon.io",
  priority: "u=1, i",
  referer: "https://dacon.io/",
  retry: "3",
  retrydelay: "3000",
  "sec-ch-ua": '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"macOS"',
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-site",
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36"
};

const DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";

const toDate = (value: string) => {
  const parsed = parse(value, DATETIME_FORMAT, new Date());
  return parsed;
};

interface FetchOptions {
  revalidate?: number;
}

export async function fetchLeaderboardRows({
  revalidate = 3600
}: FetchOptions = {}): Promise<LeaderboardRow[]> {
  const fetchInit: RequestInit & {
    next?: { revalidate: number };
  } = {
    headers: REQUEST_HEADERS,
    cache: revalidate === 0 ? "no-store" : "force-cache"
  };

  if (revalidate !== 0) {
    fetchInit.next = { revalidate };
  }

  const response = await fetch(LEADERBOARD_URL, fetchInit);

  if (!response.ok) {
    throw new Error(`리더보드 요청 실패 (status: ${response.status})`);
  }

  const payload = (await response.json()) as LeaderboardResponse | LeaderboardRow[];

  if (Array.isArray(payload)) {
    return payload;
  }

  return payload.data ?? [];
}

export function applyFilters(
  rows: LeaderboardRow[],
  filters: LeaderboardFilters
): LeaderboardRow[] {
  const { minScore, startDate, endDate } = filters;

  const start =
    startDate != null
      ? parse(`${startDate} 00:00:00`, DATETIME_FORMAT, new Date())
      : undefined;
  const end =
    endDate != null
      ? parse(`${endDate} 23:59:59`, DATETIME_FORMAT, new Date())
      : undefined;

  const normalizedStart = start && isValid(start) ? start : undefined;
  const normalizedEnd = end && isValid(end) ? end : undefined;

  return rows.filter((row) => {
    const score = Number(row.score);
    const createdAt = toDate(row.c_time);

    if (minScore != null && Number.isFinite(minScore) && score < minScore) {
      return false;
    }

    if (normalizedStart && createdAt < normalizedStart) {
      return false;
    }

    if (normalizedEnd && createdAt > normalizedEnd) {
      return false;
    }

    return true;
  });
}

type Sorter = (row: LeaderboardRow) => number | string | Date | (number | Date)[];

export const SORT_OPTIONS: SortOption[] = [
  "recent",
  "score_desc",
  "score_asc",
  "ranking"
];

const sorters: Record<SortOption, Sorter> = {
  recent: (row) => -toDate(row.c_time).getTime(),
  score_desc: (row) => [-Number(row.score), -toDate(row.c_time).getTime()],
  score_asc: (row) => [Number(row.score), toDate(row.c_time).getTime()],
  ranking: (row) => [Number(row.ranking), -toDate(row.c_time).getTime()]
};

export function sortLeaderboard(
  rows: LeaderboardRow[],
  sortBy: SortOption = "recent"
): LeaderboardRow[] {
  const sorter = sorters[sortBy] ?? sorters.recent;

  return [...rows].sort((a, b) => {
    const valueA = sorter(a);
    const valueB = sorter(b);

    if (Array.isArray(valueA) && Array.isArray(valueB)) {
      for (let i = 0; i < Math.min(valueA.length, valueB.length); i += 1) {
        const diff = compareValues(valueA[i], valueB[i]);
        if (diff !== 0) {
          return diff;
        }
      }
      return 0;
    }

    return compareValues(valueA, valueB);
  });
}

function compareValues(
  a: number | Date | string | (number | Date)[],
  b: number | Date | string | (number | Date)[]
): number {
  const valueA = Array.isArray(a) ? a[0] : a instanceof Date ? a.getTime() : a;
  const valueB = Array.isArray(b) ? b[0] : b instanceof Date ? b.getTime() : b;

  if (valueA < valueB) return -1;
  if (valueA > valueB) return 1;
  return 0;
}

