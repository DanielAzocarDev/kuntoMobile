import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { useAppStore } from "@/store";
import { getDollarRate, IDollarRate } from "@/api/dollarRate";
import { useCurrency } from "@/hooks/useCurrency";
import { shallow } from "zustand/shallow";
import CurrencyToggle from "./CurrencyToggle";

const DollarDisplay: React.FC = () => {
  const [dollarRate, setDollarRate] = useState<IDollarRate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setDollarRateStore = useAppStore((state) => state.setDollarRate);

  const fetchDollarRate = async () => {
    setLoading(true);
    setError(null);
    try {
      const rate = await getDollarRate();
      setDollarRate(rate);
      setDollarRateStore(rate.rate);
    } catch {
      setError("Error al cargar");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDollarRate();

    // Actualizar cada 5 minutos
    const interval = setInterval(fetchDollarRate, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const formatRate = (rate: number) => {
    return new Intl.NumberFormat("es-VE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(rate);
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
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Ionicons name="cash-outline" size={24} color="white" />
          <Text style={styles.headerText}>Dólar BCV</Text>
        </View>
        <Pressable onPress={fetchDollarRate}>
          <Ionicons name="refresh" size={24} color="white" />
        </Pressable>
      </View>

      {error ? (
        <Text>{error}</Text>
      ) : loading && !dollarRate ? (
        <Text>Cargando...</Text>
      ) : dollarRate ? (
        <View style={styles.rateContainer}>
          <View>
            <Text style={styles.rateText}>
              Bs. {formatRate(dollarRate.rate)}
            </Text>
            <Text style={styles.rateTime}>
              Actualizado: {formatTime(dollarRate.lastUpdated)}
            </Text>
          </View>
          <CurrencyToggle />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1C8A37",
    padding: 16,
    borderRadius: 10,
    margin: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  rateContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 16,
  },
  rateText: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
  rateTime: {
    color: "white",
    fontSize: 12,
  },
});

export default DollarDisplay;
