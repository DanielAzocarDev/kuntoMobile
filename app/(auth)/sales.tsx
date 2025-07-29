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
import { getSales } from "../../api/sales";
import { ISale } from "../../interfaces/sales.interfaces";
import SaleDetailModal from "../../components/SaleDetailModal";

const SalesPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null);

  const {
    data: salesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sales", currentPage],
    queryFn: () => getSales(currentPage, 20),
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewSaleDetail = (saleId: string) => {
    setSelectedSaleId(saleId);
    setIsDetailModalVisible(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalVisible(false);
    setSelectedSaleId(null);
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
      case "PAID":
        return "#10b981";
      case "PENDING":
        return "#f59e0b";
      default:
        return "#9ca3af";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toUpperCase()) {
      case "PAID":
        return "Pagado";
      case "PENDING":
        return "Pendiente";
      default:
        return status;
    }
  };

  const renderSale = ({ item }: { item: ISale }) => (
    <View style={styles.saleCard}>
      <View style={styles.saleHeader}>
        <View style={styles.saleInfo}>
          <Text style={styles.saleId}>Venta #{item.id?.slice(-8)}</Text>
          <Text style={styles.saleDate}>
            {formatDate(item.createdAt || item.saleDate || "")}
          </Text>
          {item.client && (
            <Text style={styles.clientName}>{item.client.name}</Text>
          )}
        </View>
        <View style={styles.saleStatus}>
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

      <View style={styles.saleDetails}>
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Total:</Text>
          <Text style={styles.amountValue}>
            {formatCurrency(item.total || 0)}
          </Text>
        </View>
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Productos:</Text>
          <Text style={styles.amountValue}>
            {item.items?.length || 0} items
          </Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.viewDetailButton}
          onPress={() => handleViewSaleDetail(item.id!)}
        >
          <Ionicons name="eye-outline" size={20} color="#3b82f6" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading && !salesData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text style={styles.loadingText}>Cargando ventas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
        <Text style={styles.errorText}>Error al cargar ventas</Text>
        <Text style={styles.errorSubtext}>
          {error instanceof Error ? error.message : "Error desconocido"}
        </Text>
      </View>
    );
  }

  const totalSales = salesData?.data?.totalItems || 0;
  const totalPaid =
    salesData?.data?.data?.filter((sale: ISale) => sale.status === "PAID")
      .length || 0;
  const totalPending =
    salesData?.data?.data?.filter((sale: ISale) => sale.status === "PENDING")
      .length || 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="receipt-outline" size={28} color="#f59e0b" />
          <Text style={styles.headerTitle}>Ventas</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalSales}</Text>
            <Text style={styles.statLabel}>Total Ventas</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalPaid}</Text>
            <Text style={styles.statLabel}>Pagadas</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalPending}</Text>
            <Text style={styles.statLabel}>Pendientes</Text>
          </View>
        </View>

        <View style={styles.listContainer}>
          <FlatList
            data={salesData?.data?.data || []}
            renderItem={renderSale}
            keyExtractor={(item) => item.id || ""}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="receipt-outline" size={48} color="#9ca3af" />
                <Text style={styles.emptyText}>No hay ventas disponibles</Text>
              </View>
            }
          />
        </View>

        {/* Paginación simple */}
        {(salesData?.data?.totalPages || 0) > 1 && (
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
              Página {currentPage} de {salesData?.data?.totalPages || 1}
            </Text>

            <TouchableOpacity
              style={[
                styles.paginationButton,
                currentPage === (salesData?.data?.totalPages || 1) &&
                  styles.paginationButtonDisabled,
              ]}
              onPress={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === (salesData?.data?.totalPages || 1)}
            >
              <Ionicons
                name="chevron-forward"
                size={20}
                color={
                  currentPage === (salesData?.data?.totalPages || 1)
                    ? "#6b7280"
                    : "#f59e0b"
                }
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <SaleDetailModal
        isVisible={isDetailModalVisible}
        onClose={handleCloseDetailModal}
        saleId={selectedSaleId}
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
  saleCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  saleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  saleInfo: {
    flex: 1,
  },
  saleId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e5e7eb",
    marginBottom: 4,
  },
  saleDate: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 2,
  },
  clientName: {
    fontSize: 12,
    color: "#f59e0b",
  },
  saleStatus: {
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
  saleDetails: {
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

export default SalesPage;
