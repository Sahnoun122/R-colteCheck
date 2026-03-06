import { Colors } from "@/src/constants/colors";
import { useParcels } from "@/src/hooks/useParcels";
import { Parcel } from "@/src/types/parcel";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
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

export default function ParcellesScreen() {
  const { parcels, loading, error, refetch, remove } = useParcels();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleDelete = (parcel: Parcel) => {
    Alert.alert(
      "Supprimer la parcelle",
      `Voulez-vous supprimer "${parcel.name}" ? Cette action est irréversible.`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => remove(parcel.id),
        },
      ],
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.error} />
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryBtn} onPress={refetch}>
          <Text style={styles.retryText}>Réessayer</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes Parcelles</Text>
        <Pressable
          style={styles.addBtn}
          onPress={() => router.push("/parcel/create")}
        >
          <Ionicons name="add" size={22} color={Colors.white} />
          <Text style={styles.addBtnText}>Ajouter</Text>
        </Pressable>
      </View>

      {parcels.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="leaf-outline" size={64} color={Colors.primaryLight} />
          <Text style={styles.emptyTitle}>Aucune parcelle</Text>
          <Text style={styles.emptySubtitle}>
            Ajoutez votre première parcelle pour commencer le suivi.
          </Text>
          <Pressable
            style={styles.emptyBtn}
            onPress={() => router.push("/parcel/create")}
          >
            <Text style={styles.emptyBtnText}>Créer une parcelle</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={parcels}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 24 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.primary]}
            />
          }
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() => router.push(`/parcel/${item.id}`)}
            >
              <View style={styles.cardIcon}>
                <Ionicons name="leaf" size={24} color={Colors.primary} />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <View style={styles.cardRow}>
                  <Ionicons
                    name="location-outline"
                    size={13}
                    color={Colors.textSecondary}
                  />
                  <Text style={styles.cardMeta}>{item.location || "—"}</Text>
                </View>
                <View style={styles.cardRow}>
                  <Ionicons
                    name="expand-outline"
                    size={13}
                    color={Colors.textSecondary}
                  />
                  <Text style={styles.cardMeta}>{item.totalSurface} ha</Text>
                </View>
              </View>
              <View style={styles.cardActions}>
                <Pressable
                  style={styles.actionBtn}
                  onPress={() => router.push(`/parcel/edit/${item.id}`)}
                  hitSlop={8}
                >
                  <Ionicons
                    name="pencil-outline"
                    size={18}
                    color={Colors.primary}
                  />
                </Pressable>
                <Pressable
                  style={styles.actionBtn}
                  onPress={() => handleDelete(item)}
                  hitSlop={8}
                >
                  <Ionicons
                    name="trash-outline"
                    size={18}
                    color={Colors.error}
                  />
                </Pressable>
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: { fontSize: 22, fontWeight: "700", color: Colors.text },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  addBtnText: { color: Colors.white, fontWeight: "600", fontSize: 14 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 14,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryUltraLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardBody: { flex: 1, gap: 3 },
  cardTitle: { fontSize: 16, fontWeight: "600", color: Colors.text },
  cardRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  cardMeta: { fontSize: 13, color: Colors.textSecondary },
  cardActions: { flexDirection: "row", gap: 8, marginLeft: 8 },
  actionBtn: { padding: 4 },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 40,
  },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: Colors.text },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  emptyBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  emptyBtnText: { color: Colors.white, fontWeight: "600" },
  errorText: { color: Colors.error, fontSize: 14, textAlign: "center" },
  retryBtn: {
    backgroundColor: Colors.primaryUltraLight,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: { color: Colors.primary, fontWeight: "600" },
});
