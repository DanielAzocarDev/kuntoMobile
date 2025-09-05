import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppStore } from "../../store";

export default function TokenDebugInfo() {
  const token = useAppStore((state) => state.token);
  const user = useAppStore((state) => state.user);

  return (
    <View style={styles.debugContainer}>
      <Text style={styles.debugTitle}>🔍 Debug Info</Text>
      <View style={styles.debugRow}>
        <Text style={styles.debugLabel}>Token:</Text>
        <Text style={styles.debugValue}>
          {token ? `${token.substring(0, 20)}...` : "No presente"}
        </Text>
      </View>
      <View style={styles.debugRow}>
        <Text style={styles.debugLabel}>Usuario:</Text>
        <Text style={styles.debugValue}>
          {user ? `${user.name} (${user.email})` : "No presente"}
        </Text>
      </View>
      <View style={styles.debugRow}>
        <Text style={styles.debugLabel}>Token Length:</Text>
        <Text style={styles.debugValue}>
          {token ? token.length : 0} caracteres
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  debugContainer: {
    backgroundColor: "#1e293b",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f59e0b",
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#f59e0b",
    marginBottom: 8,
  },
  debugRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  debugLabel: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "600",
  },
  debugValue: {
    fontSize: 12,
    color: "#e2e8f0",
    flex: 1,
    textAlign: "right",
  },
});
