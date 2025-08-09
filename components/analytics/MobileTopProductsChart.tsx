import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getTopProductsAnalytics } from "@/api/analytics";
import { useCurrency } from "@/hooks/useCurrency";
import { Ionicons } from "@expo/vector-icons";

const MobileTopProductsChart = () => {
  const { formatCurrency } = useCurrency();
  const { data: topProductsData, isLoading } = useQuery({
    queryKey: ["analytics", "top-products-mobile"],
    queryFn: () => getTopProductsAnalytics(5),
  });

  if (isLoading) {
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator color="#f59e0b" />
        <Text style={styles.loadingText}>Cargando Top Productos...</Text>
      </View>
    );
  }

  if (!topProductsData || topProductsData.data.length === 0) {
    return (
      <View style={styles.emptyBox}>
        <Ionicons name="cart-outline" size={32} color="#4b5563" />
        <Text style={styles.emptyTitle}>Sin Datos de Productos</Text>
        <Text style={styles.emptyDesc}>
          Cuando vendas productos, aparecerán aquí.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      {topProductsData.data.map((product, index) => (
        <View key={product.productId} style={styles.productCard}>
          <View style={styles.productInfo}>
            <Text style={styles.productRank}>#{index + 1}</Text>
            <Text style={styles.productName} numberOfLines={1}>
              {product.productName}
            </Text>
          </View>
          <View style={styles.productMetrics}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Vendidos</Text>
              <Text style={styles.metricValue}>{product.quantitySold}</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Ingresos</Text>
              <Text style={styles.metricValue}>
                {formatCurrency(product.totalRevenue)}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  loadingBox: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderRadius: 16,
    flexDirection: "row",
    gap: 10,
  },
  loadingText: {
    color: "#9ca3af",
  },
  emptyBox: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderRadius: 16,
  },
  emptyTitle: {
    color: "#e5e7eb",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  emptyDesc: {
    color: "#9ca3af",
    marginTop: 4,
  },
  productCard: {
    backgroundColor: "#1e293b",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#f59e0b",
  },
  productInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  productRank: {
    color: "#f59e0b",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 10,
  },
  productName: {
    color: "#e5e7eb",
    fontWeight: "600",
    fontSize: 16,
    flex: 1,
  },
  productMetrics: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#334155",
    paddingTop: 8,
  },
  metricItem: {
    alignItems: "center",
  },
  metricLabel: {
    color: "#9ca3af",
    fontSize: 12,
  },
  metricValue: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default MobileTopProductsChart;
