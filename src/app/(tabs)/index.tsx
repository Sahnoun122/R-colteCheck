import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/src/context/AuthContext";
import { logout } from "@/src/services/auth.service";
export default function HomeTab() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tableau de bord</Text>
      <Text style={styles.subtitle}>
        Bienvenue sur votre espace agriculteur
      </Text>

      <Text style={styles.card}>
        Connecté en tant que : {user?.email ?? "—"}
      </Text>

      <Pressable
        style={styles.button}
        onPress={async () => {
          await logout();
          router.replace("/(auth)/login");
        }}
      >
        <Text style={styles.buttonText}>Se déconnecter</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", gap: 12 },
  title: { fontSize: 26, fontWeight: "700" },
  subtitle: { fontSize: 14, opacity: 0.7 },
  card: { padding: 12, borderWidth: 1, borderColor: "#ddd", borderRadius: 10 },
  button: {
    backgroundColor: "#111",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
