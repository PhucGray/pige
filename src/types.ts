export interface PostType {
  uid: string;
  title: string;
  content: string;
  createdAt: string;
  readTime: string;

  hearts: string[];

  documentID?: string;
  displayName?: string;
  photoURL?: string;
}

export interface Alert {
  type: 'success' | 'error';
  message: string;
}
