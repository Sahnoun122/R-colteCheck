import { db } from "../firebase/firebase.config";
import { AgriculteurProfile } from "../types/agriculteur";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const COLLECTION = "agriculteurs";

export async function getMyProfile(uid: string) {
  const ref = doc(db, COLLECTION, uid);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as AgriculteurProfile) : null;
}

export async function createMyProfile(profile: AgriculteurProfile) {
  const ref = doc(db, COLLECTION, profile.uid);
  await setDoc(ref, profile, { merge: true });
}

export async function updateMyProfile(
  uid: string,
  data: Partial<AgriculteurProfile>,
) {
  const ref = doc(db, COLLECTION, uid);
  await updateDoc(ref, {
    ...data,
    updatedAt: Date.now(),
  });
}
