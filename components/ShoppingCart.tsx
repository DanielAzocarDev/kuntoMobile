import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppStore } from "../store";
import { ICartItem } from "../interfaces/sales.interfaces";
import { getClients } from "../api/clients";
import { createSale } from "../api/sales";
import { IClient } from "../interfaces/client.interfaces";
import CreateClientModal from "./CreateClientModal";

interface CartItemProps {
  item: ICartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  return (
    <View style={styles.cartItem}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.name || "Producto sin nombre"}
        </Text>
        <Text style={styles.itemPrice}>${item.price.toLocaleString()}</Text>
      </View>

      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => onUpdateQuantity(item.productId, item.quantity - 1)}
        >
          <Ionicons name="remove" size={16} color="#f59e0b" />
        </TouchableOpacity>

        <Text style={styles.quantityText}>{item.quantity}</Text>

        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => onUpdateQuantity(item.productId, item.quantity + 1)}
          disabled={item.quantity >= item.availableStock}
        >
          <Ionicons name="add" size={16} color="#f59e0b" />
        </TouchableOpacity>
      </View>

      <View style={styles.itemTotal}>
        <Text style={styles.totalText}>
          ${(item.price * item.quantity).toLocaleString()}
        </Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => onRemove(item.productId)}
        >
          <Ionicons name="trash-outline" size={16} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

interface ClientSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectClient: (clientId: string) => void;
  clients: IClient[];
  onCreateClient: () => void;
  isLoading: boolean;
}

const ClientSelectionModal: React.FC<ClientSelectionModalProps> = ({
  visible,
  onClose,
  onSelectClient,
  clients,
  onCreateClient,
  isLoading,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Seleccionar Cliente</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.clientsList}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Cargando clientes...</Text>
              </View>
            ) : clients.length > 0 ? (
              clients.map((client) => (
                <TouchableOpacity
                  key={client.id}
                  style={styles.clientItem}
                  onPress={() => onSelectClient(client.id)}
                >
                  <Text style={styles.clientName}>{client.name}</Text>
                  <Text style={styles.clientEmail}>{client.email}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No hay clientes disponibles
                </Text>
              </View>
            )}
          </ScrollView>

          <TouchableOpacity
            style={styles.createClientButton}
            onPress={onCreateClient}
          >
            <Ionicons name="add-circle-outline" size={20} color="#f59e0b" />
            <Text style={styles.createClientText}>Crear Nuevo Cliente</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  onProcessPayment: (paymentMethod: string, initialAmount: number) => void;
  total: number;
  isProcessing: boolean;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  onClose,
  onProcessPayment,
  total,
  isProcessing,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<
    "CASH" | "CARD" | "TRANSFER"
  >("CASH");
  const [initialAmount, setInitialAmount] = useState("");

  const handleProcessPayment = () => {
    const amount = parseFloat(initialAmount) || 0;
    if (amount > total) {
      Alert.alert("Error", "El monto inicial no puede ser mayor al total");
      return;
    }
    onProcessPayment(paymentMethod, amount);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Procesar Pago</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          <View style={styles.paymentContent}>
            <Text style={styles.totalLabel}>
              Total: ${total.toLocaleString()}
            </Text>

            <View style={styles.paymentMethodContainer}>
              <Text style={styles.sectionTitle}>Método de Pago:</Text>
              <View style={styles.paymentMethods}>
                {[
                  { key: "CASH", label: "Efectivo", icon: "cash-outline" },
                  { key: "CARD", label: "Tarjeta", icon: "card-outline" },
                  {
                    key: "TRANSFER",
                    label: "Transferencia",
                    icon: "swap-horizontal-outline",
                  },
                ].map((method) => (
                  <TouchableOpacity
                    key={method.key}
                    style={[
                      styles.paymentMethodButton,
                      paymentMethod === method.key &&
                        styles.paymentMethodSelected,
                    ]}
                    onPress={() => setPaymentMethod(method.key as any)}
                  >
                    <Ionicons
                      name={method.icon as any}
                      size={20}
                      color={
                        paymentMethod === method.key ? "#f59e0b" : "#9ca3af"
                      }
                    />
                    <Text
                      style={[
                        styles.paymentMethodText,
                        paymentMethod === method.key &&
                          styles.paymentMethodTextSelected,
                      ]}
                    >
                      {method.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.initialPaymentContainer}>
              <Text style={styles.sectionTitle}>Pago Inicial (Opcional):</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="Monto del pago inicial"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                value={initialAmount}
                onChangeText={setInitialAmount}
              />
              {initialAmount && (
                <Text style={styles.remainingText}>
                  Restante: $
                  {(total - parseFloat(initialAmount) || 0).toLocaleString()}
                </Text>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.processPaymentButton,
              isProcessing && styles.processPaymentButtonDisabled,
            ]}
            onPress={handleProcessPayment}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <View style={styles.loadingButtonContainer}>
                <ActivityIndicator size="small" color="#ffffff" />
                <Text style={styles.processPaymentText}>Procesando...</Text>
              </View>
            ) : (
              <Text style={styles.processPaymentText}>Procesar Venta</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const ShoppingCart: React.FC = () => {
  const {
    cart,
    selectedClient,
    removeFromCart,
    updateCartItemQuantity,
    setSelectedClient,
    clearCart,
  } = useAppStore();

  const [showClientModal, setShowClientModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCreateClientModal, setShowCreateClientModal] = useState(false);
  const [clients, setClients] = useState<IClient[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [selectedClientData, setSelectedClientData] = useState<IClient | null>(
    null
  );
  const [isProcessingSale, setIsProcessingSale] = useState(false);

  // Cargar clientes cuando se abre el modal
  useEffect(() => {
    if (showClientModal) {
      loadClients();
    }
  }, [showClientModal]);

  // Actualizar datos del cliente seleccionado cuando cambie
  useEffect(() => {
    if (selectedClient && clients.length > 0) {
      const client = clients.find((c) => c.id === selectedClient);
      setSelectedClientData(client || null);
    } else if (!selectedClient) {
      setSelectedClientData(null);
    }
  }, [selectedClient, clients]);

  const loadClients = async () => {
    setIsLoadingClients(true);
    try {
      const response = await getClients(1, 50);
      setClients(response.data.data);
    } catch (error) {
      console.error("Error loading clients:", error);
      Alert.alert("Error", "No se pudieron cargar los clientes");
    } finally {
      setIsLoadingClients(false);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSelectClient = (clientId: string) => {
    setSelectedClient(clientId);
    setShowClientModal(false);
  };

  const handleCreateClient = () => {
    setShowClientModal(false);
    setShowCreateClientModal(true);
  };

  const handleClientCreated = (newClient: IClient) => {
    setClients((prev) => [newClient, ...prev]);
    setSelectedClient(newClient.id);
  };

  const handleChangeClient = () => {
    setShowClientModal(true);
  };

  const handleRemoveClient = () => {
    setSelectedClient(null);
    setSelectedClientData(null);
  };

  const handleProcessPayment = async (
    paymentMethod: string,
    initialAmount: number
  ) => {
    if (cart.length === 0) {
      Alert.alert("Error", "El carrito está vacío");
      return;
    }

    if (!selectedClient) {
      Alert.alert(
        "Error",
        "Debes seleccionar un cliente antes de procesar la venta"
      );
      return;
    }

    // Verificar que ningún item exceda el stock disponible
    const invalidItems = cart.filter(
      (item) => item.quantity > item.availableStock
    );
    if (invalidItems.length > 0) {
      const itemNames = invalidItems.map((item) => item.name).join(", ");
      Alert.alert(
        "Error de Stock",
        `Los siguientes productos exceden el stock disponible: ${itemNames}. Por favor, ajusta las cantidades.`
      );
      return;
    }

    setIsProcessingSale(true);

    try {
      const saleItems = cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      }));

      const saleData = {
        items: saleItems,
        status: (initialAmount >= total ? "PAID" : "PENDING") as
          | "PAID"
          | "PENDING",
        clientId: selectedClient || undefined,
        paymentMethod: paymentMethod as "CASH" | "CARD" | "TRANSFER" | "OTHER",
        initialPaymentAmount: initialAmount > 0 ? initialAmount : undefined,
      };

      await createSale(saleData);

      Alert.alert(
        "¡Venta Exitosa!",
        `Venta procesada con éxito\nMétodo: ${paymentMethod}\nPago inicial: $${initialAmount.toLocaleString()}\nTotal: $${total.toLocaleString()}`,
        [
          {
            text: "OK",
            onPress: () => {
              clearCart();
              setSelectedClient(null);
              setSelectedClientData(null);
              setShowPaymentModal(false);
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error creating sale:", error);
      Alert.alert(
        "Error",
        `Error al procesar la venta: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    } finally {
      setIsProcessingSale(false);
    }
  };

  if (cart.length === 0) {
    return (
      <View style={styles.emptyCart}>
        <Ionicons name="cart-outline" size={48} color="#9ca3af" />
        <Text style={styles.emptyCartText}>El carrito está vacío</Text>
        <Text style={styles.emptyCartSubtext}>
          Agrega productos para comenzar una venta
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="cart-outline" size={24} color="#f59e0b" />
          <Text style={styles.headerTitle}>Carrito de Compras</Text>
        </View>
        <TouchableOpacity style={styles.clearButton} onPress={clearCart}>
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.productId}
        renderItem={({ item }) => (
          <CartItem
            item={item}
            onUpdateQuantity={updateCartItemQuantity}
            onRemove={removeFromCart}
          />
        )}
        style={styles.cartList}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.clientSection}>
        <Text style={styles.sectionTitle}>Cliente:</Text>
        {selectedClientData ? (
          <View style={styles.selectedClientContainer}>
            <View style={styles.clientInfo}>
              <Text style={styles.selectedClientName}>
                {selectedClientData.name}
              </Text>
              <Text style={styles.selectedClientEmail}>
                {selectedClientData.email}
              </Text>
            </View>
            <View style={styles.clientActions}>
              <TouchableOpacity
                style={styles.changeClientButton}
                onPress={handleChangeClient}
              >
                <Ionicons name="create-outline" size={16} color="#f59e0b" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeClientButton}
                onPress={handleRemoveClient}
              >
                <Ionicons name="close-outline" size={16} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.clientButton}
            onPress={() => setShowClientModal(true)}
          >
            <Ionicons name="person-outline" size={20} color="#f59e0b" />
            <Text style={styles.clientButtonText}>Seleccionar Cliente</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.totalSection}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalAmount}>${total.toLocaleString()}</Text>
      </View>

      <TouchableOpacity
        style={[
          styles.checkoutButton,
          !selectedClient && styles.checkoutButtonDisabled,
        ]}
        onPress={() => setShowPaymentModal(true)}
        disabled={!selectedClient}
      >
        <Ionicons name="card-outline" size={20} color="#ffffff" />
        <Text style={styles.checkoutButtonText}>
          {selectedClient ? "Procesar Venta" : "Selecciona un Cliente"}
        </Text>
      </TouchableOpacity>

      <ClientSelectionModal
        visible={showClientModal}
        onClose={() => setShowClientModal(false)}
        onSelectClient={handleSelectClient}
        clients={clients}
        onCreateClient={handleCreateClient}
        isLoading={isLoadingClients}
      />

      <CreateClientModal
        visible={showCreateClientModal}
        onClose={() => setShowCreateClientModal(false)}
        onClientCreated={handleClientCreated}
      />

      <PaymentModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onProcessPayment={handleProcessPayment}
        total={total}
        isProcessing={isProcessingSale}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgb(30, 41, 59)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#e5e7eb",
    marginLeft: 12,
  },
  itemCount: {
    fontSize: 14,
    color: "#9ca3af",
    marginLeft: 8,
  },
  clearButton: {
    padding: 8,
  },
  cartList: {
    maxHeight: 300,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(156, 163, 175, 0.2)",
  },
  itemInfo: {
    flex: 2,
    marginRight: 12,
    justifyContent: "center",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 6,
    flex: 1,
  },
  itemPrice: {
    fontSize: 12,
    color: "#9ca3af",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e5e7eb",
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: "center",
  },
  itemTotal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
  },
  totalText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f59e0b",
    marginBottom: 4,
  },
  removeButton: {
    padding: 4,
  },
  clientSection: {
    marginTop: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#e5e7eb",
    marginBottom: 8,
  },
  clientButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 8,
  },
  clientButtonText: {
    fontSize: 14,
    color: "#e5e7eb",
    marginLeft: 8,
  },
  totalSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(156, 163, 175, 0.2)",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#e5e7eb",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f59e0b",
  },
  checkoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f59e0b",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  checkoutButtonDisabled: {
    backgroundColor: "#6b7280",
    opacity: 0.7,
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginLeft: 8,
  },
  emptyCart: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyCartText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#9ca3af",
    marginTop: 12,
  },
  emptyCartSubtext: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "rgb(30, 41, 59)",
    borderRadius: 16,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#e5e7eb",
  },
  clientsList: {
    maxHeight: 200,
  },
  clientItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(156, 163, 175, 0.2)",
  },
  clientName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#e5e7eb",
  },
  clientEmail: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
  createClientButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    borderRadius: 8,
    marginTop: 16,
  },
  createClientText: {
    fontSize: 14,
    color: "#f59e0b",
    marginLeft: 8,
  },
  paymentContent: {
    marginBottom: 20,
  },
  paymentMethodContainer: {
    marginBottom: 20,
  },
  paymentMethods: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  paymentMethodButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  paymentMethodSelected: {
    backgroundColor: "rgba(245, 158, 11, 0.2)",
    borderColor: "#f59e0b",
    borderWidth: 1,
  },
  paymentMethodText: {
    fontSize: 12,
    color: "#9ca3af",
    marginLeft: 4,
  },
  paymentMethodTextSelected: {
    color: "#f59e0b",
  },
  initialPaymentContainer: {
    marginBottom: 20,
  },
  amountInput: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#e5e7eb",
    marginTop: 8,
  },
  remainingText: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 4,
  },
  processPaymentButton: {
    backgroundColor: "#f59e0b",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  processPaymentButtonDisabled: {
    backgroundColor: "#6b7280",
    opacity: 0.7,
  },
  processPaymentText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 14,
    color: "#9ca3af",
  },
  loadingButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
  },
  selectedClientContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 8,
  },
  clientInfo: {
    flex: 1,
  },
  selectedClientName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#e5e7eb",
  },
  selectedClientEmail: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
  clientActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  changeClientButton: {
    padding: 8,
  },
  removeClientButton: {
    padding: 8,
  },
});

export default ShoppingCart;
