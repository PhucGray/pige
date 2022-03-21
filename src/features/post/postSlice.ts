import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { RootState } from '../../app/store';
import {
  commentsCollectionRef,
  db,
  getUserWithUID,
  postsCollectionRef,
} from '../../firebase';
import { CommentType, PostType } from '../../types';
import { User } from '../user/userSlice';

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

const getSavedPosts = async (uid: string) => {
  const userData = await getUserWithUID(uid);

  const querySnapshot = await getDocs(postsCollectionRef);

  const posts = [] as PostType[];

  const docs = querySnapshot.docs;

  for (let i = 0; i < docs.length; i++) {
    const postData = docs[i].data() as PostType;
    const postID = docs[i].id;

    if (userData?.savedPosts.includes(postID)) {
      posts.push({
        ...postData,
        displayName: userData?.displayName,
        documentID: postID,
        photoURL: userData?.photoURL,
      });
    }
  }

  return posts.sort(
    (p1, p2) =>
      new Date(p2.createdAt).getTime() - new Date(p1.createdAt).getTime(),
  );
};

const getPopularPosts = async () => {
  const q = query(postsCollectionRef, orderBy('hearts', 'desc'), limit(3));

  const posts = [] as PostType[];

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const docs = querySnapshot.docs;

    for (let i = 0; i < docs.length; i++) {
      const postData = docs[i].data() as PostType;

      if (postData.hearts.length === 0) continue;

      const userData = await getUserWithUID(postData.uid);

      posts.push({
        ...postData,
        displayName: userData?.displayName,
        documentID: docs[i].id,
        photoURL: userData?.photoURL,
      });
    }
  }

  return posts;
};

const getPostsByUserID = async (user: User) => {
  const querySnapshot = await getDocs(postsCollectionRef);

  const posts = [] as PostType[];

  const docs = querySnapshot.docs;

  for (let i = 0; i < docs.length; i++) {
    const postData = docs[i].data() as PostType;
    const postID = docs[i].id;

    if (user && user.posts?.includes(postID)) {
      posts.push({
        ...postData,
        displayName: user.displayName,
        documentID: postID,
        photoURL: user.photoURL,
      });
    }
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

export const fetchSavedPosts = createAsyncThunk(
  'posts/fetchSavedPosts',
  async (uid: string) => {
    const posts = await getSavedPosts(uid);
    return posts;
  },
);

export const fetchPopularPosts = createAsyncThunk(
  'posts/fetchPopularPosts',
  async () => {
    const posts = await getPopularPosts();
    return posts;
  },
);

export const fetchPostByID = createAsyncThunk(
  'posts/fetchPostByID',
  async (id: string) => {
    const post = await getPostByID(id);
    return post;
  },
);

export const fetchPostsByUserID = createAsyncThunk(
  'posts/fetchPostsByUserID',
  async (user: User) => {
    const posts = await getPostsByUserID(user);
    return posts;
  },
);

interface PostsProps {
  posts: PostType[];
  currentPost: PostType | null;
  postsByUserID: PostType[];
  polularPosts: PostType[];
  comments: CommentType[];
  savedPosts: PostType[];
}

const initialState: PostsProps = {
  posts: [],
  currentPost: null,
  postsByUserID: [],
  polularPosts: [],
  comments: [],
  savedPosts: [],
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
    setPostsByUserID: (state, { payload }: PayloadAction<PostType[]>) => {
      state.postsByUserID = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.posts = action.payload;
    });

    builder.addCase(fetchSavedPosts.fulfilled, (state, action) => {
      state.savedPosts = action.payload;
    });

    builder.addCase(fetchPopularPosts.fulfilled, (state, action) => {
      state.polularPosts = action.payload;
    });

    builder.addCase(fetchPostByID.fulfilled, (state, action) => {
      state.currentPost = action.payload;
    });

    builder.addCase(fetchPostsByUserID.fulfilled, (state, action) => {
      state.postsByUserID = action.payload;
    });
  },
});

export const { setPosts, setCurrentPost, setPostsByUserID } = postSlice.actions;
export const selectPosts = (state: RootState) => state.post.posts;
export const selectCurrentPost = (state: RootState) => state.post.currentPost;
export const selectPostsByUserID = (state: RootState) =>
  state.post.postsByUserID;
export const selectPopularPosts = (state: RootState) => state.post.polularPosts;
export const selectSavedPosts = (state: RootState) => state.post.savedPosts;

export default postSlice.reducer;
