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
import type { IOpenAccount, ISale, ISaleItem, IPayment } from "../api/openAccounts";
import { useCurrency } from "@/hooks/useCurrency";

interface OpenAccountDetailModalProps {
  isVisible: boolean;
  onClose: () => void;
  accountId: string | null;
}

// Helper function for formatting dates
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Sub-component for displaying a single product item
const ProductItem: React.FC<{ item: ISaleItem; formatCurrency: (amount: number) => string; }> = ({ item, formatCurrency }) => (
  <View style={styles.productItem}>
    <Ionicons name="cube-outline" size={16} color="#9ca3af" />
    <Text style={styles.productName} numberOfLines={1}>
      {item.product?.name || item.name}
    </Text>
    <Text style={styles.productDetails}>
      {item.quantity} x {formatCurrency(item.price)}
    </Text>
    <Text style={styles.productTotal}>
      {formatCurrency(item.price * item.quantity)}
    </Text>
  </View>
);

// Sub-component for displaying a single sale card
const SaleCard: React.FC<{ sale: ISale; formatCurrency: (amount: number) => string; }> = ({ sale, formatCurrency }) => {
  const [productsVisible, setProductsVisible] = React.useState(false);
  const salePayments = sale.Payment?.reduce((sum: number, p: IPayment) => sum + p.amount, 0) || 0;
  const salePending = sale.total - salePayments;

  return (
    <View style={styles.saleItem}>
      <View style={styles.saleHeader}>
        <Text style={styles.saleDate}>{formatDate(sale.createdAt)}</Text>
        <View
          style={[
            styles.saleStatusBadge,
            { backgroundColor: sale.status === "PAID" ? "rgba(16, 185, 129, 0.2)" : "rgba(245, 158, 11, 0.2)" },
          ]}
        >
          <Text style={[styles.saleStatusText, { color: sale.status === "PAID" ? "#10b981" : "#f59e0b" }]}>
            {sale.status === "PAID" ? "Pagado" : "Pendiente"}
          </Text>
        </View>
      </View>

      {sale.items && sale.items.length > 0 && (
        <View>
          <TouchableOpacity
            style={styles.productsHeader}
            onPress={() => setProductsVisible(!productsVisible)}
          >
            <Text style={styles.productsTitle}>{productsVisible ? 'Ocultar Productos' : 'Ver Productos'} ({sale.items.length})</Text>
            <Ionicons name={productsVisible ? 'chevron-up-outline' : 'chevron-down-outline'} size={20} color="#9ca3af" />
          </TouchableOpacity>

          {productsVisible && (
            <View style={styles.saleProducts}>
              {sale.items.map((item: ISaleItem) => (
                <ProductItem key={item.id} item={item} formatCurrency={formatCurrency} />
              ))}
            </View>
          )}
        </View>
      )}

      <View style={styles.saleAmounts}>
        <View style={styles.amountRowFlex}>
            <Text style={styles.amountLabel}>Total Venta:</Text>
            <Text style={styles.saleTotal}>{formatCurrency(sale.total)}</Text>
        </View>
        <View style={styles.amountRowFlex}>
            <Text style={styles.amountLabel}>Pagado:</Text>
            <Text style={styles.salePaid}>{formatCurrency(salePayments)}</Text>
        </View>
        {salePending > 0 && (
            <View style={styles.amountRowFlex}>
                <Text style={styles.amountLabel}>Pendiente:</Text>
                <Text style={styles.salePending}>{formatCurrency(salePending)}</Text>
            </View>
        )}
      </View>
    </View>
  );
};

// Sub-component for client information
const ClientInfo: React.FC<{ account: IOpenAccount }> = ({ account }) => (
  <View style={styles.infoSection}>
    <Text style={styles.sectionTitle}>Información del Cliente</Text>
    <View style={styles.infoRow}>
        <Ionicons name="person-outline" size={16} color="#9ca3af" style={{marginRight: 8}} />
        <Text style={styles.infoLabel}>Cliente:</Text>
        <Text style={styles.infoValue}>{account.client?.name}</Text>
    </View>
    <View style={styles.infoRow}>
        <Ionicons name="calendar-outline" size={16} color="#9ca3af" style={{marginRight: 8}}/>
        <Text style={styles.infoLabel}>Fecha de Creación:</Text>
        <Text style={styles.infoValue}>{formatDate(account.createdAt)}</Text>
    </View>
  </View>
);

// Sub-component for account summary
const AccountSummary: React.FC<{ account: IOpenAccount; formatCurrency: (amount: number) => string; }> = ({ account, formatCurrency }) => {
  const totalSales = account.sales?.reduce((total, sale) => total + sale.total, 0) || 0;
  const totalPaid = account.totalPaidOnThisAccount || 0;
  const totalPending = totalSales - totalPaid;

  return (
    <View style={styles.amountsSection}>
      <Text style={styles.sectionTitle}>Resumen de Montos</Text>
      <View style={styles.amountRow}>
        <Text style={styles.amountLabel}>Total Ventas:</Text>
        <Text style={styles.amountValue}>{formatCurrency(totalSales)}</Text>
      </View>
      <View style={styles.amountRow}>
        <Text style={styles.amountLabel}>Total Pagado:</Text>
        <Text style={[styles.amountValue, { color: "#10b981" }]}>{formatCurrency(totalPaid)}</Text>
      </View>
      <View style={styles.amountRow}>
        <Text style={styles.amountLabel}>Total Pendiente:</Text>
        <Text style={[styles.amountValue, { color: "#f59e0b" }]}>{formatCurrency(totalPending)}</Text>
      </View>
    </View>
  );
};

const OpenAccountDetailModal: React.FC<OpenAccountDetailModalProps> = ({ isVisible, onClose, accountId }) => {
  const { formatCurrency } = useCurrency();

  const { data: accountResponse, isLoading, isError, error } = useQuery({
    queryKey: ["openAccountDetails", accountId],
    queryFn: () => getOpenAccountById(accountId as string),
    enabled: isVisible && !!accountId,
  });

  if (!isVisible) return null;

  const accountDetails = accountResponse?.data as IOpenAccount;

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#f59e0b" />
          <Text style={styles.loadingText}>Cargando detalles...</Text>
        </View>
      );
    }

    if (isError || !accountDetails) {
      return (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={20} color="#ef4444" />
          <Text style={styles.errorText}>
            {error ? error.message : "No se pudieron cargar los detalles."}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.detailsContainer}>
        <ClientInfo account={accountDetails} />
        <AccountSummary account={accountDetails} formatCurrency={formatCurrency} />

        <View style={styles.salesSection}>
          <Text style={styles.sectionTitle}>Ventas en esta Cuenta</Text>
          {accountDetails.sales && accountDetails.sales.length > 0 ? (
            accountDetails.sales.map((sale) => (
              <SaleCard key={sale.id} sale={sale} formatCurrency={formatCurrency} />
            ))
          ) : (
            <View style={styles.emptySection}>
              <Ionicons name="receipt-outline" size={48} color="#9ca3af" />
              <Text style={styles.emptyText}>No hay ventas en esta cuenta</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <Modal visible={isVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
            <Ionicons name="wallet-outline" size={24} color="#f59e0b" />
            <Text style={styles.headerTitle}>Detalles de Cuenta</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#9ca3af" />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderContent()}
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
    borderBottomWidth: 1,
    borderBottomColor: "rgba(156, 163, 175, 0.2)",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#e5e7eb",
    marginLeft: 12,
    flex: 1,
  },
  closeButton: { padding: 4 },
  content: { flex: 1, paddingHorizontal: 16 },
  loadingContainer: { alignItems: "center", justifyContent: "center", paddingVertical: 40 },
  loadingText: { color: "#9ca3af", marginTop: 12, fontSize: 16 },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
  },
  errorText: { color: "#ef4444", fontSize: 14, marginLeft: 8, flex: 1 },
  detailsContainer: { paddingVertical: 20 },
  infoSection: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#f59e0b",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: 'center',
    marginBottom: 10,
  },
  infoLabel: { fontSize: 14, color: "#9ca3af", flex: 1 },
  infoValue: { fontSize: 14, fontWeight: "500", color: "#e5e7eb", textAlign: 'right' },
  amountsSection: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(156, 163, 175, 0.1)',
  },
  amountRowFlex: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  amountLabel: { fontSize: 14, color: "#9ca3af" },
  amountValue: { fontSize: 16, fontWeight: "600", color: "#e5e7eb" },
  salesSection: { marginBottom: 16 },
  saleItem: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  saleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(156, 163, 175, 0.2)',
  },
  saleDate: { fontSize: 12, color: "#9ca3af" },
  saleStatusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  saleStatusText: { fontSize: 12, fontWeight: "600" },
  saleAmounts: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(156, 163, 175, 0.2)',
    gap: 8,
  },
  saleTotal: { fontSize: 14, color: "#e5e7eb", fontWeight: '500' },
  salePaid: { fontSize: 14, color: "#10b981", fontWeight: '500' },
  salePending: { fontSize: 14, color: "#f59e0b", fontWeight: '500' },
  productsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  productsTitle: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '500',
  },
  saleProducts: { marginTop: 8 },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(156, 163, 175, 0.1)',
  },
  productName: { fontSize: 14, color: "#e5e7eb", flex: 1, marginLeft: 8 },
  productDetails: { fontSize: 12, color: "#9ca3af", marginHorizontal: 8 },
  productTotal: { fontSize: 14, fontWeight: "500", color: "#e5e7eb" },
  emptySection: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    backgroundColor: '#1e293b',
    borderRadius: 12,
  },
  emptyText: { fontSize: 14, color: "#9ca3af", marginTop: 12, textAlign: "center" },
});

export default OpenAccountDetailModal;
