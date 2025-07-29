import React, { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppStore } from "../../store";
import StatsModule from "@/components/StatsModule";
import ShoppingCart from "@/components/ShoppingCart";
import ProductList from "@/components/ProductList";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../../api/products";

export default function Dashboard() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);

  // Estados para paginación y búsqueda de productos
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Debounce para la búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1); // Resetear a la primera página cuando se busca
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Solo consulta de productos para la lista
  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ["products", currentPage, debouncedSearchQuery],
    queryFn: () => getProducts(currentPage, 10, debouncedSearchQuery),
  });

  const handleLogout = () => {
    logout();
    router.replace("/welcome");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Datos para el FlatList principal
  const dashboardSections = [
    { id: "header", type: "header" },
    { id: "stats", type: "stats" },
    { id: "cart", type: "cart" },
    { id: "products", type: "products" },
  ];

  const renderDashboardSection = ({
    item,
  }: {
    item: { id: string; type: string };
  }) => {
    switch (item.type) {
      case "header":
        return (
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.headerTextContainer}>
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
        );

      case "stats":
        return <StatsModule />;

      case "cart":
        return <ShoppingCart />;

      case "products":
        return (
          <ProductList
            products={productsData?.data?.data || []}
            isLoading={productsLoading}
            currentPage={currentPage}
            totalPages={productsData?.data?.totalPages || 1}
            onPageChange={handlePageChange}
            onSearch={handleSearch}
            searchQuery={searchQuery}
          />
        );

      default:
        return null;
    }
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

        <SafeAreaView style={styles.safeArea}>
          <FlatList
            data={dashboardSections}
            renderItem={renderDashboardSection}
            keyExtractor={(item) => item.id}
            style={styles.flatList}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            maxToRenderPerBatch={4}
            windowSize={10}
            initialNumToRender={4}
          />
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexGrow: 1,
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
  headerTextContainer: {
    flex: 1,
    marginRight: 10,
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
});
