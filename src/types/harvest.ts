export type Harvest = {
  id: string;
  zoneId: string;
  parcelId: string;
  farmerId: string;
  harvestDate: string; // YYYY-MM-DD
  quantityKg: number;
  notes?: string;
  createdAt: number;
  updatedAt: number;
};

export type HarvestInput = Omit<
  Harvest,
  "id" | "zoneId" | "parcelId" | "farmerId" | "createdAt" | "updatedAt"
>;
