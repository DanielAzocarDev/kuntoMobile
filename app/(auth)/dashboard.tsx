import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppStore } from "../../store";

export default function Dashboard() {
  const router = useRouter();
  const { user, token, logout } = useAppStore();

  const handleLogout = () => {
    logout();
    router.replace("/welcome");
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <LinearGradient
        colors={["#0f172a", "#1e293b", "#334155"]}
        style={styles.container}
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.welcomeText}>
                Bienvenido, <Text style={styles.userName}>{user.name}</Text>
              </Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
            <TouchableOpacity
              onPress={handleLogout}
              style={styles.logoutButton}
            >
              <Ionicons name="log-out-outline" size={24} color="#f59e0b" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Dashboard Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* User Info Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons
                name="person-circle-outline"
                size={24}
                color="#f59e0b"
              />
              <Text style={styles.cardTitle}>Información del Usuario</Text>
            </View>
            <View style={styles.userInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>País:</Text>
                <Text style={styles.infoValue}>
                  {user.country || "No especificado"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Moneda:</Text>
                <Text style={styles.infoValue}>
                  {user.currency} ({user.currencySymbol})
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Rol:</Text>
                <Text style={styles.infoValue}>{user.role}</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="flash-outline" size={24} color="#f59e0b" />
              <Text style={styles.cardTitle}>Acciones Rápidas</Text>
            </View>
            <View style={styles.actionsGrid}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="cart-outline" size={32} color="#f59e0b" />
                <Text style={styles.actionText}>Productos</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="cash-outline" size={32} color="#f59e0b" />
                <Text style={styles.actionText}>Ventas</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="people-outline" size={32} color="#f59e0b" />
                <Text style={styles.actionText}>Clientes</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <Ionicons
                  name="trending-up-outline"
                  size={32}
                  color="#f59e0b"
                />
                <Text style={styles.actionText}>Reportes</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Token Info (for debugging) */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="key-outline" size={24} color="#f59e0b" />
              <Text style={styles.cardTitle}>Estado de Sesión</Text>
            </View>
            <View style={styles.tokenInfo}>
              <Text style={styles.tokenStatus}>
                Token: {token ? "✅ Activo" : "❌ No disponible"}
              </Text>
              <Text style={styles.tokenPreview}>
                {token ? `${token.substring(0, 20)}...` : "No hay token"}
              </Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 18,
    color: "#e5e7eb",
    marginBottom: 4,
  },
  userName: {
    color: "#f59e0b",
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 14,
    color: "#9ca3af",
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "rgba(30, 41, 59, 0.8)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#e5e7eb",
    marginLeft: 12,
  },
  userInfo: {
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 14,
    color: "#9ca3af",
  },
  infoValue: {
    fontSize: 14,
    color: "#e5e7eb",
    fontWeight: "500",
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  actionButton: {
    width: "48%",
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.2)",
  },
  actionText: {
    color: "#f59e0b",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
  },
  tokenInfo: {
    gap: 8,
  },
  tokenStatus: {
    fontSize: 14,
    color: "#e5e7eb",
    fontWeight: "500",
  },
  tokenPreview: {
    fontSize: 12,
    color: "#9ca3af",
    fontFamily: "monospace",
  },
});
