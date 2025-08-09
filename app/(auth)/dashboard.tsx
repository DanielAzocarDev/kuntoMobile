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
import ProductDetailModal from "@/components/ProductDetailModal";
import MobileRevenueKpis from "@/components/analytics/MobileRevenueKpis";
import MobileSalesChart from "@/components/analytics/MobileSalesChart";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../../api/products";
import { IProduct } from "../../interfaces/product.interfaces";

export default function Dashboard() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);

  // Estados para paginación y búsqueda de productos
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

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
    gcTime: 0,
    staleTime: 0,
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

  const handleCloseDetailModal = () => {
    setIsDetailModalVisible(false);
    setSelectedProduct(null);
  };

  // Datos para el FlatList principal
  const dashboardSections = [
    { id: "kpis", type: "kpis" },
    { id: "cart", type: "cart" },
    { id: "products", type: "products" },
  ];

  const renderDashboardSection = ({
    item,
  }: {
    item: { id: string; type: string };
  }) => {
    switch (item.type) {
      case "kpis":
        return <MobileRevenueKpis />;

      case "cart":
        return <ShoppingCart />;

      case "products":
        return (
          <ProductList
            products={productsData ? productsData.data.data : []}
            isLoading={productsLoading}
            currentPage={currentPage}
            totalPages={productsData ? productsData.data.totalPages : 1}
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

          <FlatList
            data={dashboardSections}
            renderItem={renderDashboardSection}
            keyExtractor={(item) => item.id}
            style={styles.flatList}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>

        <ProductDetailModal
          isVisible={isDetailModalVisible}
          onClose={handleCloseDetailModal}
          product={selectedProduct}
        />
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
    // paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 10,
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
  menuButton: {
    padding: 8,
    marginRight: 8,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#1e293b",
    borderRadius: 8,
    marginVertical: 10,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#f59e0b",
  },
  tabText: {
    color: "#9ca3af",
    fontWeight: "600",
  },
  activeTabText: {
    color: "#f59e0b",
  },
});
