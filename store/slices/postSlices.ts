import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';


import type { RootState } from '../store';

interface Post {
  id: string;
  title: string;
  content: string;
}

interface PostState {
  posts: Post[];
}

const initialState: PostState = {
  posts: [],
};

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    addPost: (state, action: PayloadAction<Post>) => {
      state.posts.push(action.payload);
    },
    removePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter(post => post.id !== action.payload);
    },
  },
});

export const { addPost, removePost } = postSlice.actions;

export const selectPosts = (state: RootState) => state.post.posts;

export default postSlice.reducer;
