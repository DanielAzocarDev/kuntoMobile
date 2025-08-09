import { useAppStore } from "@/store";
import type { CurrencyMode } from "@/store/slices/auth.slice";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface CurrencyToggleProps {
  onModeChange?: (mode: CurrencyMode) => void;
}

const CurrencyToggle: React.FC<CurrencyToggleProps> = ({ onModeChange }) => {
  const currencyMode = useAppStore((state) => state.currencyMode);
  const setCurrencyMode = useAppStore((state) => state.setCurrencyMode);
  const dollarRate = useAppStore((state) => state.dollarRate);

  const handleToggle = () => {
    const newMode: CurrencyMode = currencyMode === "USD" ? "VES" : "USD";
    setCurrencyMode(newMode);

    // Notificar el cambio de modo si se proporciona el callback
    if (onModeChange) {
      onModeChange(newMode);
    }
  };

  console.log(currencyMode, dollarRate);
  if (!dollarRate) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={handleToggle}
          style={{
            ...styles.button,
            backgroundColor: currencyMode === "USD" ? "#F79900" : "#1D293D",
          }}
        >
          <Text style={{ color: currencyMode === "USD" ? "white" : "#F79900" }}>
            USD
          </Text>
        </Pressable>
        <Pressable
          onPress={handleToggle}
          style={{
            ...styles.button,
            backgroundColor: currencyMode === "VES" ? "#F79900" : "#1D293D",
          }}
        >
          <Text style={{ color: currencyMode === "VES" ? "white" : "#F79900" }}>
            VES
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    alignItems: "center",
    padding: 10,
    backgroundColor: "#1D293D",
    borderRadius: 10,
  },
  button: {
    padding: 10,
    borderRadius: 10,
  },
});

export default CurrencyToggle;
