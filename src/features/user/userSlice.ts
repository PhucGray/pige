import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface User {
  documentID?: string;

  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  posts: string[];
  likes: string[];
}

interface UserProps {
  user: User | null;
  loading: boolean;
}

const initialState: UserProps = {
  user: null,
  loading: true,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, { payload }: PayloadAction<User | null>) => {
      state.user = payload;
    },
    setLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.loading = payload;
    },
  },
});

export const { setUser, setLoading } = userSlice.actions;
export const selectUser = (state: RootState) => state.user.user;
export const selectLoading = (state: RootState) => state.user.loading;

export default userSlice.reducer;
