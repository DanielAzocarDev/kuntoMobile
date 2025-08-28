import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { Link, useRouter, useLocalSearchParams } from "expo-router";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { resetPassword } from "@/api/auth";
import { Button } from "@/components/common/Button";
import { ControlledInput } from "@/components/common/ControlledInput";
import { Toast } from "@/components/common/Toast";
import { useToast } from "@/hooks/useToast";
import { IResetPassword } from "@/interfaces/auth.interfaces";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

const schema = yup.object().shape({
  password: yup
    .string()
    .required("La contraseña es requerida")
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
  confirmPassword: yup
    .string()
    .required("Por favor confirme su contraseña")
    .oneOf([yup.ref("password")], "Las contraseñas no coinciden"),
});

type FormData = yup.InferType<typeof schema>;

export default function ResetPassword() {
  const { toast, showToast, hideToast } = useToast();
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token: string }>();

  const { control, handleSubmit } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      router.push("/login");
      showToast("success", "Tu contraseña ha sido restablecida exitosamente");
    },
    onError: (error: any) => {
      showToast("error", error.response?.data?.message || "Ha ocurrido un error inesperado");
    },
  });

  const onSubmit = (data: FormData) => {
    if (!token) {
      showToast("error", "Token no válido o expirado");
      return;
    }
    mutate({ password: data.password, token });
  };

  return (
    <LinearGradient
      colors={["#0f172a", "#1e293b", "#334155"]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Ionicons name="lock-closed-outline" size={48} color="#f59e0b" />
            <Text style={styles.title}>Crear Nueva Contraseña</Text>
            <Text style={styles.subtitle}>
              Ingresa tu nueva contraseña a continuación.
            </Text>
          </View>

          <View style={styles.formContainer}>
            <ControlledInput
              control={control}
              name="password"
              label="Nueva Contraseña"
              placeholder="••••••••"
              secureTextEntry
            />
            <View style={styles.inputSpacing} />
            <ControlledInput
              control={control}
              name="confirmPassword"
              label="Confirmar Contraseña"
              placeholder="••••••••"
              secureTextEntry
            />

            <View style={styles.buttonContainer}>
              <Button
                title="Restablecer Contraseña"
                onPress={handleSubmit(onSubmit)}
                loading={isPending}
                disabled={isPending}
              />
            </View>

            <View style={styles.buttonContainer}>
              <Link href="/login" asChild>
                <Button title="Volver al Inicio de Sesión" variant="secondary" />
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {toast.visible && (
        <Toast
          type={toast.type}
          message={toast.message}
          onHide={hideToast}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#f59e0b",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#9ca3af",
    textAlign: "center",
    maxWidth: "80%",
  },
  formContainer: {
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
  inputSpacing: {
    height: 16,
  },
  buttonContainer: {
    marginTop: 16,
  },
});
