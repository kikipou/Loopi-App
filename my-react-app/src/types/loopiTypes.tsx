export type UUID = string;

export type LoopiProjectCard = {
  id: number;
  post_name: string | null;
  post_description: string | null;
  post_professions: string | null;
  post_skills: string | null;
  image_url: string | null;
  user_post_id: UUID;     
};

export type ProjectLikeRow = {
  id: number;
  created_at: string;     
  user_id: UUID;         
  project_id: number;
  project_owner_id: UUID;
};

export type ProjectLikeInsert = Omit<ProjectLikeRow, "id" | "created_at">;

export type ProjectMatchRow = {
  id: number;
  created_at: string;
  user_a_id: UUID;
  user_b_id: UUID;
  project_id: number;
};

export type ProjectMatchInsert = Omit<ProjectMatchRow, "id" | "created_at">;

export type MatchEvent = {
  matchId: number;
  projectId: number;
  withUserId: UUID;
};
