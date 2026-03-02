import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "@/src/context/AuthContext";

import { getMyProfile, updateMyProfile } from "@/src/services/profile.service";
import { AgriculteurProfile } from "@/src/types/agriculteur";

export default function ProfileScreen() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [profile, setProfile] = useState<AgriculteurProfile | null>(null);

  // form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [farmName, setFarmName] = useState("");

  useEffect(() => {
    const run = async () => {
      if (!user?.uid) return;
      try {
        setLoading(true);
        setError("");
        const p = await getMyProfile(user.uid);

        if (p) {
          setProfile(p);
          setFullName(p.fullName || "");
          setPhone(p.phone || "");
          setCity(p.city || "");
          setFarmName(p.farmName || "");
        } else {
          setError("Profil introuvable.");
        }
      } catch (e) {
        setError("Erreur lors du chargement du profil.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [user?.uid]);

  const handleSave = async () => {
    if (!user?.uid) return;

    if (!fullName.trim()) {
      setError("Le nom complet est obligatoire.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await updateMyProfile(user.uid, {
        fullName: fullName.trim(),
        phone: phone.trim(),
        city: city.trim(),
        farmName: farmName.trim(),
      });

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              fullName: fullName.trim(),
              phone: phone.trim(),
              city: city.trim(),
              farmName: farmName.trim(),
              updatedAt: Date.now(),
            }
          : prev,
      );
    } catch (e) {
      setError("Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mon profil</Text>
      <Text style={styles.subtitle}>Gérez vos informations personnelles</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.readonly}>{user?.email ?? "—"}</Text>
      </View>

      <Text style={styles.label}>Nom complet</Text>
      <TextInput
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
        placeholder="Nom complet"
      />

      <Text style={styles.label}>Téléphone</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="Téléphone"
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Ville / Région</Text>
      <TextInput
        style={styles.input}
        value={city}
        onChangeText={setCity}
        placeholder="Ville / Région"
      />

      <Text style={styles.label}>Nom de l’exploitation (optionnel)</Text>
      <TextInput
        style={styles.input}
        value={farmName}
        onChangeText={setFarmName}
        placeholder="Nom de l’exploitation"
      />

      {!!error && <Text style={styles.error}>{error}</Text>}

      <Pressable
        style={[styles.button, saving && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.buttonText}>
          {saving ? "Enregistrement..." : "Enregistrer"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 10 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 26, fontWeight: "700" },
  subtitle: { fontSize: 14, opacity: 0.7, marginBottom: 10 },
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 6,
  },
  label: { fontSize: 13, opacity: 0.7, marginTop: 6 },
  readonly: { fontSize: 16, fontWeight: "600", marginTop: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  error: { color: "red", marginTop: 6 },
  button: {
    backgroundColor: "#111",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
