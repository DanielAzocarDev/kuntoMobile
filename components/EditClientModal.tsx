import React, { useState, useEffect } from "react";
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
import { updateClient } from "../api/clients";
import type {
  IClient,
  CreateClientPayload,
} from "../interfaces/client.interfaces";

interface EditClientModalProps {
  isVisible: boolean;
  onClose: () => void;
  client: IClient | null;
}

const EditClientModal: React.FC<EditClientModalProps> = ({
  isVisible,
  onClose,
  client,
}) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  const updateClientMutation = useMutation({
    mutationFn: (clientData: Partial<CreateClientPayload> & { id: string }) => {
      const { id, ...data } = clientData;
      return updateClient(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      onClose();
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  useEffect(() => {
    if (client) {
      setName(client.name);
      setEmail(client.email);
      setPhone(client.phone || "");
    }
  }, [client]);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setError(null);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = () => {
    if (!client) return;

    setError(null);

    // Validaciones
    if (!name.trim()) {
      setError("El nombre del cliente es obligatorio");
      return;
    }

    if (!email.trim()) {
      setError("El email es obligatorio");
      return;
    }

    if (!validateEmail(email.trim())) {
      setError("El formato del email no es válido");
      return;
    }

    if (!phone.trim()) {
      setError("El teléfono es obligatorio");
      return;
    }

    const clientData: Partial<CreateClientPayload> & { id: string } = {
      id: client.id,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
    };

    updateClientMutation.mutate(clientData);
  };

  const handleClose = () => {
    if (updateClientMutation.isPending) {
      Alert.alert(
        "Operación en progreso",
        "¿Estás seguro de que quieres cancelar? Los cambios se perderán.",
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

  if (!isVisible || !client) return null;

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
            <Ionicons name="person-outline" size={28} color="#f59e0b" />
            <Text style={styles.headerTitle}>Editar Cliente</Text>
          </View>
          <TouchableOpacity
            onPress={handleClose}
            style={styles.closeButton}
            disabled={updateClientMutation.isPending}
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
              <Text style={styles.label}>Nombre Completo *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Nombre completo del cliente"
                placeholderTextColor="#6b7280"
                editable={!updateClientMutation.isPending}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo Electrónico *</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="cliente@email.com"
                placeholderTextColor="#6b7280"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!updateClientMutation.isPending}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Teléfono *</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Ej: 987654321"
                placeholderTextColor="#6b7280"
                keyboardType="phone-pad"
                editable={!updateClientMutation.isPending}
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleClose}
            disabled={updateClientMutation.isPending}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.submitButton,
              updateClientMutation.isPending && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={updateClientMutation.isPending}
          >
            {updateClientMutation.isPending ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
            )}
            <Text style={styles.submitButtonText}>
              {updateClientMutation.isPending
                ? "Guardando..."
                : "Actualizar Cliente"}
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

export default EditClientModal;
