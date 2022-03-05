export interface PostType {
  documentID?: string;
  uid: string;
  title: string;
  content: any;
  createdAt: string;
  readTime: number;

  displayName?: string;
  photoURL?: string;
}
