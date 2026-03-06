import { Colors } from "@/src/constants/colors";
import { useAuth } from "@/src/context/AuthContext";
import { useParcels } from "@/src/hooks/useParcels";
import { logout } from "@/src/services/auth.service";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function HomeTab() {
  const { user } = useAuth();
  const { parcels } = useParcels();

  const firstName = user?.displayName?.split(" ")[0] ?? "Agriculteur";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      {/* Header */}
      <View style={styles.hero}>
        <View>
          <Text style={styles.welcome}>Bonjour, {firstName} 👋</Text>
          <Text style={styles.subtitle}>Votre tableau de bord agricole</Text>
        </View>
        <Pressable
          style={styles.logoutBtn}
          onPress={async () => {
            await logout();
            router.replace("/(auth)/login");
          }}
        >
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
        </Pressable>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="leaf" size={28} color={Colors.primary} />
          <Text style={styles.statValue}>{parcels.length}</Text>
          <Text style={styles.statLabel}>Parcelles</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="expand" size={28} color={Colors.secondary} />
          <Text style={styles.statValue}>
            {parcels.reduce((s, p) => s + p.totalSurface, 0).toFixed(1)}
          </Text>
          <Text style={styles.statLabel}>Hectares totaux</Text>
        </View>
      </View>

      {/* Quick actions */}
      <Text style={styles.sectionTitle}>Actions rapides</Text>
      <View style={styles.actionsGrid}>
        <Pressable
          style={styles.actionCard}
          onPress={() => router.push("/(tabs)/parcelles")}
        >
          <Ionicons name="leaf-outline" size={26} color={Colors.primary} />
          <Text style={styles.actionLabel}>Mes parcelles</Text>
        </Pressable>
        <Pressable
          style={styles.actionCard}
          onPress={() => router.push("/parcel/create")}
        >
          <Ionicons
            name="add-circle-outline"
            size={26}
            color={Colors.primary}
          />
          <Text style={styles.actionLabel}>Nouvelle parcelle</Text>
        </Pressable>
        <Pressable
          style={styles.actionCard}
          onPress={() => router.push("/(tabs)/profile")}
        >
          <Ionicons name="person-outline" size={26} color={Colors.primary} />
          <Text style={styles.actionLabel}>Mon profil</Text>
        </Pressable>
      </View>

      {/* Recent parcels */}
      {parcels.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Dernières parcelles</Text>
          {parcels.slice(0, 3).map((p) => (
            <Pressable
              key={p.id}
              style={styles.recentCard}
              onPress={() =>
                router.push({
                  pathname: "/parcel/[id]",
                  params: { id: p.id },
                })
              }
            >
              <View style={styles.recentIcon}>
                <Ionicons name="leaf" size={18} color={Colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.recentName}>{p.name}</Text>
                <Text style={styles.recentMeta}>
                  {p.location} — {p.totalSurface} ha
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={Colors.textMuted}
              />
            </Pressable>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 16, paddingBottom: 40 },
  hero: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  welcome: { fontSize: 22, fontWeight: "700", color: Colors.text },
  subtitle: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  logoutBtn: { padding: 6 },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 24 },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    gap: 4,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  statValue: { fontSize: 22, fontWeight: "700", color: Colors.text },
  statLabel: { fontSize: 12, color: Colors.textSecondary },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 10,
  },
  actionsGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
    flexWrap: "wrap",
  },
  actionCard: {
    flex: 1,
    minWidth: "28%",
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    gap: 8,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.text,
    textAlign: "center",
  },
  recentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    gap: 10,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  recentIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryUltraLight,
    justifyContent: "center",
    alignItems: "center",
  },
  recentName: { fontSize: 14, fontWeight: "600", color: Colors.text },
  recentMeta: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
});
