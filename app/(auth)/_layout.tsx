import { useAppStore } from "../../store";
import { Redirect, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";

export default function AuthLayout() {
  const token = useAppStore((state) => state.token);
  const [isStoreHydrated, setIsStoreHydrated] = useState(
    useAppStore.persist.hasHydrated()
  );

  useEffect(() => {
    const unsubscribe = useAppStore.persist.onFinishHydration(() => {
      setIsStoreHydrated(true);
    });

    // Si la tienda ya se ha hidratado, podemos establecer el estado inmediatamente.
    if (useAppStore.persist.hasHydrated()) {
      setIsStoreHydrated(true);
    }

    return () => {
      unsubscribe();
    };
  }, []);

  // Mientras se espera que la tienda se hidrate, muestra un indicador de carga.
  if (!isStoreHydrated) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f59e0b" />
      </View>
    );
  }

  // Si la tienda está hidratada y no hay token, redirige a la página de inicio de sesión.
  if (!token) {
    return <Redirect href="/welcome" />;
  }

  // Si hay un token, renderiza las rutas hijas.
  return <Stack screenOptions={{ headerShown: false }} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
  },
});
