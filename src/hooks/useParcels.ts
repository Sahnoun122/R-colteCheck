import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { deleteParcel, getMyParcels } from "../services/parcel.service";
import { Parcel } from "../types/parcel";

export function useParcels() {
  const { user } = useAuth();
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParcels = useCallback(async () => {
    if (!user?.uid) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getMyParcels(user.uid);
      setParcels(data);
    } catch {
      setError("Erreur lors du chargement des parcelles.");
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchParcels();
  }, [fetchParcels]);

  const remove = useCallback(async (id: string) => {
    await deleteParcel(id);
    setParcels((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return { parcels, loading, error, refetch: fetchParcels, remove };
}
