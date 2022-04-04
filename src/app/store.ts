import { configureStore } from '@reduxjs/toolkit';
import UserReducer from '../features/user/userSlice';
import PostReducer from '../features/post/postSlice';
import AlertReducer from '../features/alert/alertSlice';

export const store = configureStore({
  reducer: {
    user: UserReducer,
    post: PostReducer,
    alert: AlertReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
