import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { getOpenAccountById } from "../api/openAccounts";
import type { IOpenAccount } from "../api/openAccounts";
import { useCurrency } from "@/hooks/useCurrency";

interface OpenAccountDetailModalProps {
  isVisible: boolean;
  onClose: () => void;
  accountId: string | null;
}

const OpenAccountDetailModal: React.FC<OpenAccountDetailModalProps> = ({
  isVisible,
  onClose,
  accountId,
}) => {
  const { formatCurrency } = useCurrency();

  const {
    data: accountResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["openAccountDetails", accountId],
    queryFn: () => getOpenAccountById(accountId as string),
    enabled: isVisible && !!accountId,
  });

  if (!isVisible) return null;

  const accountDetails = accountResponse?.data as IOpenAccount;

  // const formatCurrency = (amount: number) => {
  //   return `$${amount.toLocaleString()}`;
  // };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateTotalSales = () => {
    if (!accountDetails?.sales) return 0;
    return accountDetails.sales.reduce((total, sale) => total + sale.total, 0);
  };

  const calculateTotalPaid = () => {
    if (!accountDetails?.sales) return 0;
    return accountDetails.sales.reduce((total, sale) => {
      const salePayments =
        sale.Payment?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
      return total + salePayments;
    }, 0);
  };

  const totalSales = calculateTotalSales();
  const totalPaid = calculateTotalPaid();
  const totalPending = totalSales - totalPaid;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Ionicons name="wallet-outline" size={28} color="#f59e0b" />
            <Text style={styles.headerTitle}>Detalles de Cuenta Abierta</Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    accountDetails?.status === "CLOSED"
                      ? "rgba(16, 185, 129, 0.2)"
                      : "rgba(245, 158, 11, 0.2)",
                },
              ]}
            >
              <Ionicons
                name={
                  accountDetails?.status === "CLOSED"
                    ? "checkmark-circle"
                    : "time"
                }
                size={16}
                color={
                  accountDetails?.status === "CLOSED" ? "#10b981" : "#f59e0b"
                }
              />
              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      accountDetails?.status === "CLOSED"
                        ? "#10b981"
                        : "#f59e0b",
                  },
                ]}
              >
                {accountDetails?.status === "CLOSED" ? "Cerrada" : "Abierta"}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
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

          {accountDetails && !isLoading && !isError && (
            <View style={styles.detailsContainer}>
              {/* Información del cliente */}
              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Información del Cliente</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Cliente:</Text>
                  <Text style={styles.infoValue}>
                    {accountDetails.client?.name}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Fecha de Creación:</Text>
                  <Text style={styles.infoValue}>
                    {formatDate(accountDetails.createdAt)}
                  </Text>
                </View>
              </View>

              {/* Resumen de montos */}
              <View style={styles.amountsSection}>
                <Text style={styles.sectionTitle}>Resumen de Montos</Text>
                <View style={styles.amountRow}>
                  <Text style={styles.amountLabel}>Total Ventas:</Text>
                  <Text style={styles.amountValue}>
                    {formatCurrency(totalSales)}
                  </Text>
                </View>
                <View style={styles.amountRow}>
                  <Text style={styles.amountLabel}>Total Pagado:</Text>
                  <Text style={[styles.amountValue, { color: "#10b981" }]}>
                    {formatCurrency(totalPaid)}
                  </Text>
                </View>
                <View style={styles.amountRow}>
                  <Text style={styles.amountLabel}>Total Pendiente:</Text>
                  <Text style={[styles.amountValue, { color: "#f59e0b" }]}>
                    {formatCurrency(totalPending)}
                  </Text>
                </View>
              </View>

              {/* Lista de ventas */}
              {accountDetails.sales && accountDetails.sales.length > 0 && (
                <View style={styles.salesSection}>
                  <Text style={styles.sectionTitle}>Ventas en esta Cuenta</Text>
                  {accountDetails.sales.map((sale, index) => {
                    const salePayments =
                      sale.Payment?.reduce(
                        (sum, payment) => sum + payment.amount,
                        0
                      ) || 0;
                    const salePending = sale.total - salePayments;

                    return (
                      <View key={sale.id} style={styles.saleItem}>
                        <View style={styles.saleHeader}>
                          <Text style={styles.saleId}>
                            Venta #{sale.id.slice(-8)}
                          </Text>
                          <View
                            style={[
                              styles.saleStatusBadge,
                              {
                                backgroundColor:
                                  sale.status === "PAID"
                                    ? "rgba(16, 185, 129, 0.2)"
                                    : "rgba(245, 158, 11, 0.2)",
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.saleStatusText,
                                {
                                  color:
                                    sale.status === "PAID"
                                      ? "#10b981"
                                      : "#f59e0b",
                                },
                              ]}
                            >
                              {sale.status === "PAID" ? "Pagado" : "Pendiente"}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.saleDetails}>
                          <Text style={styles.saleDate}>
                            {formatDate(sale.createdAt)}
                          </Text>
                          <View style={styles.saleAmounts}>
                            <Text style={styles.saleTotal}>
                              Total: {formatCurrency(sale.total)}
                            </Text>
                            <Text
                              style={[styles.salePaid, { color: "#10b981" }]}
                            >
                              Pagado: {formatCurrency(salePayments)}
                            </Text>
                            {salePending > 0 && (
                              <Text
                                style={[
                                  styles.salePending,
                                  { color: "#f59e0b" },
                                ]}
                              >
                                Pendiente: {formatCurrency(salePending)}
                              </Text>
                            )}
                          </View>
                        </View>

                        {/* Productos de la venta */}
                        {sale.items && sale.items.length > 0 && (
                          <View style={styles.saleProducts}>
                            <Text style={styles.productsTitle}>Productos:</Text>
                            {sale.items.map((item, itemIndex) => (
                              <View key={itemIndex} style={styles.productItem}>
                                <Text style={styles.productName}>
                                  {item.product?.name || item.name}
                                </Text>
                                <Text style={styles.productDetails}>
                                  {item.quantity} x {formatCurrency(item.price)}
                                </Text>
                                <Text style={styles.productTotal}>
                                  {formatCurrency(item.price * item.quantity)}
                                </Text>
                              </View>
                            ))}
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              )}

              {(!accountDetails.sales || accountDetails.sales.length === 0) && (
                <View style={styles.emptySection}>
                  <Ionicons name="receipt-outline" size={48} color="#9ca3af" />
                  <Text style={styles.emptyText}>
                    No hay ventas en esta cuenta
                  </Text>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f59e0b",
    marginBottom: 12,
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
  salesSection: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  saleItem: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  saleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  saleId: {
    fontSize: 14,
    fontWeight: "600",
    color: "#e5e7eb",
  },
  saleStatusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  saleStatusText: {
    fontSize: 10,
    fontWeight: "600",
  },
  saleDetails: {
    marginBottom: 8,
  },
  saleDate: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 4,
  },
  saleAmounts: {
    gap: 2,
  },
  saleTotal: {
    fontSize: 12,
    color: "#e5e7eb",
  },
  salePaid: {
    fontSize: 12,
  },
  salePending: {
    fontSize: 12,
  },
  saleProducts: {
    borderTopWidth: 1,
    borderTopColor: "rgba(156, 163, 175, 0.2)",
    paddingTop: 8,
  },
  productsTitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#f59e0b",
    marginBottom: 4,
  },
  productItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 2,
  },
  productName: {
    fontSize: 11,
    color: "#e5e7eb",
    flex: 1,
  },
  productDetails: {
    fontSize: 11,
    color: "#9ca3af",
    marginHorizontal: 8,
  },
  productTotal: {
    fontSize: 11,
    fontWeight: "500",
    color: "#f59e0b",
  },
  emptySection: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 12,
    textAlign: "center",
  },
});

export default OpenAccountDetailModal;
