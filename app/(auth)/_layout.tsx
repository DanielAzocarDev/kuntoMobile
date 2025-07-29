import { useAppStore } from "../../store";
import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function AuthLayout() {
  const token = useAppStore((state) => state.token);
  const [isStoreHydrated, setIsStoreHydrated] = useState(
    useAppStore.persist.hasHydrated()
  );

  useEffect(() => {
    const unsubscribe = useAppStore.persist.onFinishHydration(() => {
      setIsStoreHydrated(true);
    });

    if (useAppStore.persist.hasHydrated()) {
      setIsStoreHydrated(true);
    }

    return () => {
      unsubscribe();
    };
  }, []);

  if (!isStoreHydrated) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f59e0b" />
      </View>
    );
  }

  if (!token) {
    return <Redirect href="/welcome" />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerStyle: {
            backgroundColor: "#0f172a",
          },
          headerTitleAlign: "center",
          headerTintColor: "#fff",
          headerShadowVisible: false,
          drawerStyle: {
            backgroundColor: "#0f172a",
          },
          drawerActiveBackgroundColor: "rgba(245, 158, 11, 0.1)",
          drawerActiveTintColor: "#f59e0b",
          drawerInactiveTintColor: "#9ca3af",
          drawerLabelStyle: {
            fontSize: 16,
            fontWeight: "500",
          },
        }}
      >
        <Drawer.Screen
          name="dashboard"
          options={{
            headerTitle: "",
          }}
        />
        <Drawer.Screen
          name="products"
          options={{
            headerTitle: "Productos",
          }}
        />
        <Drawer.Screen
          name="clients"
          options={{
            headerTitle: "Clientes",
          }}
        />
        <Drawer.Screen
          name="sales"
          options={{
            headerTitle: "Ventas",
          }}
        />
        <Drawer.Screen
          name="open-accounts"
          options={{
            headerTitle: "Cuentas Abiertas",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
  },
});
