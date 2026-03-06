import { Colors } from "@/src/constants/colors";
import { useAuth } from "@/src/context/AuthContext";
import { createHarvest } from "@/src/services/harvest.service";
import { getZone } from "@/src/services/zone.service";
import { Zone } from "@/src/types/zone";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

function getTodayISODate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function CreateHarvestScreen() {
  const { zoneId } = useLocalSearchParams<{ zoneId: string }>();
  const { user } = useAuth();

  const [zone, setZone] = useState<Zone | null>(null);
  const [loadingZone, setLoadingZone] = useState(true);
  const [harvestDate, setHarvestDate] = useState(getTodayISODate());
  const [quantityKg, setQuantityKg] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleSubmit = async () => {
    if (!zone || !user) {
      setError("Zone ou utilisateur introuvable.");
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(harvestDate.trim())) {
      setError("La date doit etre au format YYYY-MM-DD.");
      return;
    }

    const quantity = parseFloat(quantityKg);
    if (isNaN(quantity) || quantity <= 0) {
      setError("La quantite doit etre un nombre positif en kg.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await createHarvest(zone.id, zone.parcelId, user.uid, {
        harvestDate: harvestDate.trim(),
        quantityKg: quantity,
        notes: notes.trim() || undefined,
      });
      router.back();
    } catch {
      setError("Une erreur est survenue. Veuillez reessayer.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingZone) {
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Nouvelle recolte</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.sectionHeading}>{zone.name}</Text>
          <Text style={styles.sectionSub}>
            Culture: {zone.culture} - Surface: {zone.surface} ha
          </Text>

          <Text style={styles.fieldLabel}>Date de recolte (YYYY-MM-DD) *</Text>
          <TextInput
            style={styles.input}
            value={harvestDate}
            onChangeText={setHarvestDate}
            placeholder="Ex: 2026-07-20"
          />

          <Text style={styles.fieldLabel}>Quantite recoltee (kg) *</Text>
          <TextInput
            style={styles.input}
            value={quantityKg}
            onChangeText={setQuantityKg}
            placeholder="Ex: 350"
            keyboardType="decimal-pad"
          />

          <Text style={styles.fieldLabel}>Notes (optionnel)</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Qualite, observations..."
            multiline
            numberOfLines={3}
          />
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

        <Pressable
          style={[styles.submitBtn, loading && styles.submitDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <>
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color={Colors.white}
              />
              <Text style={styles.submitText}>Enregistrer la recolte</Text>
            </>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
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
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "center",
  },
  scroll: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.primary,
  },
  sectionSub: {
    marginTop: 4,
    color: Colors.textSecondary,
    fontSize: 13,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  textarea: { minHeight: 80, textAlignVertical: "top" },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.errorLight,
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  errorText: { color: Colors.error, fontSize: 13, flex: 1 },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.secondary,
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    gap: 8,
  },
  submitDisabled: { opacity: 0.6 },
  submitText: { color: Colors.white, fontSize: 16, fontWeight: "700" },
});

