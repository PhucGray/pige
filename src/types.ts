import { User } from './features/user/userSlice';

export interface PostType {
  uid: string;
  title: string;
  content: string;
  createdAt: string;
  readTime: string;

  hearts: string[];
  comments: CommentType[];

  documentID?: string;
  displayName?: string;
  photoURL?: string;
}

export interface CommentType {
  commentID: string;
  userID: string;
  content: string;
  displayName: string;
  photoURL?: string;
  createdAt: string;
}

export interface Alert {
  type: 'success' | 'error';
  message: string;
}
