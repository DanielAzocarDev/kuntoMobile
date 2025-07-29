import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createClient } from "../api/clients";
import { CreateClientPayload } from "../interfaces/client.interfaces";

interface CreateClientModalProps {
  visible: boolean;
  onClose: () => void;
  onClientCreated: (client: any) => void;
}

const CreateClientModal: React.FC<CreateClientModalProps> = ({
  visible,
  onClose,
  onClientCreated,
}) => {
  const [formData, setFormData] = useState<CreateClientPayload>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    field: keyof CreateClientPayload,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      Alert.alert("Error", "El nombre y email son obligatorios");
      return;
    }

    setIsLoading(true);
    try {
      const response = await createClient(formData);
      Alert.alert("Éxito", "Cliente creado correctamente", [
        {
          text: "OK",
          onPress: () => {
            onClientCreated(response.data);
            onClose();
            setFormData({ name: "", email: "", phone: "", address: "" });
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Error al crear el cliente");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: "", email: "", phone: "", address: "" });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Crear Nuevo Cliente</Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nombre *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Nombre del cliente"
                placeholderTextColor="#9ca3af"
                value={formData.name}
                onChangeText={(value) => handleInputChange("name", value)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="email@ejemplo.com"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={(value) => handleInputChange("email", value)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Teléfono</Text>
              <TextInput
                style={styles.textInput}
                placeholder="+1234567890"
                placeholderTextColor="#9ca3af"
                keyboardType="phone-pad"
                value={formData.phone}
                onChangeText={(value) => handleInputChange("phone", value)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Dirección</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Dirección del cliente"
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={3}
                value={formData.address}
                onChangeText={(value) => handleInputChange("address", value)}
              />
            </View>
          </ScrollView>

          <TouchableOpacity
            style={[
              styles.createButton,
              isLoading && styles.createButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Ionicons name="add-circle-outline" size={20} color="#ffffff" />
            <Text style={styles.createButtonText}>
              {isLoading ? "Creando..." : "Crear Cliente"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  formContainer: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#e5e7eb",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#e5e7eb",
    borderWidth: 1,
    borderColor: "rgba(156, 163, 175, 0.2)",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f59e0b",
    paddingVertical: 16,
    borderRadius: 12,
  },
  createButtonDisabled: {
    backgroundColor: "#6b7280",
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginLeft: 8,
  },
});

export default CreateClientModal;
