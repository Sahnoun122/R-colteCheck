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
import { Harvest, HarvestInput } from "../types/harvest";

const COL = "harvests";

export async function createHarvest(
  zoneId: string,
  parcelId: string,
  farmerId: string,
  input: HarvestInput,
): Promise<Harvest> {
  const now = Date.now();
  const data = {
    ...input,
    zoneId,
    parcelId,
    farmerId,
    createdAt: now,
    updatedAt: now,
  };
  const ref = await addDoc(collection(db, COL), data);
  return { id: ref.id, ...data };
}

export async function getHarvestsByZone(zoneId: string): Promise<Harvest[]> {
  const q = query(
    collection(db, COL),
    where("zoneId", "==", zoneId),
    orderBy("createdAt", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Harvest);
}

export async function getHarvestsByParcel(parcelId: string): Promise<Harvest[]> {
  const q = query(
    collection(db, COL),
    where("parcelId", "==", parcelId),
    orderBy("createdAt", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Harvest);
}

export async function getHarvest(id: string): Promise<Harvest | null> {
  const snap = await getDoc(doc(db, COL, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Harvest;
}

export async function updateHarvest(
  id: string,
  data: Partial<HarvestInput>,
): Promise<void> {
  await updateDoc(doc(db, COL, id), { ...data, updatedAt: Date.now() });
}

export async function deleteHarvest(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}
