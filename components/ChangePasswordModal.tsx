import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { changePassword } from "../api/auth";

interface ChangePasswordModalProps {
  isVisible: boolean;
  onClose: () => void;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export default function ChangePasswordModal({
  isVisible,
  onClose,
}: ChangePasswordModalProps) {
  const [formData, setFormData] = useState<ChangePasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "La contraseña actual es obligatoria";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "La nueva contraseña es obligatoria";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword =
        "La nueva contraseña debe tener al menos 8 caracteres";
    } else if (formData.newPassword.length > 100) {
      newErrors.newPassword =
        "La nueva contraseña no puede tener más de 100 caracteres";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      newErrors.newPassword =
        "La nueva contraseña debe contener al menos una letra minúscula, una mayúscula y un número";
    }

    if (!formData.confirmNewPassword) {
      newErrors.confirmNewPassword = "Confirma tu nueva contraseña";
    } else if (formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = "Las contraseñas deben coincidir";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const response = await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      if (response.success) {
        setIsSuccess(true);
        resetForm();
      }
    } catch (error: any) {
      console.error("Error changing password:", error);

      let errorMessage =
        "Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo más tarde.";

      if (error?.status === 401) {
        errorMessage =
          "Contraseña actual incorrecta. Por favor, verifica tu contraseña.";
      } else if (error?.status === 400) {
        errorMessage = "La nueva contraseña debe ser diferente a la actual.";
      } else if (error?.status === 500) {
        errorMessage =
          "Error del servidor. Por favor, inténtalo de nuevo más tarde.";
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setErrors({});
  };

  const handleClose = () => {
    if (isSuccess) {
      setIsSuccess(false);
      resetForm();
    }
    onClose();
  };

  if (isSuccess) {
    return (
      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModal}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark-circle" size={32} color="#10b981" />
            </View>
            <Text style={styles.successTitle}>¡Contraseña Actualizada!</Text>
            <Text style={styles.successMessage}>
              Tu contraseña ha sido actualizada exitosamente.
            </Text>
            <TouchableOpacity
              style={styles.successButton}
              onPress={handleClose}
            >
              <Text style={styles.successButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.headerContent}>
              <Ionicons name="lock-closed" size={24} color="#f59e0b" />
              <Text style={styles.modalTitle}>Cambiar Contraseña</Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña actual</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.currentPassword && styles.inputError,
                ]}
                value={formData.currentPassword}
                onChangeText={(text) => {
                  setFormData((prev) => ({ ...prev, currentPassword: text }));
                  if (errors.currentPassword)
                    setErrors((prev) => ({ ...prev, currentPassword: "" }));
                }}
                placeholder="••••••••"
                placeholderTextColor="#64748b"
                secureTextEntry
              />
              {errors.currentPassword && (
                <Text style={styles.errorText}>{errors.currentPassword}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nueva contraseña</Text>
              <TextInput
                style={[styles.input, errors.newPassword && styles.inputError]}
                value={formData.newPassword}
                onChangeText={(text) => {
                  setFormData((prev) => ({ ...prev, newPassword: text }));
                  if (errors.newPassword)
                    setErrors((prev) => ({ ...prev, newPassword: "" }));
                }}
                placeholder="••••••••"
                placeholderTextColor="#64748b"
                secureTextEntry
              />
              {errors.newPassword && (
                <Text style={styles.errorText}>{errors.newPassword}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar nueva contraseña</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.confirmNewPassword && styles.inputError,
                ]}
                value={formData.confirmNewPassword}
                onChangeText={(text) => {
                  setFormData((prev) => ({
                    ...prev,
                    confirmNewPassword: text,
                  }));
                  if (errors.confirmNewPassword)
                    setErrors((prev) => ({ ...prev, confirmNewPassword: "" }));
                }}
                placeholder="••••••••"
                placeholderTextColor="#64748b"
                secureTextEntry
              />
              {errors.confirmNewPassword && (
                <Text style={styles.errorText}>
                  {errors.confirmNewPassword}
                </Text>
              )}
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.updateButton,
                isLoading && styles.updateButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <Text style={styles.updateButtonText}>
                {isLoading ? "Actualizando..." : "Actualizar"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    width: "100%",
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 12,
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#cbd5e1",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#334155",
    borderWidth: 1,
    borderColor: "#475569",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    fontSize: 16,
  },
  inputError: {
    borderColor: "#ef4444",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
  },
  modalFooter: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#475569",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  updateButton: {
    flex: 1,
    backgroundColor: "#f59e0b",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  updateButtonDisabled: {
    backgroundColor: "#64748b",
  },
  updateButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  // Success modal styles
  successModal: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 30,
    alignItems: "center",
    maxWidth: 300,
  },
  successIconContainer: {
    width: 64,
    height: 64,
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#10b981",
    marginBottom: 8,
    textAlign: "center",
  },
  successMessage: {
    fontSize: 14,
    color: "#cbd5e1",
    textAlign: "center",
    marginBottom: 24,
  },
  successButton: {
    backgroundColor: "#f59e0b",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  successButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
