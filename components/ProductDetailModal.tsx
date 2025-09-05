import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { IProduct } from "../interfaces/product.interfaces";

interface ProductDetailModalProps {
  isVisible: boolean;
  onClose: () => void;
  product: IProduct | null;
}

const { width } = Dimensions.get("window");

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isVisible,
  onClose,
  product,
}) => {
  if (!product) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#e5e7eb" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalle del Producto</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Icono del producto */}
          <View style={styles.iconContainer}>
            <View style={styles.productIcon}>
              <Ionicons name="cube-outline" size={48} color="#f59e0b" />
            </View>
          </View>

          {/* Información del producto */}
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>

            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Precio de Venta</Text>
              <Text style={styles.priceValue}>
                ${product.price.toLocaleString()}
              </Text>
            </View>

            <View style={styles.infoGrid}>
              <View style={styles.infoCard}>
                <Ionicons name="barcode-outline" size={20} color="#9ca3af" />
                <Text style={styles.infoLabel}>SKU</Text>
                <Text style={styles.infoValue}>{product.sku}</Text>
              </View>

              <View style={styles.infoCard}>
                <Ionicons
                  name="trending-up-outline"
                  size={20}
                  color="#9ca3af"
                />
                <Text style={styles.infoLabel}>Stock</Text>
                <Text
                  style={[
                    styles.infoValue,
                    { color: product.quantity > 0 ? "#10b981" : "#ef4444" },
                  ]}
                >
                  {product.quantity} unidades
                </Text>
              </View>

              <View style={styles.infoCard}>
                <Ionicons name="wallet-outline" size={20} color="#9ca3af" />
                <Text style={styles.infoLabel}>Costo</Text>
                <Text style={styles.infoValue}>
                  ${product.cost.toLocaleString()}
                </Text>
              </View>

              <View style={styles.infoCard}>
                <Ionicons name="analytics-outline" size={20} color="#9ca3af" />
                <Text style={styles.infoLabel}>Margen</Text>
                <Text style={styles.infoValue}>
                  {product.cost > 0
                    ? `${(
                        ((product.price - product.cost) / product.cost) *
                        100
                      ).toFixed(1)}%`
                    : "N/A"}
                </Text>
              </View>
            </View>

            {product.description && (
              <View style={styles.descriptionContainer}>
                <View style={styles.descriptionHeader}>
                  <Ionicons
                    name="document-text-outline"
                    size={20}
                    color="#9ca3af"
                  />
                  <Text style={styles.descriptionLabel}>Descripción</Text>
                </View>
                <Text style={styles.descriptionText}>
                  {product.description}
                </Text>
              </View>
            )}
          </View>

          {/* Estado del producto */}
          <View style={styles.statusContainer}>
            <View style={styles.statusItem}>
              <Ionicons
                name={
                  product.quantity > 0 ? "checkmark-circle" : "close-circle"
                }
                size={24}
                color={product.quantity > 0 ? "#10b981" : "#ef4444"}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: product.quantity > 0 ? "#10b981" : "#ef4444" },
                ]}
              >
                {product.quantity > 0 ? "Disponible" : "Sin stock"}
              </Text>
            </View>
          </View>
        </ScrollView>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#1e293b",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(156, 163, 175, 0.2)",
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#e5e7eb",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  iconContainer: {
    alignItems: "center",
    marginVertical: 24,
  },
  productIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(245, 158, 11, 0.3)",
  },
  productInfo: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#e5e7eb",
    marginBottom: 20,
    textAlign: "center",
  },
  priceContainer: {
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 14,
    color: "#9ca3af",
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#f59e0b",
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  infoCard: {
    width: "48%",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 8,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e5e7eb",
    textAlign: "center",
  },
  descriptionContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 12,
    padding: 16,
  },
  descriptionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e5e7eb",
    marginLeft: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: "#e5e7eb",
    lineHeight: 20,
  },
  statusContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
});

export default ProductDetailModal;
