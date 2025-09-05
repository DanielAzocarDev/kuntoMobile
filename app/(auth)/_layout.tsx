import { useAppStore } from "../../store";
import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, StyleSheet, Alert } from "react-native";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useGlobalTokenValidation } from "../../hooks/useGlobalTokenValidation";

export default function AuthLayout() {
  const token = useAppStore((state) => state.token);
  const logout = useAppStore((state) => state.logout);
  const [isStoreHydrated, setIsStoreHydrated] = useState(
    useAppStore.persist.hasHydrated()
  );
  const { isValidating } = useGlobalTokenValidation();

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

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Cerrar Sesión",
          style: "destructive",
          onPress: () => {
            logout();
          },
        },
      ]
    );
  };

  if (!isStoreHydrated || isValidating) {
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
            drawerLabel: "Inicio",
          }}
        />
        <Drawer.Screen
          name="analytics"
          options={{
            headerTitle: "Estadísticas",
            drawerLabel: "Estadísticas",
          }}
        />
        <Drawer.Screen
          name="products"
          options={{
            headerTitle: "Productos",
            drawerLabel: "Productos",
          }}
        />
        <Drawer.Screen
          name="clients"
          options={{
            headerTitle: "Clientes",
            drawerLabel: "Clientes",
          }}
        />
        <Drawer.Screen
          name="sales"
          options={{
            headerTitle: "Ventas",
            drawerLabel: "Ventas",
          }}
        />
        <Drawer.Screen
          name="open-accounts"
          options={{
            headerTitle: "Cuentas Abiertas",
            drawerLabel: "Cuentas Abiertas",
          }}
        />
        <Drawer.Screen
          name="profile"
          options={{
            headerTitle: "Mi Perfil",
            drawerLabel: "Mi Perfil",
          }}
        />
        <Drawer.Screen
          name="logout"
          options={{
            headerShown: false,
            drawerLabel: "Cerrar Sesión",
            drawerItemStyle: {
              marginTop: 20,
              borderTopWidth: 1,
              borderTopColor: "#334155",
              paddingTop: 20,
            },
          }}
          listeners={{
            focus: () => {
              handleLogout();
            },
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
