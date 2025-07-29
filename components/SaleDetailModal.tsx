import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSaleById } from "../api/sales";
import { addPaymentToSale } from "../api/payments";

interface SaleDetailModalProps {
  isVisible: boolean;
  onClose: () => void;
  saleId: string | null;
}

interface ISaleItem {
  productId: string;
  product?: { name: string };
  name?: string;
  quantity: number;
  price: number;
}

interface ISaleDetails {
  saleId: string;
  status: string;
  createdAt: string;
  total: number;
  totalPaid?: number;
  client?: { name: string };
  items: ISaleItem[];
  payments?: Array<{
    amount: number;
    date: string;
    method: string;
  }>;
}

type PaymentMethod = "CARD" | "CASH" | "TRANSFER" | "OTHER";

const SaleDetailModal: React.FC<SaleDetailModalProps> = ({
  isVisible,
  onClose,
  saleId,
}) => {
  const queryClient = useQueryClient();
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const {
    data: saleResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["saleDetails", saleId],
    queryFn: () => getSaleById(saleId as string),
    enabled: isVisible && !!saleId,
  });

  const addPaymentMutation = useMutation({
    mutationFn: addPaymentToSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saleDetails", saleId] });
      setPaymentAmount("");
      setPaymentMethod("CASH");
      setShowPaymentForm(false);
    },
    onError: (error: Error) => {
      console.error("Error adding payment:", error);
    },
  });

  const handlePaymentSubmit = () => {
    const amount = parseFloat(paymentAmount);
    if (saleId && amount > 0) {
      addPaymentMutation.mutate({
        saleId,
        amount,
        method: paymentMethod,
      });
    }
  };

  const handleClose = () => {
    if (addPaymentMutation.isPending) {
      Alert.alert(
        "Operación en progreso",
        "¿Estás seguro de que quieres cancelar? Los datos se perderán.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Salir", style: "destructive", onPress: onClose },
        ]
      );
    } else {
      onClose();
    }
  };

  if (!isVisible) return null;

  const saleDetails = saleResponse?.data as ISaleDetails;
  const amountPending = saleDetails
    ? saleDetails.total - (saleDetails.totalPaid || 0)
    : 0;

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
            <Ionicons name="receipt-outline" size={28} color="#f59e0b" />
            <Text style={styles.headerTitle}>Detalles de la Venta</Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    saleDetails?.status === "PAID"
                      ? "rgba(16, 185, 129, 0.2)"
                      : "rgba(245, 158, 11, 0.2)",
                },
              ]}
            >
              <Ionicons
                name={
                  saleDetails?.status === "PAID" ? "checkmark-circle" : "time"
                }
                size={16}
                color={saleDetails?.status === "PAID" ? "#10b981" : "#f59e0b"}
              />
              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      saleDetails?.status === "PAID" ? "#10b981" : "#f59e0b",
                  },
                ]}
              >
                {saleDetails?.status === "PAID" ? "Pagado" : "Pendiente"}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleClose}
            style={styles.closeButton}
            disabled={addPaymentMutation.isPending}
          >
            <Ionicons name="close" size={24} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#f59e0b" />
              <Text style={styles.loadingText}>Cargando detalles...</Text>
            </View>
          )}

          {isError && error && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={20} color="#ef4444" />
              <Text style={styles.errorText}>
                Error al cargar los detalles: {error.message}
              </Text>
            </View>
          )}

          {saleDetails && !isLoading && !isError && (
            <View style={styles.detailsContainer}>
              {/* Información básica */}
              <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>ID Venta:</Text>
                  <Text style={styles.infoValue}>{saleDetails.saleId}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Fecha:</Text>
                  <Text style={styles.infoValue}>
                    {formatDate(saleDetails.createdAt)}
                  </Text>
                </View>
                {saleDetails.client && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Cliente:</Text>
                    <Text style={styles.infoValue}>
                      {saleDetails.client.name}
                    </Text>
                  </View>
                )}
              </View>

              {/* Montos */}
              <View style={styles.amountsSection}>
                <View style={styles.amountRow}>
                  <Text style={styles.amountLabel}>Total Venta:</Text>
                  <Text style={styles.amountValue}>
                    {formatCurrency(saleDetails.total)}
                  </Text>
                </View>
                <View style={styles.amountRow}>
                  <Text style={styles.amountLabel}>Monto Cancelado:</Text>
                  <Text style={[styles.amountValue, { color: "#10b981" }]}>
                    {formatCurrency(saleDetails.totalPaid || 0)}
                  </Text>
                </View>
                {amountPending > 0 && (
                  <View style={styles.amountRow}>
                    <Text style={styles.amountLabel}>Monto Pendiente:</Text>
                    <Text style={[styles.amountValue, { color: "#f59e0b" }]}>
                      {formatCurrency(amountPending)}
                    </Text>
                  </View>
                )}
              </View>

              {/* Productos */}
              <View style={styles.productsSection}>
                <Text style={styles.sectionTitle}>Productos:</Text>
                {saleDetails.items && saleDetails.items.length > 0 ? (
                  saleDetails.items.map((item, index) => (
                    <View key={index} style={styles.productItem}>
                      <View style={styles.productInfo}>
                        <Text style={styles.productName}>
                          {item.product?.name || item.name}
                        </Text>
                        <Text style={styles.productDetails}>
                          Cantidad: {item.quantity} x{" "}
                          {formatCurrency(item.price)}
                        </Text>
                      </View>
                      <Text style={styles.productTotal}>
                        {formatCurrency(item.price * item.quantity)}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noProductsText}>
                    No hay productos registrados
                  </Text>
                )}
              </View>

              {/* Pagos realizados */}
              {saleDetails.payments && saleDetails.payments.length > 0 && (
                <View style={styles.paymentsSection}>
                  <Text style={styles.sectionTitle}>Pagos Realizados:</Text>
                  {saleDetails.payments.map((payment, index) => (
                    <View key={index} style={styles.paymentItem}>
                      <Text style={styles.paymentDate}>
                        {formatDate(payment.date)}
                      </Text>
                      <Text style={styles.paymentAmount}>
                        {formatCurrency(payment.amount)}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Formulario para agregar pago */}
              {saleDetails.status === "PENDING" && amountPending > 0 && (
                <View style={styles.paymentFormSection}>
                  <TouchableOpacity
                    style={styles.addPaymentButton}
                    onPress={() => setShowPaymentForm(!showPaymentForm)}
                  >
                    <Ionicons name="add-circle" size={20} color="#f59e0b" />
                    <Text style={styles.addPaymentButtonText}>
                      {showPaymentForm ? "Cancelar Pago" : "Agregar Pago"}
                    </Text>
                  </TouchableOpacity>

                  {showPaymentForm && (
                    <View style={styles.paymentForm}>
                      <Text style={styles.formLabel}>Monto del Pago:</Text>
                      <TextInput
                        style={styles.paymentInput}
                        value={paymentAmount}
                        onChangeText={setPaymentAmount}
                        placeholder="0.00"
                        placeholderTextColor="#6b7280"
                        keyboardType="numeric"
                        editable={!addPaymentMutation.isPending}
                      />

                      <Text style={styles.formLabel}>Método de Pago:</Text>
                      <View style={styles.methodButtons}>
                        {(
                          [
                            "CASH",
                            "CARD",
                            "TRANSFER",
                            "OTHER",
                          ] as PaymentMethod[]
                        ).map((method) => (
                          <TouchableOpacity
                            key={method}
                            style={[
                              styles.methodButton,
                              paymentMethod === method &&
                                styles.methodButtonSelected,
                            ]}
                            onPress={() => setPaymentMethod(method)}
                            disabled={addPaymentMutation.isPending}
                          >
                            <Text
                              style={[
                                styles.methodButtonText,
                                paymentMethod === method &&
                                  styles.methodButtonTextSelected,
                              ]}
                            >
                              {method === "CASH"
                                ? "Efectivo"
                                : method === "CARD"
                                ? "Tarjeta"
                                : method === "TRANSFER"
                                ? "Transferencia"
                                : "Otro"}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>

                      <TouchableOpacity
                        style={[
                          styles.submitPaymentButton,
                          addPaymentMutation.isPending &&
                            styles.submitPaymentButtonDisabled,
                        ]}
                        onPress={handlePaymentSubmit}
                        disabled={addPaymentMutation.isPending}
                      >
                        {addPaymentMutation.isPending ? (
                          <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                          <Ionicons
                            name="checkmark-circle"
                            size={20}
                            color="#ffffff"
                          />
                        )}
                        <Text style={styles.submitPaymentButtonText}>
                          {addPaymentMutation.isPending
                            ? "Guardando..."
                            : "Agregar Pago"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            </View>
          )}
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
    marginRight: 12,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  loadingText: {
    color: "#9ca3af",
    marginTop: 12,
    fontSize: 16,
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
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  detailsContainer: {
    marginTop: 20,
  },
  infoSection: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: "#9ca3af",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#e5e7eb",
  },
  amountsSection: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  amountLabel: {
    fontSize: 14,
    color: "#9ca3af",
  },
  amountValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e5e7eb",
  },
  productsSection: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f59e0b",
    marginBottom: 12,
  },
  productItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(156, 163, 175, 0.2)",
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#e5e7eb",
    marginBottom: 2,
  },
  productDetails: {
    fontSize: 12,
    color: "#9ca3af",
  },
  productTotal: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f59e0b",
  },
  noProductsText: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    fontStyle: "italic",
  },
  paymentsSection: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  paymentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(156, 163, 175, 0.2)",
  },
  paymentDate: {
    fontSize: 14,
    color: "#9ca3af",
  },
  paymentAmount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10b981",
  },
  paymentFormSection: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  addPaymentButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.3)",
  },
  addPaymentButtonText: {
    color: "#f59e0b",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  paymentForm: {
    marginTop: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#e5e7eb",
    marginBottom: 8,
  },
  paymentInput: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(156, 163, 175, 0.3)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#e5e7eb",
    marginBottom: 16,
  },
  methodButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  methodButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(156, 163, 175, 0.3)",
  },
  methodButtonSelected: {
    backgroundColor: "#f59e0b",
    borderColor: "#f59e0b",
  },
  methodButtonText: {
    fontSize: 12,
    color: "#9ca3af",
  },
  methodButtonTextSelected: {
    color: "#ffffff",
  },
  submitPaymentButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#f59e0b",
  },
  submitPaymentButtonDisabled: {
    backgroundColor: "rgba(245, 158, 11, 0.5)",
  },
  submitPaymentButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default SaleDetailModal;
