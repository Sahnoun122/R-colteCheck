export type Parcel = {
  id: string;
  farmerId: string;
  name: string;
  location: string;
  totalSurface: number; // en hectares
  notes?: string;
  createdAt: number;
  updatedAt: number;
};

export type ParcelInput = Omit<
  Parcel,
  "id" | "farmerId" | "createdAt" | "updatedAt"
>;
