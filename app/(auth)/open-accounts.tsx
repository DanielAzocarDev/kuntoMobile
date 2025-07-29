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

interface OpenAccount {
  id: string;
  clientName: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: string;
  createdAt: string;
  dueDate?: string;
}

const OpenAccountsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data para cuentas abiertas - en el futuro esto vendría de una API
  const mockOpenAccounts: OpenAccount[] = [
    {
      id: "1",
      clientName: "Juan Pérez",
      totalAmount: 1500,
      paidAmount: 500,
      remainingAmount: 1000,
      status: "PENDING",
      createdAt: "2024-01-15",
      dueDate: "2024-02-15",
    },
    {
      id: "2",
      clientName: "María García",
      totalAmount: 2300,
      paidAmount: 2300,
      remainingAmount: 0,
      status: "PAID",
      createdAt: "2024-01-10",
      dueDate: "2024-02-10",
    },
    {
      id: "3",
      clientName: "Carlos López",
      totalAmount: 800,
      paidAmount: 200,
      remainingAmount: 600,
      status: "PENDING",
      createdAt: "2024-01-20",
      dueDate: "2024-02-20",
    },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
      case "OVERDUE":
        return "#ef4444";
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
      case "OVERDUE":
        return "Vencido";
      default:
        return status;
    }
  };

  const renderOpenAccount = ({ item }: { item: OpenAccount }) => (
    <View style={styles.accountCard}>
      <View style={styles.accountHeader}>
        <View style={styles.accountInfo}>
          <Text style={styles.clientName}>{item.clientName}</Text>
          <Text style={styles.accountDate}>
            Creada: {formatDate(item.createdAt)}
          </Text>
          {item.dueDate && (
            <Text style={styles.dueDate}>
              Vence: {formatDate(item.dueDate)}
            </Text>
          )}
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
          <Text style={styles.amountValue}>
            ${item.totalAmount.toLocaleString()}
          </Text>
        </View>
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Pagado:</Text>
          <Text style={[styles.amountValue, { color: "#10b981" }]}>
            ${item.paidAmount.toLocaleString()}
          </Text>
        </View>
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Pendiente:</Text>
          <Text style={[styles.amountValue, { color: "#f59e0b" }]}>
            ${item.remainingAmount.toLocaleString()}
          </Text>
        </View>
      </View>
    </View>
  );

  const totalAccounts = mockOpenAccounts.length;
  const totalPending = mockOpenAccounts.filter(
    (account) => account.status === "PENDING"
  ).length;
  const totalAmount = mockOpenAccounts.reduce(
    (sum, account) => sum + account.remainingAmount,
    0
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="wallet-outline" size={28} color="#f59e0b" />
          <Text style={styles.headerTitle}>Cuentas Abiertas</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalAccounts}</Text>
            <Text style={styles.statLabel}>Total Cuentas</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalPending}</Text>
            <Text style={styles.statLabel}>Pendientes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              ${totalAmount.toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>Por Cobrar</Text>
          </View>
        </View>

        <View style={styles.listContainer}>
          <FlatList
            data={mockOpenAccounts}
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
      </View>
    </View>
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
    paddingTop: 60,
    paddingBottom: 20,
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
  addButton: {
    backgroundColor: "#f59e0b",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
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
  dueDate: {
    fontSize: 12,
    color: "#f59e0b",
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
});

export default OpenAccountsPage;
