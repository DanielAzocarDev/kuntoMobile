import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { getOpenAccounts } from "../../api/openAccounts";
import type { IOpenAccount } from "../../api/openAccounts";
import OpenAccountDetailModal from "../../components/OpenAccountDetailModal";

const OpenAccountsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null
  );

  const {
    data: openAccountsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["openAccounts", currentPage],
    queryFn: () => getOpenAccounts(currentPage, 20),
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

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

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

  const renderOpenAccount = ({ item }: { item: IOpenAccount }) => {
    const totalSales =
      item.sales?.reduce((sum, sale) => sum + sale.total, 0) || 0;
    const totalPaid = item.totalPaidOnThisAccount || 0;
    const totalPending = totalSales - totalPaid;

    return (
      <View style={styles.accountCard}>
        <View style={styles.accountHeader}>
          <View style={styles.accountInfo}>
            <Text style={styles.clientName}>{item.client?.name}</Text>
            <Text style={styles.accountDate}>
              Creada: {formatDate(item.createdAt)}
            </Text>
          </View>
          <View style={styles.accountStatus}>
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
        </View>
        <View style={styles.accountDetails}>
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Total:</Text>
            <Text style={styles.amountValue}>{formatCurrency(totalSales)}</Text>
          </View>
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Pagado:</Text>
            <Text style={[styles.amountValue, { color: "#10b981" }]}>
              {formatCurrency(totalPaid)}
            </Text>
          </View>
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Pendiente:</Text>
            <Text style={[styles.amountValue, { color: "#f59e0b" }]}>
              {formatCurrency(totalPending)}
            </Text>
          </View>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.viewDetailButton}
            onPress={() => handleViewAccountDetail(item.id)}
          >
            <Ionicons name="eye-outline" size={20} color="#3b82f6" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  listContent: {
    flexGrow: 1,
  },
  accountCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  accountHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  accountInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e5e7eb",
    marginBottom: 4,
  },
  accountDate: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 2,
  },
  accountStatus: {
    marginLeft: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  accountDetails: {
    borderTopWidth: 1,
    borderTopColor: "rgba(156, 163, 175, 0.2)",
    paddingTop: 12,
    marginBottom: 12,
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  amountLabel: {
    fontSize: 14,
    color: "#9ca3af",
  },
  amountValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#e5e7eb",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    borderTopWidth: 1,
    borderTopColor: "rgba(156, 163, 175, 0.2)",
    paddingTop: 12,
  },
  viewDetailButton: {
    padding: 8,
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
