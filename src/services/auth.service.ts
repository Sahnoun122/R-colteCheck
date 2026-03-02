import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import { createMyProfile } from "./profile.service";

export async function register(
  email: string,
  password: string,
  fullName: string,
) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  await updateProfile(cred.user, { displayName: fullName });

  await createMyProfile({
    uid: cred.user.uid,
    fullName,
    email: cred.user.email ?? email,
    phone: "",
    city: "",
    farmName: "",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

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
