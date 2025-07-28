import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../../api/auth";
import { useAppStore } from "../../store";
import type { ILoginUser, ApiError } from "../../interfaces/auth.interfaces";
import { Ionicons } from "@expo/vector-icons";

export default function Login() {
  const router = useRouter();
  const login = useAppStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: ILoginUser) => loginUser(payload),
    onSuccess: (data) => {
      console.log("Usuario logueado con éxito", data);
      login({
        token: data.data.token,
        user: data.data.user,
      });

      // Redirigir a la ruta raíz, el layout de auth se encargará del resto
      router.replace("/");
    },
    onError: (error: ApiError) => {
      console.error("Error al loguear el usuario", error);
      const message = getErrorMessage(error);
      Alert.alert("Error al iniciar sesión", message);
    },
  });

  const getErrorMessage = (err: ApiError): string => {
    const status = err.status;
    switch (status) {
      case 401:
        return "Credenciales inválidas. Por favor, verifica tu correo electrónico y contraseña.";
      case 403:
        return "Por favor, verifica tu email antes de iniciar sesión. Revisa tu bandeja de entrada o solicita un nuevo enlace de verificación.";
      case 404:
        return "Usuario no encontrado. Por favor, verifica tu correo electrónico.";
      case 500:
        return "Error del servidor. Por favor, inténtalo de nuevo más tarde.";
      default:
        return (
          err.response?.data?.message ||
          "Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo más tarde."
        );
    }
  };

  const handleSubmit = () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Error", "Por favor ingresa un correo electrónico válido");
      return;
    }

    mutate({ email, password });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient
        colors={["#0f172a", "#1e293b", "#334155"]}
        style={styles.container}
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* Loading Overlay */}
            {isPending && (
              <View style={styles.loadingOverlay}>
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#f59e0b" />
                  <Text style={styles.loadingText}>Iniciando sesión...</Text>
                </View>
              </View>
            )}

            {/* Header */}
            <View style={styles.header}>
              <Ionicons
                name="log-in"
                size={48}
                color="#f59e0b"
                style={styles.icon}
              />
              <Text style={styles.welcomeTitle}>Iniciar Sesión</Text>
              <Text style={styles.subtitle}>
                Accede a tu cuenta para continuar
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Correo electrónico</Text>
                <TextInput
                  style={styles.input}
                  placeholder="tu@email.com"
                  placeholderTextColor="#6b7280"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Contraseña</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="••••••••"
                    placeholderTextColor="#6b7280"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off" : "eye"}
                      size={20}
                      color="#6b7280"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password Link */}
              <TouchableOpacity style={styles.forgotPasswordContainer}>
                <Text style={styles.forgotPasswordText}>
                  ¿Olvidaste tu contraseña?
                </Text>
              </TouchableOpacity>

              {/* Submit Button */}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  isPending && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={isPending}
              >
                <Text style={styles.submitButtonText}>
                  {isPending ? "Iniciando..." : "Iniciar Sesión"}
                </Text>
              </TouchableOpacity>

              {/* Register Link */}
              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>¿No tienes una cuenta? </Text>
                <TouchableOpacity>
                  <Text style={styles.registerLink}>Regístrate aquí</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingContainer: {
    backgroundColor: "#1e293b",
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  loadingText: {
    color: "#d1d5db",
    fontSize: 16,
    marginTop: 12,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  icon: {
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#f59e0b",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#9ca3af",
    textAlign: "center",
  },
  form: {
    backgroundColor: "rgb(30, 41, 59)",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#d1d5db",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#374151",
    borderWidth: 1,
    borderColor: "#4b5563",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#e5e7eb",
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#374151",
    borderWidth: 1,
    borderColor: "#4b5563",
    borderRadius: 8,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#e5e7eb",
    fontSize: 16,
  },
  eyeButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#f59e0b",
    textDecorationLine: "underline",
  },
  submitButton: {
    backgroundColor: "#f59e0b",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: "#4b5563",
    opacity: 0.7,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 24,
  },
  registerText: {
    fontSize: 14,
    color: "#9ca3af",
  },
  registerLink: {
    fontSize: 14,
    color: "#f59e0b",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
