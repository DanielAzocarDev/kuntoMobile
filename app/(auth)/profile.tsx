import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useAppStore } from "../../store";
import { Ionicons } from "@expo/vector-icons";
import EditProfileForm from "../../components/EditProfileForm";
import ChangePasswordModal from "../../components/ChangePasswordModal";
import TokenDebugInfo from "../../components/common/TokenDebugInfo";

export default function ProfilePage() {
  const user = useAppStore((state) => state.user);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mi Perfil</Text>
      </View>

      <View style={styles.content}>
        {/* Información de Debug */}
        <TokenDebugInfo />

        {/* Información del Usuario */}
        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Información de Usuario</Text>
            <Text style={styles.cardSubtitle}>Tus datos actuales</Text>
          </View>

          <View style={styles.userInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nombre:</Text>
              <Text style={styles.infoValue}>{user?.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>País:</Text>
              <Text style={styles.infoValue}>
                {user?.country || "No especificado"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Moneda:</Text>
              <Text style={styles.infoValue}>
                {user?.currency} ({user?.currencySymbol})
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.changePasswordButton}
            onPress={() => setIsChangePasswordOpen(true)}
          >
            <Ionicons name="lock-closed" size={16} color="#fff" />
            <Text style={styles.buttonText}>Cambiar Contraseña</Text>
          </TouchableOpacity>
        </View>

        {/* Formulario de Edición */}
        <View style={styles.editFormContainer}>
          <EditProfileForm />
        </View>
      </View>

      <ChangePasswordModal
        isVisible={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    padding: 20,
  },
  infoCard: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#94a3b8",
  },
  userInfo: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: "#cbd5e1",
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 14,
    color: "#e2e8f0",
    flex: 1,
    textAlign: "right",
  },
  changePasswordButton: {
    backgroundColor: "#f59e0b",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  editFormContainer: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
