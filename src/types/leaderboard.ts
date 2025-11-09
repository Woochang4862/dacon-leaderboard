export type SortOption = "recent" | "score_desc" | "score_asc" | "ranking";

export interface LeaderboardFilters {
  minScore?: number;
  startDate?: string;
  endDate?: string;
  sortBy?: SortOption;
}

export interface TeamInfo {
  user_id: string;
  picture: string;
  picture_updated: string;
  name: string;
  active: string;
  occup1: string;
  organ1: string;
  occup2: string;
  organ2: string;
  occup3: string;
  organ3: string;
  is_follow: string;
  avatar_tier: string;
  is_leader: string;
  grade_code: string;
}

export interface LeaderboardRow {
  cpt_id: number;
  ranking: number;
  sub_id: number;
  team_id: number;
  team_name: string;
  score: number;
  score1: number;
  score2: number;
  submission_cnt: number;
  c_time: string;
  picture: string;
  team_info: TeamInfo[];
  deleted: number;
  cs_id: number | null;
  cs_title: string | null;
}

export interface LeaderboardResponse {
  status: number;
  data: LeaderboardRow[];
}

