import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { Movie } from '../types/movie';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const getUserList = async (userId: string) => {
  const userListRef = collection(db, 'users', userId, 'myList');
  const querySnapshot = await getDocs(userListRef);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addToList = async (userId: string, movie: Movie) => {
  const movieRef = doc(db, 'users', userId, 'myList', movie.id.toString());
  await setDoc(movieRef, movie);
};

export const removeFromList = async (userId: string, movieId: string) => {
  const movieRef = doc(db, 'users', userId, 'myList', movieId);
  await deleteDoc(movieRef);
}; 