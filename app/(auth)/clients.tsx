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
import { getClients } from "../../api/clients";
import { IClient } from "../../interfaces/client.interfaces";

const ClientsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: clientsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["clients", currentPage],
    queryFn: () => getClients(currentPage, 20),
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderClient = ({ item }: { item: IClient }) => (
    <View style={styles.clientCard}>
      <View style={styles.clientInfo}>
        <Text style={styles.clientName}>{item.name}</Text>
        <Text style={styles.clientEmail}>{item.email}</Text>
        <Text style={styles.clientPhone}>{item.phone}</Text>
      </View>
      <TouchableOpacity style={styles.actionButton}>
        <Ionicons name="ellipsis-vertical" size={20} color="#9ca3af" />
      </TouchableOpacity>
    </View>
  );

  if (isLoading && !clientsData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text style={styles.loadingText}>Cargando clientes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
        <Text style={styles.errorText}>Error al cargar clientes</Text>
        <Text style={styles.errorSubtext}>
          {error instanceof Error ? error.message : "Error desconocido"}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="people-outline" size={28} color="#f59e0b" />
          <Text style={styles.headerTitle}>Clientes</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {clientsData?.data?.totalItems || 0}
            </Text>
            <Text style={styles.statLabel}>Total Clientes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {clientsData?.data?.data?.length || 0}
            </Text>
            <Text style={styles.statLabel}>En esta página</Text>
          </View>
        </View>

        <View style={styles.listContainer}>
          <FlatList
            data={clientsData?.data?.data || []}
            renderItem={renderClient}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="people-outline" size={48} color="#9ca3af" />
                <Text style={styles.emptyText}>
                  No hay clientes disponibles
                </Text>
              </View>
            }
          />
        </View>

        {/* Paginación simple */}
        {(clientsData?.data?.totalPages || 0) > 1 && (
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
              Página {currentPage} de {clientsData?.data?.totalPages || 1}
            </Text>

            <TouchableOpacity
              style={[
                styles.paginationButton,
                currentPage === (clientsData?.data?.totalPages || 1) &&
                  styles.paginationButtonDisabled,
              ]}
              onPress={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === (clientsData?.data?.totalPages || 1)}
            >
              <Ionicons
                name="chevron-forward"
                size={20}
                color={
                  currentPage === (clientsData?.data?.totalPages || 1)
                    ? "#6b7280"
                    : "#f59e0b"
                }
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
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
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f59e0b",
  },
  statLabel: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 4,
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
  clientCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(156, 163, 175, 0.2)",
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e5e7eb",
    marginBottom: 4,
  },
  clientEmail: {
    fontSize: 14,
    color: "#9ca3af",
    marginBottom: 2,
  },
  clientPhone: {
    fontSize: 12,
    color: "#9ca3af",
  },
  actionButton: {
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

export default ClientsPage;
