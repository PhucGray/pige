import { initializeApp } from 'firebase/app';
import {
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
} from 'firebase/auth';
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { User } from './features/user/userSlice';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_API_KEY,
  authDomain: import.meta.env.VITE_APP_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_APP_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

export const usersCollectionRef = collection(db, 'users');
export const postsCollectionRef = collection(db, 'posts');
export const commentsCollectionRef = collection(db, 'comments');

//

export const getUserWithUID = async (uid: string) => {
  const q = query(usersCollectionRef, where('uid', '==', uid));

  const userDocs = await getDocs(q);

  const isEmpty = userDocs.empty;

  if (isEmpty) return null;

  const currentDoc = userDocs.docs[0];

  const userData = { ...currentDoc.data(), documentID: currentDoc.id } as User;

  return userData;
};

export const checkEmail = async (email: string) => {
  const q = query(usersCollectionRef, where('email', '==', email));

  const userDocs = await getDocs(q);

  const isEmpty = userDocs.empty;

  if (isEmpty) return null;

  const currentDoc = userDocs.docs[0];

  const userData = { ...currentDoc.data(), documentID: currentDoc.id } as User;

  return userData;
};
