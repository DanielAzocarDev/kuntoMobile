import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Share,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { getOpenAccounts } from "../../api/openAccounts";
import type { IOpenAccount } from "../../api/openAccounts";
import OpenAccountDetailModal from "../../components/OpenAccountDetailModal";
import { useCurrency } from "@/hooks/useCurrency";

const OpenAccountsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null
  );
  const { formatCurrency } = useCurrency();

  const {
    data: openAccountsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["openAccounts", currentPage],
    queryFn: () => getOpenAccounts(currentPage, 20),
    gcTime: 0,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewAccountDetail = (accountId: string) => {
    setSelectedAccountId(accountId);
    setIsDetailModalVisible(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalVisible(false);
    setSelectedAccountId(null);
  };

  const handleShareSummary = async (account: IOpenAccount) => {
    try {
      const totalSales =
        account.sales?.reduce((sum, sale) => sum + sale.total, 0) || 0;
      const totalPaid = account.totalPaidOnThisAccount || 0;
      const pendingBalance = totalSales - totalPaid;

      let summaryText = `Resumen de Cuenta para: ${account.client?.name || "Cliente Desconocido"}\n`;
      summaryText += `-----------------------------------\n`;
      summaryText += `Fecha de Apertura: ${new Date(
        account.createdAt
      ).toLocaleDateString("es-ES")}\n`;
      summaryText += `\n--- VENTAS ---\n`;

      account.sales?.forEach((sale) => {
        summaryText += `\n* Venta del ${new Date(
          sale.createdAt
        ).toLocaleDateString(
          "es-ES"
        )} - Total: ${formatCurrency(sale.total)}\n`;

        sale.items?.forEach((p) => {
          summaryText += `  - ${p.quantity} x ${p.product?.name || "Producto Desconocido"} (${formatCurrency(
            p.price
          )})\n`;
        });

        if (sale.Payment && sale.Payment.length > 0) {
          summaryText += `\n  --- Pagos Registrados en esta Venta ---\n`;
          sale.Payment.forEach((payment) => {
            summaryText += `    - ${formatCurrency(payment.amount)} el ${new Date(
              payment.createdAt
            ).toLocaleDateString("es-ES")}\n`;
          });
        }
      });

      summaryText += `\n-----------------------------------\n`;
      summaryText += `TOTAL VENTAS: ${formatCurrency(totalSales)}\n`;
      summaryText += `TOTAL PAGADO: ${formatCurrency(totalPaid)}\n`;
      summaryText += `SALDO PENDIENTE: ${formatCurrency(pendingBalance)}\n`;

      await Share.share({
        message: summaryText,
        title: `Resumen de Cuenta de ${account.client?.name}`,
      });
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al intentar compartir el resumen.");
    }
  };

  // const formatCurrency = (amount: number) => {
  //   return `$${amount.toLocaleString()}`;
  // };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "CLOSED":
        return "#10b981";
      case "OPEN":
        return "#f59e0b";
      default:
        return "#9ca3af";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toUpperCase()) {
      case "CLOSED":
        return "Cerrada";
      case "OPEN":
        return "Abierta";
      default:
        return status;
    }
  };

  
  const OpenAccountCard = ({ item }: { item: IOpenAccount }) => {
    const totalSales =
      item.sales?.reduce((sum, sale) => sum + sale.total, 0) || 0;
    const totalPaid = item.totalPaidOnThisAccount || 0;
    const totalPending = totalSales - totalPaid;

    return (
      <TouchableOpacity onPress={() => handleViewAccountDetail(item.id)} style={styles.accountCard}>
        <View style={styles.accountHeader}>
          <View style={styles.accountInfo}>
            <Text style={styles.clientName}>{item.client?.name}</Text>
            <Text style={styles.accountDate}>
              Creada: {formatDate(item.createdAt)}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: `${getStatusColor(item.status)}20` },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(item.status) },
              ]}
            >
              {getStatusText(item.status)}
            </Text>
          </View>
        </View>

        <View style={styles.amountsContainer}>
          <View style={styles.amountBox}>
            <Text style={styles.amountLabel}>Total</Text>
            <Text style={styles.amountValue}>{formatCurrency(totalSales)}</Text>
          </View>
          <View style={styles.amountBox}>
            <Text style={styles.amountLabel}>Pagado</Text>
            <Text style={[styles.amountValue, { color: "#10b981" }]}>
              {formatCurrency(totalPaid)}
            </Text>
          </View>
          <View style={styles.amountBox}>
            <Text style={styles.amountLabel}>Pendiente</Text>
            <Text style={[styles.amountValue, { color: "#f59e0b" }]}>
              {formatCurrency(totalPending)}
            </Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.salesCount}>
            {item.sales?.length || 0} venta(s)
          </Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={(e) => {
              e.stopPropagation(); // Evita que se active el onPress del card
              handleShareSummary(item);
            }}
          >
            <Ionicons name="share-social-outline" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderOpenAccount = ({ item }: { item: IOpenAccount }) => (
    <OpenAccountCard item={item} />
  );


  if (isLoading && !openAccountsData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text style={styles.loadingText}>Cargando cuentas abiertas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
        <Text style={styles.errorText}>Error al cargar cuentas abiertas</Text>
        <Text style={styles.errorSubtext}>
          {error instanceof Error ? error.message : "Error desconocido"}
        </Text>
      </View>
    );
  }

  const totalAccounts = openAccountsData?.data?.totalItems || 0;
  const openAccounts = openAccountsData?.data?.data || [];
  const totalOpen = openAccounts.filter(
    (account) => account.status === "OPEN"
  ).length;
  const totalClosed = openAccounts.filter(
    (account) => account.status === "CLOSED"
  ).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="wallet-outline" size={28} color="#f59e0b" />
          <Text style={styles.headerTitle}>Cuentas Abiertas</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalAccounts}</Text>
            <Text style={styles.statLabel}>Total Cuentas</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalOpen}</Text>
            <Text style={styles.statLabel}>Abiertas</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalClosed}</Text>
            <Text style={styles.statLabel}>Cerradas</Text>
          </View>
        </View>

        <View style={styles.listContainer}>
          <FlatList
            data={openAccounts}
            renderItem={renderOpenAccount}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="wallet-outline" size={48} color="#9ca3af" />
                <Text style={styles.emptyText}>
                  No hay cuentas abiertas disponibles
                </Text>
              </View>
            }
          />
        </View>

        {/* Paginación simple */}
        {(openAccountsData?.data?.totalPages || 0) > 1 && (
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              style={[
                styles.paginationButton,
                currentPage === 1 && styles.paginationButtonDisabled,
              ]}
              onPress={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <Ionicons
                name="chevron-back"
                size={20}
                color={currentPage === 1 ? "#6b7280" : "#f59e0b"}
              />
            </TouchableOpacity>

            <Text style={styles.pageInfo}>
              Página {currentPage} de {openAccountsData?.data?.totalPages || 1}
            </Text>

            <TouchableOpacity
              style={[
                styles.paginationButton,
                currentPage === (openAccountsData?.data?.totalPages || 1) &&
                  styles.paginationButtonDisabled,
              ]}
              onPress={() => handlePageChange(currentPage + 1)}
              disabled={
                currentPage === (openAccountsData?.data?.totalPages || 1)
              }
            >
              <Ionicons
                name="chevron-forward"
                size={20}
                color={
                  currentPage === (openAccountsData?.data?.totalPages || 1)
                    ? "#6b7280"
                    : "#f59e0b"
                }
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <OpenAccountDetailModal
        isVisible={isDetailModalVisible}
        onClose={handleCloseDetailModal}
        accountId={selectedAccountId}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
  },
  loadingText: {
    color: "#9ca3af",
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
    padding: 20,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
  },
  errorSubtext: {
    color: "#9ca3af",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#1e293b",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#e5e7eb",
    marginLeft: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 20,
  },
  statCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 12,
    flex: 1,
    marginHorizontal: 2,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f59e0b",
  },
  statLabel: {
    fontSize: 10,
    color: "#9ca3af",
    marginTop: 4,
    textAlign: "center",
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 4,
    paddingBottom: 20,
  },
  accountCard: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(156, 163, 175, 0.1)',
  },
  accountHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  accountInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#e5e7eb",
    marginBottom: 4,
  },
  accountDate: {
    fontSize: 12,
    color: "#9ca3af",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  amountsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  amountBox: {
    alignItems: 'center',
    flex: 1,
  },
  amountLabel: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  amountValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e5e7eb",
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(156, 163, 175, 0.1)',
  },
  salesCount: {
    fontSize: 12,
    color: '#9ca3af',
  },
  actionButton: {
    padding: 4,
  },
  emptyContainer: {
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
  paginationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  paginationButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "rgba(245, 158, 11, 0.1)",
  },
  paginationButtonDisabled: {
    backgroundColor: "rgba(107, 114, 128, 0.1)",
  },
  pageInfo: {
    fontSize: 14,
    color: "#9ca3af",
  },
});

export default OpenAccountsPage;
