import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { Link, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { forgotPassword } from "@/api/auth";
import { Button } from "@/components/common/Button";
import { ControlledInput } from "@/components/common/ControlledInput";
import { Toast } from "@/components/common/Toast";
import { useToast } from "@/hooks/useToast";
import { IForgotPassword } from "@/interfaces/auth.interfaces";
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
  email: yup
    .string()
    .email("Debe ser un correo electrónico válido")
    .required("El correo electrónico es obligatorio"),
});

export default function ForgotPassword() {
  const { toast, showToast, hideToast } = useToast();
  const router = useRouter();

  const { control, handleSubmit } = useForm<IForgotPassword>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      router.push("/login");
      showToast("success", "Se ha enviado un correo para restablecer tu contraseña");
    },
    onError: (error: any) => {
      showToast("error", error.response?.data?.message || "Ha ocurrido un error inesperado");
    },
  });

  const onSubmit = (data: IForgotPassword) => {
    mutate(data);
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
            <Ionicons name="key-outline" size={48} color="#f59e0b" />
            <Text style={styles.title}>Restablecer Contraseña</Text>
            <Text style={styles.subtitle}>
              Ingresa tu correo para recibir un enlace de restablecimiento.
            </Text>
          </View>

          <View style={styles.formContainer}>
            <ControlledInput
              control={control}
              name="email"
              label="Correo Electrónico"
              placeholder="tu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.buttonContainer}>
              <Button
                title="Enviar Enlace"
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
  buttonContainer: {
    marginTop: 16,
  },
});
