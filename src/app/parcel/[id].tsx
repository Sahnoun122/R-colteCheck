import { Colors } from "@/src/constants/colors";
import { getHarvestsByParcel } from "@/src/services/harvest.service";
import { deleteParcel, getParcel } from "@/src/services/parcel.service";
import { deleteZone, getZonesByParcel } from "@/src/services/zone.service";
import { Parcel } from "@/src/types/parcel";
import { Zone } from "@/src/types/zone";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function ParcelDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [parcel, setParcel] = useState<Parcel | null>(null);
  const [zones, setZones] = useState<Zone[]>([]);
  const [harvestStatsByZone, setHarvestStatsByZone] = useState<
    Record<string, { totalKg: number; count: number }>
  >({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [p, z, harvests] = await Promise.all([
        getParcel(id),
        getZonesByParcel(id),
        getHarvestsByParcel(id),
      ]);
      setParcel(p);
      setZones(z);

      const stats = harvests.reduce(
        (acc, harvest) => {
          const current = acc[harvest.zoneId] ?? { totalKg: 0, count: 0 };
          current.totalKg += harvest.quantityKg;
          current.count += 1;
          acc[harvest.zoneId] = current;
          return acc;
        },
        {} as Record<string, { totalKg: number; count: number }>,
      );
      setHarvestStatsByZone(stats);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDeleteParcel = () => {
    Alert.alert(
      "Supprimer la parcelle",
      "Cette action supprime la parcelle. Les zones devront etre supprimees separement.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            await deleteParcel(id!);
            router.replace("/(tabs)/parcelles");
          },
        },
      ],
    );
  };

  const handleDeleteZone = (zone: Zone) => {
    Alert.alert("Supprimer la zone", `Supprimer la zone "${zone.name}" ?`, [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          await deleteZone(zone.id);
          setZones((prev) => prev.filter((z) => z.id !== zone.id));
          setHarvestStatsByZone((prev) => {
            const next = { ...prev };
            delete next[zone.id];
            return next;
          });
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!parcel) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Parcelle introuvable.</Text>
      </View>
    );
  }

  const totalZoneSurface = zones.reduce((sum, z) => sum + (z.surface ?? 0), 0);
  const totalProductionKg = Object.values(harvestStatsByZone).reduce(
    (sum, s) => sum + s.totalKg,
    0,
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={8}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {parcel.name}
        </Text>
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/parcel/edit/[id]",
              params: { id: parcel.id },
            })
          }
          hitSlop={8}
        >
          <Ionicons name="pencil-outline" size={20} color={Colors.primary} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons
              name="location-outline"
              size={18}
              color={Colors.primary}
            />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Localisation</Text>
              <Text style={styles.infoValue}>{parcel.location || "-"}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Ionicons name="expand-outline" size={18} color={Colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Surface totale</Text>
              <Text style={styles.infoValue}>{parcel.totalSurface} ha</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Ionicons name="layers-outline" size={18} color={Colors.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Zones enregistrees</Text>
              <Text style={styles.infoValue}>
                {zones.length} zone{zones.length !== 1 ? "s" : ""} - {" "}
                {totalZoneSurface.toFixed(2)} ha
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Ionicons
              name="bar-chart-outline"
              size={18}
              color={Colors.primary}
            />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Production totale</Text>
              <Text style={styles.infoValue}>{totalProductionKg.toFixed(2)} kg</Text>
            </View>
          </View>
          {parcel.notes ? (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Ionicons
                  name="document-text-outline"
                  size={18}
                  color={Colors.primary}
                />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Notes</Text>
                  <Text style={styles.infoValue}>{parcel.notes}</Text>
                </View>
              </View>
            </>
          ) : null}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Zones de culture</Text>
          <Pressable
            style={styles.addZoneBtn}
            onPress={() =>
              router.push({
                pathname: "/zone/create",
                params: { parcelId: parcel.id },
              })
            }
          >
            <Ionicons name="add" size={18} color={Colors.white} />
            <Text style={styles.addZoneBtnText}>Ajouter</Text>
          </Pressable>
        </View>

        {zones.length === 0 ? (
          <View style={styles.emptyZones}>
            <Ionicons
              name="grid-outline"
              size={40}
              color={Colors.primaryLight}
            />
            <Text style={styles.emptyZonesText}>
              Aucune zone definie. Ajoutez une zone de culture.
            </Text>
          </View>
        ) : (
          zones.map((zone) => (
            <View key={zone.id} style={styles.zoneCard}>
              <Pressable
                style={styles.zoneLeft}
                onPress={() =>
                  router.push({
                    pathname: "../harvest/zone/[zoneId]",
                    params: { zoneId: zone.id },
                  })
                }
              >
                <View style={styles.zoneIconBg}>
                  <Ionicons
                    name="grid-outline"
                    size={18}
                    color={Colors.secondary}
                  />
                </View>
                <View style={styles.zoneBody}>
                  <Text style={styles.zoneName}>{zone.name}</Text>
                  <Text style={styles.zoneCulture}>
                    Culture: {zone.culture} - {zone.surface} ha
                  </Text>
                  <Text style={styles.zoneHarvestSummary}>
                    Production: {" "}
                    {(harvestStatsByZone[zone.id]?.totalKg ?? 0).toFixed(2)} kg
                    {"  "}({harvestStatsByZone[zone.id]?.count ?? 0} recolte
                    {(harvestStatsByZone[zone.id]?.count ?? 0) > 1 ? "s" : ""})
                  </Text>
                  {zone.harvestPeriodStart && zone.harvestPeriodEnd ? (
                    <Text style={styles.zoneDate}>
                      Periode: {zone.harvestPeriodStart} -> {zone.harvestPeriodEnd}
                    </Text>
                  ) : null}
                  <Text style={styles.zoneHint}>Appuyez pour voir les recoltes</Text>
                </View>
              </Pressable>
              <View style={styles.zoneActions}>
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "/zone/edit/[id]",
                      params: { id: zone.id },
                    })
                  }
                  hitSlop={8}
                  style={{ padding: 4 }}
                >
                  <Ionicons
                    name="pencil-outline"
                    size={17}
                    color={Colors.primary}
                  />
                </Pressable>
                <Pressable
                  onPress={() => handleDeleteZone(zone)}
                  hitSlop={8}
                  style={{ padding: 4 }}
                >
                  <Ionicons name="trash-outline" size={17} color={Colors.error} />
                </Pressable>
              </View>
            </View>
          ))
        )}

        <Pressable style={styles.deleteParcelBtn} onPress={handleDeleteParcel}>
          <Ionicons name="trash-outline" size={18} color={Colors.error} />
          <Text style={styles.deleteParcelText}>Supprimer cette parcelle</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 10,
  },
  backBtn: { padding: 2 },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
  },
  scroll: { padding: 16, paddingBottom: 40 },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 8,
  },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 12, color: Colors.textMuted, marginBottom: 2 },
  infoValue: { fontSize: 15, fontWeight: "500", color: Colors.text },
  divider: { height: 1, backgroundColor: Colors.border },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: Colors.text },
  addZoneBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  addZoneBtnText: { color: Colors.white, fontWeight: "600", fontSize: 13 },
  zoneCard: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: Colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  zoneLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  zoneIconBg: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: Colors.secondaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  zoneBody: { flex: 1, gap: 2 },
  zoneName: { fontSize: 14, fontWeight: "600", color: Colors.text },
  zoneCulture: { fontSize: 13, color: Colors.textSecondary },
  zoneHarvestSummary: { fontSize: 12, color: Colors.primary },
  zoneDate: { fontSize: 12, color: Colors.textMuted },
  zoneHint: { fontSize: 11, color: Colors.textMuted },
  zoneActions: { flexDirection: "row", marginLeft: 8, gap: 6 },
  emptyZones: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 24,
    alignItems: "center",
    gap: 8,
  },
  emptyZonesText: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  deleteParcelBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.error,
    gap: 8,
  },
  deleteParcelText: { color: Colors.error, fontWeight: "600" },
  errorText: { color: Colors.error },
});
