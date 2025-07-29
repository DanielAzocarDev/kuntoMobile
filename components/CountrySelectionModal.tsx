import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ICountry {
  name: string;
  currency: string;
  currencySymbol: string;
}

interface CountrySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCountrySelected: (country: ICountry) => void;
  isLoading?: boolean;
}

const countries: ICountry[] = [
  { name: "Estados Unidos", currency: "USD", currencySymbol: "$" },
  { name: "México", currency: "MXN", currencySymbol: "$" },
  { name: "España", currency: "EUR", currencySymbol: "€" },
  { name: "Argentina", currency: "ARS", currencySymbol: "$" },
  { name: "Colombia", currency: "COP", currencySymbol: "$" },
  { name: "Chile", currency: "CLP", currencySymbol: "$" },
  { name: "Perú", currency: "PEN", currencySymbol: "S/" },
  { name: "Brasil", currency: "BRL", currencySymbol: "R$" },
];

const CountrySelectionModal: React.FC<CountrySelectionModalProps> = ({
  isOpen,
  onClose,
  onCountrySelected,
  isLoading = false,
}) => {
  const renderCountryItem = ({ item }: { item: ICountry }) => (
    <TouchableOpacity
      style={styles.countryItem}
      onPress={() => onCountrySelected(item)}
      disabled={isLoading}
    >
      <View style={styles.countryInfo}>
        <Text style={styles.countryName}>{item.name}</Text>
        <Text style={styles.countryCurrency}>
          {item.currency} ({item.currencySymbol})
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#f59e0b" />
          </TouchableOpacity>
          <Text style={styles.title}>Selecciona tu País</Text>
          <View style={styles.placeholder} />
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#f59e0b" />
            <Text style={styles.loadingText}>
              Actualizando configuración...
            </Text>
          </View>
        ) : (
          <FlatList
            data={countries}
            renderItem={renderCountryItem}
            keyExtractor={(item) => item.name}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(156, 163, 175, 0.2)",
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#e5e7eb",
  },
  placeholder: {
    width: 40,
  },
  listContainer: {
    padding: 20,
  },
  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgb(30, 41, 59)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e5e7eb",
    marginBottom: 4,
  },
  countryCurrency: {
    fontSize: 14,
    color: "#9ca3af",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#9ca3af",
    marginTop: 16,
    fontSize: 16,
  },
});

export default CountrySelectionModal;
