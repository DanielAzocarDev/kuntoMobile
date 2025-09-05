import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MobileSalesChart from "@/components/analytics/MobileSalesChart";
import MobileTopProductsChart from "@/components/analytics/MobileTopProductsChart";
import MobileClientsChart from "@/components/analytics/MobileClientsChart";

type AnalyticsTab = "sales" | "top-products" | "clients";

const tabDescriptions: Record<AnalyticsTab, string> = {
  sales:
    "Esta gráfica muestra la tendencia de tus ingresos por ventas a lo largo del tiempo. Puedes cambiar el período para analizar los datos por día, semana o mes.",
  "top-products":
    "Aquí se listan tus 5 productos más vendidos, ordenados por la cantidad de unidades vendidas. Es ideal para identificar tus productos estrella.",
  clients:
    "Esta gráfica muestra la proporción de clientes activos frente a los inactivos, ayudándote a entender la retención y la salud de tu base de clientes.",
};

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>("sales");

  const AnalyticsTabs = () => (
    <View style={styles.tabsContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === "sales" && styles.activeTab]}
        onPress={() => setActiveTab("sales")}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "sales" && styles.activeTabText,
          ]}
        >
          Ventas
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === "top-products" && styles.activeTab]}
        onPress={() => setActiveTab("top-products")}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "top-products" && styles.activeTabText,
          ]}
        >
          Productos
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === "clients" && styles.activeTab]}
        onPress={() => setActiveTab("clients")}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "clients" && styles.activeTabText,
          ]}
        >
          Clientes
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient
      colors={["#0f172a", "#1e293b", "#334155"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Estadísticas Detalladas</Text>
          <AnalyticsTabs />
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>
              {tabDescriptions[activeTab]}
            </Text>
          </View>
          <View style={styles.chartContainer}>
            {activeTab === "sales" && <MobileSalesChart />}
            {activeTab === "top-products" && <MobileTopProductsChart />}
            {activeTab === "clients" && <MobileClientsChart />}
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#e5e7eb",
    marginBottom: 20,
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
  chartContainer: {
    marginTop: 20,
  },
  descriptionContainer: {
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderRadius: 8,
    padding: 12,
    marginTop: 15,
  },
  descriptionText: {
    color: "#d1d5db",
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
  },
});
