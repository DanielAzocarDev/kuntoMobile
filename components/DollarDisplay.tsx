import React, { useEffect } from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { useAppStore } from "@/store";
import { getDollarRate } from "@/api/dollarRate";
import { useCurrency } from "@/hooks/useCurrency";
import { shallow } from "zustand/shallow";

const DollarDisplay: React.FC = () => {
  // const { currencyMode, setCurrencyMode, setDollarRate } = useAppStore(
  //   (state) => ({
  //     currencyMode: state.currencyMode,
  //     setCurrencyMode: state.setCurrencyMode,
  //     setDollarRate: state.setDollarRate,
  //   }),
  //   shallow
  // );

  const currencyMode = useAppStore((state) => state.currencyMode);
  const setCurrencyMode = useAppStore((state) => state.setCurrencyMode);
  const setDollarRate = useAppStore((state) => state.setDollarRate);

  const { formatCurrency, dollarRate } = useCurrency();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["dollarRate"],
    queryFn: getDollarRate,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (data) {
      setDollarRate(data.rate);
    }
  }, [data, setDollarRate]);

  const toggleCurrencyMode = () => {
    setCurrencyMode(currencyMode === "USD" ? "LOCAL" : "USD");
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-VE", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.rateSection}>
        <View>
          <Text style={styles.title}>Tasa del Dólar (BCV)</Text>
          {isLoading && !dollarRate ? (
            <ActivityIndicator color="#f59e0b" style={{ marginTop: 8 }} />
          ) : error ? (
            <Text style={styles.errorText}>Error al cargar</Text>
          ) : dollarRate ? (
            <>
              <Text style={styles.rateText}>
                {formatCurrency(dollarRate, "LOCAL")}
              </Text>
              <Text style={styles.timeText}>
                Actualizado: {data ? formatTime(data.lastUpdated) : "..."}
              </Text>
            </>
          ) : null}
        </View>
        <TouchableOpacity onPress={() => refetch()} disabled={isLoading}>
          <Ionicons
            name={isLoading ? "refresh" : "refresh-outline"}
            size={24}
            color="#9ca3af"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.toggleSection}>
        <Text style={styles.toggleLabel}>
          Mostrar precios en {currencyMode === "USD" ? "Bs." : "USD"}
        </Text>
        <Switch
          trackColor={{ false: "#3e3e3e", true: "#34d399" }}
          thumbColor={currencyMode === "LOCAL" ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleCurrencyMode}
          value={currencyMode === "LOCAL"}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#334155",
  },
  rateSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 16,
  },
  title: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.8,
  },
  rateText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 4,
  },
  timeText: {
    color: "#9ca3af",
    fontSize: 12,
    marginTop: 2,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 8,
  },
  toggleSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    borderBottomLeftRadius: 11,
    borderBottomRightRadius: 11,
    borderTopWidth: 1,
    borderTopColor: "#334155",
  },
  toggleLabel: {
    color: "white",
    fontSize: 15,
    fontWeight: "500",
  },
});

export default DollarDisplay;
