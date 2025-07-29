import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addProduct } from "../api/products";
import type { CreateProductPayload } from "../interfaces/product.interfaces";

interface AddProductModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  isVisible,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [cost, setCost] = useState("");
  const [quantity, setQuantity] = useState("");
  const [sku, setSku] = useState("");
  const [error, setError] = useState<string | null>(null);

  const addProductMutation = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      resetForm();
      onClose();
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const resetForm = () => {
    setName("");
    setPrice("");
    setCost("");
    setQuantity("");
    setSku("");
    setError(null);
  };

  const handleSubmit = () => {
    setError(null);

    // Validaciones
    if (!name.trim()) {
      setError("El nombre del producto es obligatorio");
      return;
    }

    if (!sku.trim()) {
      setError("El SKU es obligatorio");
      return;
    }

    const priceValue = parseFloat(price);
    const costValue = parseFloat(cost);
    const quantityValue = parseInt(quantity, 10);

    if (isNaN(priceValue) || priceValue <= 0) {
      setError("El precio debe ser mayor a 0");
      return;
    }

    if (isNaN(costValue) || costValue <= 0) {
      setError("El costo debe ser mayor a 0");
      return;
    }

    if (isNaN(quantityValue) || quantityValue <= 0) {
      setError("La cantidad debe ser mayor a 0");
      return;
    }

    const productData: CreateProductPayload = {
      name: name.trim(),
      price: priceValue,
      cost: costValue,
      quantity: quantityValue,
      sku: sku.trim(),
    };

    addProductMutation.mutate(productData);
  };

  const handleClose = () => {
    if (addProductMutation.isPending) {
      Alert.alert(
        "Operación en progreso",
        "¿Estás seguro de que quieres cancelar? Los datos se perderán.",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Salir",
            style: "destructive",
            onPress: () => {
              resetForm();
              onClose();
            },
          },
        ]
      );
    } else {
      resetForm();
      onClose();
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Ionicons name="cube-outline" size={28} color="#f59e0b" />
            <Text style={styles.headerTitle}>Añadir Nuevo Producto</Text>
          </View>
          <TouchableOpacity
            onPress={handleClose}
            style={styles.closeButton}
            disabled={addProductMutation.isPending}
          >
            <Ionicons name="close" size={24} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {error && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={20} color="#ef4444" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre del Producto</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Ej: Camiseta Premium"
                placeholderTextColor="#6b7280"
                editable={!addProductMutation.isPending}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Precio de Venta</Text>
                <TextInput
                  style={styles.input}
                  value={price}
                  onChangeText={setPrice}
                  placeholder="0.00"
                  placeholderTextColor="#6b7280"
                  keyboardType="numeric"
                  editable={!addProductMutation.isPending}
                />
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Costo del Producto</Text>
                <TextInput
                  style={styles.input}
                  value={cost}
                  onChangeText={setCost}
                  placeholder="0.00"
                  placeholderTextColor="#6b7280"
                  keyboardType="numeric"
                  editable={!addProductMutation.isPending}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Cantidad en Stock</Text>
                <TextInput
                  style={styles.input}
                  value={quantity}
                  onChangeText={setQuantity}
                  placeholder="0"
                  placeholderTextColor="#6b7280"
                  keyboardType="numeric"
                  editable={!addProductMutation.isPending}
                />
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>SKU (Código Único)</Text>
                <TextInput
                  style={styles.input}
                  value={sku}
                  onChangeText={setSku}
                  placeholder="Ej: CAM-001"
                  placeholderTextColor="#6b7280"
                  editable={!addProductMutation.isPending}
                />
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleClose}
            disabled={addProductMutation.isPending}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.submitButton,
              addProductMutation.isPending && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={addProductMutation.isPending}
          >
            {addProductMutation.isPending ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Ionicons name="add-circle" size={20} color="#ffffff" />
            )}
            <Text style={styles.submitButtonText}>
              {addProductMutation.isPending
                ? "Guardando..."
                : "Añadir Producto"}
            </Text>
          </TouchableOpacity>
        </View>
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
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(156, 163, 175, 0.2)",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#e5e7eb",
    marginLeft: 12,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  form: {
    marginTop: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfWidth: {
    width: "48%",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#e5e7eb",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(156, 163, 175, 0.3)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#e5e7eb",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(156, 163, 175, 0.2)",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 120,
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(156, 163, 175, 0.3)",
  },
  cancelButtonText: {
    color: "#9ca3af",
    fontSize: 16,
    fontWeight: "500",
  },
  submitButton: {
    backgroundColor: "#f59e0b",
  },
  submitButtonDisabled: {
    backgroundColor: "rgba(245, 158, 11, 0.5)",
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default AddProductModal;
