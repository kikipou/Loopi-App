// src/types/post.ts
export interface Post {
  id: string;
  user_post_id?: string | null; // opcional si no siempre se devuelve
  username?: string | null; // tu campo en la tabla (username en tu DB se llama user_name)
  post_name?: string | null;
  post_description?: string | null;
  post_professions?: string | null;
  post_skills?: string | null;
  image_url?: string | null;
  categories?: string | null; // ajusta si es array o json
  created_at?: string | null;
}

export interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
}
