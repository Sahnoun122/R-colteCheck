import { useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteHarvest,
  getHarvestsByZone,
} from "../services/harvest.service";
import { Harvest } from "../types/harvest";

export function useHarvests(zoneId?: string) {
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHarvests = useCallback(async () => {
    if (!zoneId) {
      setHarvests([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getHarvestsByZone(zoneId);
      setHarvests(data);
    } catch {
      setError("Erreur lors du chargement des recoltes.");
    } finally {
      setLoading(false);
    }
  }, [zoneId]);

  useEffect(() => {
    fetchHarvests();
  }, [fetchHarvests]);

  const remove = useCallback(async (id: string) => {
    await deleteHarvest(id);
    setHarvests((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const totalKg = useMemo(
    () => harvests.reduce((sum, h) => sum + h.quantityKg, 0),
    [harvests],
  );

  return { harvests, totalKg, loading, error, refetch: fetchHarvests, remove };
}
