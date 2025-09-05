import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../api/products";
import { getClients } from "../api/clients";
import { getSales } from "../api/sales";

const { width } = Dimensions.get("window");

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  isLoading?: boolean;
  isCurrency?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  isLoading = false,
  isCurrency = false,
}) => (
  <View style={[styles.statCard, { borderLeftColor: color }]}>
    <View style={styles.statHeader}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon as any} size={32} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={[styles.statValue, { color }]}>
          {isLoading
            ? "..."
            : isCurrency
            ? `$${Number(value).toLocaleString()}`
            : value.toLocaleString()}
        </Text>
      </View>
    </View>
  </View>
);

const StatsModule: React.FC = () => {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Consultas independientes para estadísticas generales
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["stats-products"],
    queryFn: () => getProducts(1, 1), // Solo necesitamos el total, no los datos
  });

  const { data: clientsData, isLoading: clientsLoading } = useQuery({
    queryKey: ["stats-clients"],
    queryFn: () => getClients(1, 1), // Solo necesitamos el total, no los datos
  });

  const { data: salesData, isLoading: salesLoading } = useQuery({
    queryKey: ["stats-sales"],
    queryFn: () => getSales(1, 1), // Solo necesitamos el total, no los datos
  });

  // Calcular estadísticas generales
  const totalProducts = productsData?.data?.totalItems || 0;
  const totalClients = clientsData?.data?.totalItems || 0;
  const monthlySales = salesData?.data?.totalSale || 0;
  const newOrders = salesData?.data?.data?.length || 0;
  const isLoading = productsLoading || clientsLoading || salesLoading;

  const stats = [
    {
      title: "Total de Productos",
      value: totalProducts,
      icon: "cube-outline",
      color: "#3b82f6",
    },
    {
      title: "Total de Clientes",
      value: totalClients,
      icon: "people-outline",
      color: "#f59e0b",
    },
    {
      title: "Ventas del Mes",
      value: monthlySales,
      icon: "trending-up-outline",
      color: "#10b981",
      isCurrency: true,
    },
    {
      title: "Nuevos Pedidos",
      value: newOrders,
      icon: "cart-outline",
      color: "#8b5cf6",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % stats.length;
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        return nextIndex;
      });
    }, 5000); // Cambia cada 5 segundos

    return () => clearInterval(interval);
  }, [stats.length]);

  const renderStatCard = ({ item }: { item: (typeof stats)[0] }) => (
    <View style={styles.cardContainer}>
      <StatCard
        title={item.title}
        value={item.value}
        icon={item.icon}
        color={item.color}
        isLoading={isLoading}
        isCurrency={item.isCurrency}
      />
    </View>
  );

  const renderPagination = () => (
    <View style={styles.pagination}>
      {stats.map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            index === currentIndex && styles.paginationDotActive,
          ]}
        />
      ))}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text style={styles.loadingText}>Cargando estadísticas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="analytics-outline" size={24} color="#f59e0b" />
        <Text style={styles.headerTitle}>Estadísticas Generales</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={stats}
        renderItem={renderStatCard}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={width - 80} // Ancho completo menos padding
        decelerationRate="fast"
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / (width - 80)
          );
          setCurrentIndex(index);
        }}
        contentContainerStyle={styles.carouselContent}
      />

      {renderPagination()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgb(30, 41, 59)",
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#e5e7eb",
    marginLeft: 12,
  },
  carouselContent: {
    paddingHorizontal: 0,
  },
  cardContainer: {
    width: width - 80, // Ancho completo menos padding del contenedor (20 + 20) y padding adicional
    paddingHorizontal: 0,
  },
  statCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 24,
    height: 120,
    justifyContent: "center",
    borderLeftWidth: 4,
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  statContent: {
    flex: 1,
  },
  statTitle: {
    fontSize: 14,
    color: "#9ca3af",
    fontWeight: "500",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#9ca3af",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#f59e0b",
    width: 16,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  loadingText: {
    color: "#9ca3af",
    marginTop: 12,
    fontSize: 14,
  },
});

export default StatsModule;
