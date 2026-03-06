export type Zone = {
  id: string;
  parcelId: string;
  farmerId: string;
  name: string;
  culture: string;
  surface: number; // en hectares
  harvestPeriodStart?: string; // YYYY-MM-DD
  harvestPeriodEnd?: string; // YYYY-MM-DD
  notes?: string;
  createdAt: number;
  updatedAt: number;
};

export type ZoneInput = Omit<
  Zone,
  "id" | "parcelId" | "farmerId" | "createdAt" | "updatedAt"
>;
