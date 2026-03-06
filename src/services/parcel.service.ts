import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import { db } from "../firebase/firebase.config";
import { Parcel, ParcelInput } from "../types/parcel";

const COL = "parcelles";

export async function createParcel(
  farmerId: string,
  input: ParcelInput,
): Promise<Parcel> {
  const now = Date.now();
  const data = { ...input, farmerId, createdAt: now, updatedAt: now };
  const ref = await addDoc(collection(db, COL), data);
  return { id: ref.id, ...data };
}

export async function getMyParcels(farmerId: string): Promise<Parcel[]> {
  const q = query(
    collection(db, COL),
    where("farmerId", "==", farmerId),
    orderBy("createdAt", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Parcel);
}

export async function getParcel(id: string): Promise<Parcel | null> {
  const snap = await getDoc(doc(db, COL, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Parcel;
}

export async function updateParcel(
  id: string,
  data: Partial<ParcelInput>,
): Promise<void> {
  await updateDoc(doc(db, COL, id), { ...data, updatedAt: Date.now() });
}

export async function deleteParcel(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}
