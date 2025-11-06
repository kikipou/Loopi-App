import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Post } from "../../types/postTypes";

interface PostsState {
  posts: Post[];
  isLoading: boolean;
}

const initialState: PostsState = {
  posts: [],
  isLoading: false,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
    },
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
      state.isLoading = false;
    },
    addPost: (state, action: PayloadAction<Post>) => {
      state.posts.unshift(action.payload);
    },
    deletePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
    },
  },
});

export const { startLoading, setPosts, addPost, deletePost } =
  postsSlice.actions;
export default postsSlice.reducer;
