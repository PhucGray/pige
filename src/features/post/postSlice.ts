import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getDocs } from 'firebase/firestore';
import { revokeScope } from 'immer/dist/internal';
import { RootState } from '../../app/store';
import { getUserWithUID, postsCollectionRef } from '../../firebase';
import { PostType } from '../../types';

const getPosts = async () => {
  const querySnapshot = await getDocs(postsCollectionRef);

  const posts = [] as PostType[];

  const docs = querySnapshot.docs;

  for (let i = 0; i < docs.length; i++) {
    const postData = docs[i].data() as PostType;

    const userData = await getUserWithUID(postData.uid);

    posts.push({
      ...postData,
      displayName: userData?.displayName,
      documentID: docs[i].id,
      photoURL: userData?.photoURL,
    });
  }

  return posts.sort(
    (p1, p2) =>
      new Date(p2.createdAt).getTime() - new Date(p1.createdAt).getTime(),
  );
};

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const posts = await getPosts();

  return posts;
});

interface PostsProps {
  posts: PostType[];
}

const initialState: PostsProps = {
  posts: [],
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setPosts: (state, { payload }: PayloadAction<PostType[]>) => {
      state.posts = payload;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchPosts.fulfilled, (state, action: any) => {
      state.posts = action.payload;
    });
  },
});

export const { setPosts } = postSlice.actions;
export const selectPosts = (state: RootState) => state.post.posts;

export default postSlice.reducer;
