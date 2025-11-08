export interface Post {
  id: string;
  user_post_id?: string | null;
  username?: string | null;
  post_name?: string | null;
  post_description?: string | null;
  post_professions?: string | null;
  post_skills?: string | null;
  image_url?: string | null;
  categories?: string | null;
  created_at?: string | null;
}

export interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
}
