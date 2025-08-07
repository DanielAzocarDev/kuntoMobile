import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { getRevenueAnalytics, safeMobileNumber } from "@/api/analytics";

interface MobileRevenueKpisProps {
  style?: any;
}

const MobileRevenueKpis: React.FC<MobileRevenueKpisProps> = ({ style }) => {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["analytics", "revenue", "kpis"],
    queryFn: () => getRevenueAnalytics(),
  });

  if (isLoading || isFetching) {
    return (
      <View style={[styles.container, style]}>
        <View style={[styles.card, styles.skeleton]} />
        <View style={[styles.card, styles.skeleton]} />
        <View style={[styles.card, styles.skeleton]} />
      </View>
    );
  }

  if (error || !data?.data) {
    return (
      <View style={[styles.container, style]}>
        <View style={[styles.card, styles.errorCard]}>
          <View style={styles.cardHeader}>
            <Ionicons name="warning-outline" size={20} color="#ef4444" />
            <Text style={styles.errorTitle}>No se pudo cargar</Text>
          </View>
          <TouchableOpacity onPress={() => refetch()}>
            <Text style={styles.errorRetry}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const revenue = data.data;

  const kpis = [
    {
      icon: "cash-outline" as const,
      title: "Ingresos Totales",
      value: `$${safeMobileNumber(revenue.totalRevenue).toLocaleString()}`,
      subtitle: `${safeMobileNumber(revenue.totalSales)} ventas`,
      color: "#10b981",
    },
    {
      icon: "trending-up-outline" as const,
      title: "Este Mes",
      value: `$${safeMobileNumber(revenue.monthlyRevenue).toLocaleString()}`,
      subtitle: `${safeMobileNumber(revenue.monthlySales)} ventas`,
      color: "#3b82f6",
    },
    {
      icon: "trophy-outline" as const,
      title: "Ganancia",
      value: `$${safeMobileNumber(revenue.totalProfit).toLocaleString()}`,
      subtitle: `${safeMobileNumber(revenue.profitMargin).toFixed(1)}% margen`,
      color: "#f59e0b",
    },
  ];

  return (
    <View style={[styles.container, style]}>
      {kpis.map((kpi) => (
        <View key={kpi.title} style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name={kpi.icon} size={20} color={kpi.color} />
            <Text style={styles.cardTitle}>{kpi.title}</Text>
          </View>
          <Text style={styles.cardValue}>{kpi.value}</Text>
          <Text style={styles.cardSubtitle}>{kpi.subtitle}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    marginVertical: 8,
  },
  card: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3.84,
    elevation: 4,
  },
  skeleton: {
    backgroundColor: "#f3f4f6",
  },
  errorCard: {
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    marginLeft: 6,
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "80%",
  },
  cardValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 11,
    color: "#9ca3af",
  },
  errorTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ef4444",
    marginLeft: 6,
  },
  errorRetry: {
    marginTop: 6,
    color: "#ef4444",
    fontWeight: "600",
  },
});

export default MobileRevenueKpis;
