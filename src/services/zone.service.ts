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
import { Zone, ZoneInput } from "../types/zone";

const COL = "zones";

export async function createZone(
  parcelId: string,
  farmerId: string,
  input: ZoneInput,
): Promise<Zone> {
  const now = Date.now();
  const data = { ...input, parcelId, farmerId, createdAt: now, updatedAt: now };
  const ref = await addDoc(collection(db, COL), data);
  return { id: ref.id, ...data };
}

export async function getZonesByParcel(parcelId: string): Promise<Zone[]> {
  const q = query(
    collection(db, COL),
    where("parcelId", "==", parcelId),
    orderBy("createdAt", "asc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Zone);
}

export async function getZone(id: string): Promise<Zone | null> {
  const snap = await getDoc(doc(db, COL, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Zone;
}

export async function updateZone(
  id: string,
  data: Partial<ZoneInput>,
): Promise<void> {
  await updateDoc(doc(db, COL, id), { ...data, updatedAt: Date.now() });
}

export async function deleteZone(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}
