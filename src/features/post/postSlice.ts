import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EditorState } from 'draft-js';
import { doc, getDoc, getDocs } from 'firebase/firestore';
import { RootState } from '../../app/store';
import { db, getUserWithUID, postsCollectionRef } from '../../firebase';
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

const getPostByID = async (id: string) => {
  const docRef = doc(db, 'posts', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const postData = docSnap.data() as PostType;
    const userData = await getUserWithUID(postData.uid);

    return {
      ...postData,
      documentID: id,
      displayName: userData?.displayName,
      photoURL: userData?.photoURL,
    } as PostType;
  }

  return null;
};

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const posts = await getPosts();
  return posts;
});

export const fetchPostByID = createAsyncThunk(
  'posts/fetchPostByID',
  async (id: string) => {
    const post = await getPostByID(id);
    return post;
  },
);

interface PostsProps {
  posts: PostType[];
  currentPost: PostType | null;
}

const initialState: PostsProps = {
  posts: [],
  currentPost: null,
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setPosts: (state, { payload }: PayloadAction<PostType[]>) => {
      state.posts = payload;
    },
    setCurrentPost: (state, { payload }: PayloadAction<PostType | null>) => {
      state.currentPost = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.posts = action.payload;
    });

    builder.addCase(fetchPostByID.fulfilled, (state, action) => {
      state.currentPost = action.payload;
    });
  },
});

export const { setPosts, setCurrentPost } = postSlice.actions;
export const selectPosts = (state: RootState) => state.post.posts;
export const selectCurrentPost = (state: RootState) => state.post.currentPost;

export default postSlice.reducer;
