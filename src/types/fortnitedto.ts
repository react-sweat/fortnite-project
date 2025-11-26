
export interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface PlayerStats {
  account: { name: string; id: string };
  battlePass: { level: number; progress: number };
  image: string | null;
  stats: {
    all: {
      overall: {
        score: number;
        wins: number;
        winRate: number;
        kills: number;
        kd: number;
        matches: number;
        deaths: number;
      };
    };
  };
}