import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import {
  getDailyAnalytics,
  getWeeklyAnalytics,
  getMonthlyAnalytics,
  DailyAnalytics,
  WeeklyAnalytics,
  MonthlyAnalytics,
} from "@/api/analytics";
import PeriodSelector, {
  PeriodType,
} from "@/components/analytics/PeriodSelector";
import { useCurrency } from "@/hooks/useCurrency";
import { Ionicons } from "@expo/vector-icons";

const MobileSalesChart: React.FC = () => {
  const [period, setPeriod] = useState<PeriodType>("daily");
  const { formatCurrency } = useCurrency();

  const queryFnMap = {
    daily: () => getDailyAnalytics(30),
    weekly: () => getWeeklyAnalytics(12),
    monthly: () => getMonthlyAnalytics(12),
  };

  const { data, isLoading } = useQuery({
    queryKey: ["analytics", period],
    queryFn: queryFnMap[period],
  });

  const { listData, summaryMetrics } = useMemo(() => {
    const analyticsData = data?.data || [];
    if (!analyticsData.length) {
      return { listData: [], summaryMetrics: {} };
    }

    let listData: any[] = [];
    let totalRevenue = 0;
    let totalSalesCount = 0;
    let totalPaid = 0;

    switch (period) {
      case "daily":
        listData = analyticsData as DailyAnalytics[];
        analyticsData.forEach((d: DailyAnalytics) => {
          totalRevenue += d.totalAmount;
          totalSalesCount += d.totalSales;
          totalPaid += d.paidAmount;
        });
        break;
      case "weekly":
      case "monthly":
        listData = analyticsData as WeeklyAnalytics[] | MonthlyAnalytics[];
        analyticsData.forEach((d: WeeklyAnalytics | MonthlyAnalytics) => {
          totalRevenue += d.totalAmount;
          totalSalesCount += d.totalSales;
          totalPaid += d.paidAmount;
        });
        break;
    }

    const summaryMetrics = {
      totalRevenue,
      totalSalesCount,
      averageOrderValue:
        totalSalesCount > 0 ? totalRevenue / totalSalesCount : 0,
      totalPaid,
    };

    return { listData, summaryMetrics };
  }, [data, period]);

  const MetricCard = ({
    label,
    value,
  }: {
    label: string;
    value: string | number;
  }) => (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );

  const renderItem = ({ item }: { item: any }) => {
    const isDaily = period === "daily";
    const title = isDaily
      ? new Date(item.date).toLocaleDateString("es-ES", {
          weekday: "long",
          day: "numeric",
          month: "short",
        })
      : period === "weekly"
      ? `Semana del ${new Date(item.weekStart).toLocaleDateString("es-ES", {
          day: "numeric",
          month: "short",
        })}`
      : `Mes de ${new Date(`${item.month}-02`).toLocaleDateString("es-ES", {
          month: "long",
        })}`;

    return (
      <View style={styles.listItem}>
        <Text style={styles.itemTitle}>{title}</Text>
        <View style={styles.itemMetrics}>
          <Text style={styles.itemMetric}>
            Ingresos: {formatCurrency(item.totalAmount)}
          </Text>
          <Text style={styles.itemMetric}>Ventas: {item.totalSales}</Text>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator color="#f59e0b" />
        <Text style={styles.loadingText}>Cargando datos de ventas...</Text>
      </View>
    );
  }

  if (!data || !data.data || data.data.length === 0) {
    return (
      <View style={styles.emptyBox}>
        <Ionicons name="trending-up-outline" size={32} color="#4b5563" />
        <Text style={styles.emptyTitle}>Sin Datos de Ventas</Text>
        <Text style={styles.emptyDesc}>
          Cuando realices ventas, tus estadísticas aparecerán aquí.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <PeriodSelector selectedPeriod={period} onPeriodChange={setPeriod} />

      <View style={styles.metricsGrid}>
        <MetricCard
          label="Ingresos Totales"
          value={formatCurrency(summaryMetrics.totalRevenue || 0)}
        />
        <MetricCard
          label="Nº de Ventas"
          value={summaryMetrics.totalSalesCount || 0}
        />
        <MetricCard
          label="Venta Promedio"
          value={formatCurrency(summaryMetrics.averageOrderValue || 0)}
        />
        <MetricCard
          label="Total Pagado"
          value={formatCurrency(summaryMetrics.totalPaid || 0)}
        />
      </View>

      <FlatList
        data={listData}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${period}-${index}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  loadingBox: {
    height: 320,
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
    height: 320,
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
    marginVertical: 15,
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
    fontSize: 16,
    fontWeight: "bold",
  },
  listItem: {
    backgroundColor: "#1e293b",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  itemTitle: {
    color: "#e5e7eb",
    fontWeight: "600",
    marginBottom: 8,
  },
  itemMetrics: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemMetric: {
    color: "#9ca3af",
    fontSize: 12,
  },
});

export default MobileSalesChart;
