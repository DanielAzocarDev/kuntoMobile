import React, { useRef, useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  isLoading = false,
}) => (
  <View style={[styles.statCard, { borderLeftColor: color }]}>
    <View style={styles.statHeader}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon as any} size={32} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={[styles.statValue, { color }]}>
          {isLoading ? "..." : value}
        </Text>
      </View>
    </View>
  </View>
);

interface DashboardStatsProps {
  dailySales?: number;
  totalProducts?: number;
  totalClients?: number;
  totalRevenue?: number;
  isLoading?: boolean;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  dailySales = 0,
  totalProducts = 0,
  totalClients = 0,
  totalRevenue = 0,
  isLoading = false,
}) => {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const stats = [
    {
      title: "Ventas Hoy",
      value: `$${dailySales.toLocaleString()}`,
      icon: "trending-up-outline",
      color: "#10b981",
    },
    {
      title: "Productos en Inventario",
      value: totalProducts.toLocaleString(),
      icon: "cube-outline",
      color: "#3b82f6",
    },
    {
      title: "Clientes Registrados",
      value: totalClients.toLocaleString(),
      icon: "people-outline",
      color: "#f59e0b",
    },
    {
      title: "Ingresos Totales",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: "cash-outline",
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
    }, 4000); // Cambia cada 4 segundos

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="analytics-outline" size={24} color="#f59e0b" />
        <Text style={styles.headerTitle}>Estadísticas del Día</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={stats}
        ItemSeparatorComponent={() => <View style={{ width: 20 }} />}
        renderItem={renderStatCard}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={width - 40} // Ancho completo menos padding
        decelerationRate="fast"
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / (width - 40)
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
    width: width - 100, // Ancho completo menos padding del contenedor
    paddingHorizontal: 0,
    gap: 10,
  },
  statCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 24,
    borderLeftWidth: 6,
    height: 120,
    justifyContent: "center",
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
});

export default DashboardStats;
