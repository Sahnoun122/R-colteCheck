import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";

import { auth } from "../firebase/firebase.config";

export async function register(email: string, password: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function login(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}

export async function logout() {
  await signOut(auth);
}
