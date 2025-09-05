import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getClientAnalytics } from "@/api/analytics";
import { useCurrency } from "@/hooks/useCurrency";
import { Ionicons } from "@expo/vector-icons";

const MobileClientsChart = () => {
  const { formatCurrency } = useCurrency();
  const { data: clientData, isLoading } = useQuery({
    queryKey: ["analytics", "clients-mobile"],
    queryFn: () => getClientAnalytics(),
  });

  if (isLoading) {
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator color="#f59e0b" />
        <Text style={styles.loadingText}>Cargando Métricas de Clientes...</Text>
      </View>
    );
  }

  if (!clientData || !clientData.data || clientData.data.totalClients === 0) {
    return (
      <View style={styles.emptyBox}>
        <Ionicons name="people-outline" size={32} color="#4b5563" />
        <Text style={styles.emptyTitle}>Sin Datos de Clientes</Text>
        <Text style={styles.emptyDesc}>
          Cuando registres clientes, aparecerán aquí.
        </Text>
      </View>
    );
  }

  const {
    totalClients,
    newClientsThisMonth,
    clientRetentionRate,
    averageOrderValue,
    topClients,
  } = clientData.data;

  const metrics = [
    { label: "Clientes Totales", value: totalClients },
    { label: "Nuevos (Mes)", value: newClientsThisMonth },
    { label: "Retención", value: `${clientRetentionRate.toFixed(1)}%` },
    { label: "Valor Promedio", value: formatCurrency(averageOrderValue) },
  ];

  return (
    <View style={styles.wrapper}>
      <View style={styles.metricsGrid}>
        {metrics.map((metric, index) => (
          <View key={index} style={styles.metricCard}>
            <Text style={styles.metricLabel}>{metric.label}</Text>
            <Text style={styles.metricValue}>{metric.value}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.listTitle}>Top 5 Clientes por Ingresos</Text>
      <View>
        {topClients.slice(0, 5).map((client, index) => (
          <View key={client.id} style={styles.clientCard}>
            <View style={styles.clientInfo}>
              <Text style={styles.clientRank}>#{index + 1}</Text>
              <Text style={styles.clientName} numberOfLines={1}>
                {client.name}
              </Text>
            </View>
            <View style={styles.clientMetrics}>
              <Text style={styles.clientRevenue}>
                {formatCurrency(client.totalRevenue)}
              </Text>
              <Text style={styles.clientOrders}>
                ({client.totalOrders} pedidos)
              </Text>
            </View>
          </View>
        ))}
      </View>
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
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  metricCard: {
    backgroundColor: "#1e293b",
    borderRadius: 8,
    padding: 10,
    width: "48%",
    marginBottom: 10,
    alignItems: "center",
  },
  metricLabel: {
    color: "#9ca3af",
    fontSize: 12,
    marginBottom: 4,
  },
  metricValue: {
    color: "#f59e0b",
    fontSize: 18,
    fontWeight: "bold",
  },
  listTitle: {
    color: "#e5e7eb",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  clientCard: {
    backgroundColor: "#1e293b",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  clientInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  clientRank: {
    color: "#9ca3af",
    fontWeight: "bold",
    fontSize: 14,
    marginRight: 10,
  },
  clientName: {
    color: "#e5e7eb",
    fontWeight: "600",
    fontSize: 14,
    flex: 1,
  },
  clientMetrics: {
    alignItems: "flex-end",
  },
  clientRevenue: {
    color: "#34d399",
    fontSize: 14,
    fontWeight: "bold",
  },
  clientOrders: {
    color: "#9ca3af",
    fontSize: 12,
  },
});

export default MobileClientsChart;
