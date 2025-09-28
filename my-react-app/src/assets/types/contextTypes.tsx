import type { Post } from './postTypes';

export interface PostsContextType {
  posts: Post[];
  loading: boolean;
  error: string | null;
  currentCategory: string;
  fetchPosts: (category?: string) => Promise<void>;
  setCategory: (category: string) => void;
  addPost: (post: Omit<Post, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updatePost: (id: string, post: Partial<Post>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
}
