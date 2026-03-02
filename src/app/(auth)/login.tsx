import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";

import { login } from "@/src/services/auth.service";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await login(email.trim(), password);
      router.replace("/(tabs)");
    } catch (e) {
      setError("Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      <Text style={styles.subtitle}>Accédez à votre espace agriculteur</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {!!error && <Text style={styles.error}>{error}</Text>}

      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Chargement..." : "Se connecter"}
        </Text>
      </Pressable>

      <Pressable
        style={styles.linkBtn}
        onPress={() => router.push("/(auth)/forgot-password")}
      >
        <Text style={styles.link}>Mot de passe oublié ?</Text>
      </Pressable>

      <Pressable
        style={styles.linkBtn}
        onPress={() => router.push("/(auth)/register")}
      >
        <Text style={styles.link}>Créer un compte</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", gap: 12 },
  title: { fontSize: 26, fontWeight: "700" },
  subtitle: { fontSize: 14, opacity: 0.7, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  error: { color: "red" },
  button: {
    backgroundColor: "#111",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  linkBtn: { alignItems: "center", paddingVertical: 6 },
  link: { textDecorationLine: "underline" },
});
