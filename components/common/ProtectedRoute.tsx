import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTokenValidation } from "../../hooks/useTokenValidation";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isValidating } = useTokenValidation();

  // Si está validando, mostrar loading
  if (isValidating) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  // Si no está validando, mostrar el contenido
  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
  },
});
