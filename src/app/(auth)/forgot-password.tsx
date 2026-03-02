import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { resetPassword } from "@/src/services/auth.service";
export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      setError("Veuillez saisir votre adresse email.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");
      await resetPassword(email.trim());
      setMessage("Un email de réinitialisation a été envoyé.");
    } catch (e) {
      setError("Une erreur est survenue. Vérifiez votre email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mot de passe oublié</Text>
      <Text style={styles.subtitle}>
        Entrez votre adresse email pour recevoir un lien de réinitialisation.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Adresse email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {!!error && <Text style={styles.error}>{error}</Text>}
      {!!message && <Text style={styles.success}>{message}</Text>}

      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleReset}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Envoi..." : "Envoyer"}
        </Text>
      </Pressable>

      <Pressable
        style={styles.linkBtn}
        onPress={() => router.replace("/(auth)/login")}
      >
        <Text style={styles.link}>Retour à la connexion</Text>
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
  success: { color: "green" },
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
