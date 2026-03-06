import { Colors } from "@/src/constants/colors";
import { useAuth } from "@/src/context/AuthContext";
import { createParcel } from "@/src/services/parcel.service";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
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

export default function CreateParcelScreen() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [totalSurface, setTotalSurface] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Le nom de la parcelle est requis.");
      return;
    }
    if (!location.trim()) {
      setError("La localisation est requise.");
      return;
    }
    const surface = parseFloat(totalSurface);
    if (isNaN(surface) || surface <= 0) {
      setError("La surface doit être un nombre positif (en hectares).");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const parcel = await createParcel(user!.uid, {
        name: name.trim(),
        location: location.trim(),
        totalSurface: surface,
        notes: notes.trim() || undefined,
      });
      router.replace(`/parcel/${parcel.id}`);
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
        <Text style={styles.headerTitle}>Nouvelle parcelle</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.fieldLabel}>Nom de la parcelle *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Parcelle Nord"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.fieldLabel}>Localisation *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Village El Menia, commune..."
            value={location}
            onChangeText={setLocation}
          />

          <Text style={styles.fieldLabel}>Surface totale (hectares) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 2.5"
            value={totalSurface}
            onChangeText={setTotalSurface}
            keyboardType="decimal-pad"
          />

          <Text style={styles.fieldLabel}>Notes (optionnel)</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Observations, informations complémentaires..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />

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
        </View>

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
              <Text style={styles.submitText}>Enregistrer la parcelle</Text>
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
    gap: 6,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
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
    marginTop: 8,
  },
  errorText: { color: Colors.error, fontSize: 13, flex: 1 },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    gap: 8,
  },
  submitDisabled: { opacity: 0.6 },
  submitText: { color: Colors.white, fontSize: 16, fontWeight: "700" },
});
