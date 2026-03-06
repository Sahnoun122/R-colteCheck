import { Colors } from "@/src/constants/colors";
import { useAuth } from "@/src/context/AuthContext";
import { createZone } from "@/src/services/zone.service";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
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

export default function CreateZoneScreen() {
  const { parcelId } = useLocalSearchParams<{ parcelId: string }>();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [culture, setCulture] = useState("");
  const [surface, setSurface] = useState("");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Le nom de la zone est requis.");
      return;
    }
    if (!culture.trim()) {
      setError("La culture est requise.");
      return;
    }
    const surf = parseFloat(surface);
    if (isNaN(surf) || surf <= 0) {
      setError("La surface doit être un nombre positif (en hectares).");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await createZone(parcelId!, user!.uid, {
        name: name.trim(),
        culture: culture.trim(),
        surface: surf,
        harvestPeriodStart: periodStart.trim() || undefined,
        harvestPeriodEnd: periodEnd.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      router.back();
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Nouvelle zone</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.sectionHeading}>Informations de la zone</Text>

          <Text style={styles.fieldLabel}>Nom de la zone *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Zone A — Blé dur"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.fieldLabel}>Type de culture *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Blé, Tomate, Orge..."
            value={culture}
            onChangeText={setCulture}
          />

          <Text style={styles.fieldLabel}>Surface (hectares) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 1.2"
            value={surface}
            onChangeText={setSurface}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={[styles.card, { marginTop: 12 }]}>
          <Text style={styles.sectionHeading}>Période de récolte</Text>

          <Text style={styles.fieldLabel}>Date de début (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 2026-06-01"
            value={periodStart}
            onChangeText={setPeriodStart}
          />

          <Text style={styles.fieldLabel}>Date de fin (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 2026-07-15"
            value={periodEnd}
            onChangeText={setPeriodEnd}
          />
        </View>

        <View style={[styles.card, { marginTop: 12 }]}>
          <Text style={styles.fieldLabel}>Notes (optionnel)</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Observations, traitements prévus..."
            value={notes}
            onChangeText={setNotes}
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
              <Text style={styles.submitText}>Enregistrer la zone</Text>
            </>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    gap: 4,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginTop: 10,
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
