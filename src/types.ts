import { ContentState, EditorState } from 'draft-js';

export interface PostType {
  uid: string;
  title: string;
  content: string;
  createdAt: string;
  readTime: string;

  documentID?: string;
  displayName?: string;
  photoURL?: string;
}
