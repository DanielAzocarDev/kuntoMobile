import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { useQuery } from "@tanstack/react-query";
import {
  getDailyAnalytics,
  getWeeklyAnalytics,
  getMonthlyAnalytics,
  DailyAnalytics,
  WeeklyAnalytics,
  MonthlyAnalytics,
  safeMobileNumber,
} from "@/api/analytics";
import PeriodSelector, {
  PeriodType,
} from "@/components/analytics/PeriodSelector";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

interface MobileSalesChartProps {
  style?: any;
  height?: number;
}

const MobileSalesChart: React.FC<MobileSalesChartProps> = ({
  style,
  height = 220,
}) => {
  const [period, setPeriod] = useState<PeriodType>("daily");

  const daily = useQuery({
    queryKey: ["analytics", "daily", 7],
    queryFn: () => getDailyAnalytics(7),
    enabled: period === "daily",
  });

  const weekly = useQuery({
    queryKey: ["analytics", "weekly", 4],
    queryFn: () => getWeeklyAnalytics(4),
    enabled: period === "weekly",
  });

  const monthly = useQuery({
    queryKey: ["analytics", "monthly", 6],
    queryFn: () => getMonthlyAnalytics(6),
    enabled: period === "monthly",
  });

  const { dataPoints, labels, isLoading } = useMemo(() => {
    if (period === "daily") {
      const list = (daily.data?.data || []) as DailyAnalytics[];
      const sliced = list.slice(-7);
      const labels = sliced.map((d) =>
        new Date(d.date)
          .toLocaleDateString("es-ES", { day: "2-digit", month: "short" })
          .replace(" ", "\n")
      );
      const points = sliced.map((d, idx) => ({
        x: idx + 1,
        y: safeMobileNumber(d.totalAmount),
      }));
      return {
        dataPoints: points,
        labels,
        isLoading: daily.isLoading || daily.isFetching,
      };
    }
    if (period === "weekly") {
      const list = (weekly.data?.data || []) as WeeklyAnalytics[];
      const sliced = list.slice(-4);
      const labels = sliced.map((_, i) => `S${i + 1}`);
      const points = sliced.map((d, idx) => ({
        x: idx + 1,
        y: safeMobileNumber(d.totalAmount),
      }));
      return {
        dataPoints: points,
        labels,
        isLoading: weekly.isLoading || weekly.isFetching,
      };
    }
    const list = (monthly.data?.data || []) as MonthlyAnalytics[];
    const sliced = list.slice(-6);
    const labels = sliced.map((d) =>
      new Date(`${d.month}-01`).toLocaleDateString("es-ES", { month: "short" })
    );
    const points = sliced.map((d, idx) => ({
      x: idx + 1,
      y: safeMobileNumber(d.totalAmount),
    }));
    return {
      dataPoints: points,
      labels,
      isLoading: monthly.isLoading || monthly.isFetching,
    };
  }, [
    period,
    daily.data,
    daily.isLoading,
    daily.isFetching,
    weekly.data,
    weekly.isLoading,
    weekly.isFetching,
    monthly.data,
    monthly.isLoading,
    monthly.isFetching,
  ]);

  const hasData =
    dataPoints && dataPoints.length > 0 && dataPoints.some((p) => p.y > 0);
  const maxY = useMemo(() => {
    const max =
      dataPoints && dataPoints.length
        ? Math.max(...dataPoints.map((p) => p.y))
        : 0;
    return max || 1;
  }, [dataPoints]);

  const chartData = {
    labels,
    datasets: [
      {
        data: dataPoints.map((p) => p.y),
        color: (opacity = 1) => `rgba(245, 158, 11, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: "rgb(30, 41, 59)",
    backgroundGradientFrom: "rgb(30, 41, 59)",
    backgroundGradientTo: "rgb(30, 41, 59)",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(245, 158, 11, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#f59e0b",
    },
    propsForBackgroundLines: {
      strokeDasharray: "",
      stroke: "#e5e7eb",
      strokeWidth: 1,
    },
  };

  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Ventas</Text>
      </View>

      <PeriodSelector
        selectedPeriod={period}
        onPeriodChange={setPeriod}
        style={styles.selector}
      />

      <View style={styles.chartCard}>
        {isLoading ? (
          <View style={styles.loadingBox}>
            <Text style={styles.loadingText}>Cargando gráfico...</Text>
          </View>
        ) : !hasData ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>Sin datos</Text>
            <Text style={styles.emptyDesc}>
              Realiza ventas para ver la tendencia
            </Text>
          </View>
        ) : (
          <LineChart
            data={chartData}
            width={screenWidth - 100}
            height={height}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withDots={true}
            withInnerLines={true}
            withOuterLines={false}
            withVerticalLines={false}
            withHorizontalLines={true}
            fromZero={true}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#e5e7eb",
  },
  selector: {
    marginBottom: 8,
  },
  chartCard: {
    backgroundColor: "rgb(30, 41, 59)",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3.84,
    elevation: 4,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  loadingBox: {
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(30, 41, 59)",
    borderRadius: 8,
  },
  loadingText: {
    color: "#6b7280",
  },
  emptyBox: {
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(30, 41, 59)",
    borderRadius: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6b7280",
  },
  emptyDesc: {
    color: "#9ca3af",
    marginTop: 4,
  },
});

export default MobileSalesChart;
