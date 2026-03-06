import { Colors } from "@/src/constants/colors";
import { useHarvests } from "@/src/hooks/useHarvests";
import { getZone } from "@/src/services/zone.service";
import { Harvest } from "@/src/types/harvest";
import { Zone } from "@/src/types/zone";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function ZoneHarvestsScreen() {
  const { zoneId } = useLocalSearchParams<{ zoneId: string }>();
  const { harvests, totalKg, loading, error, refetch, remove } =
    useHarvests(zoneId);

  const [zone, setZone] = useState<Zone | null>(null);
  const [loadingZone, setLoadingZone] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    (async () => {
      if (!zoneId) {
        setLoadingZone(false);
        return;
      }
      const data = await getZone(zoneId);
      setZone(data);
      setLoadingZone(false);
    })();
  }, [zoneId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const sortedHarvests = useMemo(
    () =>
      [...harvests].sort(
        (a, b) =>
          b.harvestDate.localeCompare(a.harvestDate) || b.createdAt - a.createdAt,
      ),
    [harvests],
  );

  const averageKg = harvests.length ? totalKg / harvests.length : 0;

  const handleDelete = (harvest: Harvest) => {
    Alert.alert(
      "Supprimer la recolte",
      `Supprimer la recolte du ${harvest.harvestDate} ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => remove(harvest.id),
        },
      ],
    );
  };

  if (loadingZone || (loading && !refreshing)) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!zone) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Zone introuvable.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            Suivi recoltes - {zone.name}
          </Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {zone.culture} - {zone.surface} ha
          </Text>
        </View>
        <Pressable
          style={styles.addBtn}
          onPress={() =>
            router.push({
              pathname: "../create",
              params: { zoneId: zone.id },
            })
          }
        >
          <Ionicons name="add" size={18} color={Colors.white} />
        </Pressable>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total produit</Text>
          <Text style={styles.summaryValue}>{totalKg.toFixed(2)} kg</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Nombre de recoltes</Text>
          <Text style={styles.summaryValue}>{harvests.length}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Moyenne / recolte</Text>
          <Text style={styles.summaryValue}>{averageKg.toFixed(2)} kg</Text>
        </View>
      </View>

      {!!error && (
        <View style={styles.errorBox}>
          <Ionicons
            name="alert-circle-outline"
            size={16}
            color={Colors.error}
          />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        data={sortedHarvests}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="bar-chart-outline" size={48} color={Colors.primary} />
            <Text style={styles.emptyTitle}>Aucune recolte enregistree</Text>
            <Text style={styles.emptySub}>
              Ajoutez votre premiere recolte pour suivre la production de cette
              zone.
            </Text>
            <Pressable
              style={styles.emptyBtn}
              onPress={() =>
                router.push({
                  pathname: "../create",
                  params: { zoneId: zone.id },
                })
              }
            >
              <Text style={styles.emptyBtnText}>Enregistrer une recolte</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.harvestCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.harvestDate}>Date: {item.harvestDate}</Text>
              <Text style={styles.harvestQty}>
                Quantite: {item.quantityKg.toFixed(2)} kg
              </Text>
              {!!item.notes && (
                <Text style={styles.harvestNotes}>Notes: {item.notes}</Text>
              )}
            </View>
            <Pressable onPress={() => handleDelete(item)} hitSlop={8}>
              <Ionicons name="trash-outline" size={18} color={Colors.error} />
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
  },
  summaryCard: {
    flexDirection: "row",
    margin: 16,
    borderRadius: 12,
    backgroundColor: Colors.white,
    paddingVertical: 12,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  summaryLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: "center",
  },
  summaryValue: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginVertical: 2,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.errorLight,
    padding: 10,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  errorText: { color: Colors.error, fontSize: 13, textAlign: "center" },
  empty: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    gap: 10,
  },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: Colors.text },
  emptySub: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  emptyBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginTop: 4,
  },
  emptyBtnText: { color: Colors.white, fontWeight: "600" },
  harvestCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  harvestDate: { fontSize: 14, fontWeight: "600", color: Colors.text },
  harvestQty: {
    marginTop: 2,
    fontSize: 13,
    color: Colors.primary,
    fontWeight: "600",
  },
  harvestNotes: {
    marginTop: 4,
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
