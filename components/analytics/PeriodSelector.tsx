import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type PeriodType = "daily" | "weekly" | "monthly";

interface PeriodOption {
  type: PeriodType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  description?: string;
}

interface PeriodSelectorProps {
  selectedPeriod: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
  style?: any;
}

const PERIODS: PeriodOption[] = [
  {
    type: "daily",
    label: "Diario",
    icon: "calendar-outline",
    description: "7 días",
  },
  {
    type: "weekly",
    label: "Semanal",
    icon: "stats-chart-outline",
    description: "4 semanas",
  },
  {
    type: "monthly",
    label: "Mensual",
    icon: "bar-chart-outline",
    description: "6 meses",
  },
];

const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  selectedPeriod,
  onPeriodChange,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {PERIODS.map((opt) => {
        const isSelected = opt.type === selectedPeriod;
        return (
          <TouchableOpacity
            key={opt.type}
            style={[styles.option, isSelected && styles.optionSelected]}
            onPress={() => onPeriodChange(opt.type)}
            activeOpacity={0.8}
          >
            <View style={styles.rowCenter}>
              <Ionicons
                name={opt.icon}
                size={18}
                color={isSelected ? "#f59e0b" : "#6b7280"}
              />
              <Text style={[styles.label, isSelected && styles.labelSelected]}>
                {opt.label}
              </Text>
            </View>
            {opt.description ? (
              <Text style={[styles.desc, isSelected && styles.descSelected]}>
                {opt.description}
              </Text>
            ) : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "rgb(30, 41, 59)",
    borderRadius: 12,
    padding: 4,
  },
  option: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  optionSelected: {
    backgroundColor: "#0f172a",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  labelSelected: {
    color: "#f59e0b",
  },
  desc: {
    fontSize: 11,
    color: "#9ca3af",
  },
  descSelected: {
    color: "#d97706",
  },
});

export default PeriodSelector;
