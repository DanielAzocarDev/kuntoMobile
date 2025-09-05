import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useMutation } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { registerUser } from "../../api/auth";
import type { IRegisterUser, ApiError } from "../../interfaces/auth.interfaces";
import { Country } from "../../api/countries";
import Step1Personal from "../../components/register/Step1Personal";
import Step2Security from "../../components/register/Step2Security";
import Step3Location from "../../components/register/Step3Location";
import Step4Finalize from "../../components/register/Step4Finalize";
import ProgressBar from "../../components/register/ProgressBar";

export default function Register() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 State
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");

  // Step 2 State
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 3 State
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState<Country | null>(null);

  // Step 4 State
  const [acceptTerms, setAcceptTerms] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: IRegisterUser) => registerUser(payload),
    onSuccess: (data) => {
      Alert.alert("Registro exitoso", "Tu cuenta ha sido creada y está pendiente de aprobación. Te notificaremos por correo electrónico.");
      router.replace("/login");
    },
    onError: (error: ApiError) => {
      const message = error.response?.data?.message || "Ha ocurrido un error inesperado.";
      Alert.alert("Error en el registro", message);
    },
    onMutate: () => {
      Alert.alert("Creando cuenta", "Por favor espera...");
    },
  });

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const validatePassword = (password: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!name || !lastname || !email) {
        Alert.alert("Error", "Por favor completa todos los campos.");
        return;
      }
      if (!validateEmail(email)) {
        Alert.alert("Error", "Por favor ingresa un correo electrónico válido.");
        return;
      }
    }
    if (currentStep === 2) {
      if (!password || !confirmPassword) {
        Alert.alert("Error", "Por favor completa todos los campos.");
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert("Error", "Las contraseñas no coinciden.");
        return;
      }
      if (!validatePassword(password)) {
        Alert.alert("Error", "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.");
        return;
      }
    }
    if (currentStep === 3) {
      if (!country) {
        Alert.alert("Error", "Por favor selecciona un país.");
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    if (!acceptTerms) {
      Alert.alert("Error", "Debes aceptar los términos y condiciones para continuar.");
      return;
    }
    if (!country) {
      Alert.alert("Error", "Ha ocurrido un error, por favor regresa y selecciona un país.");
      return;
    }

    const payload: IRegisterUser = {
      name,
      lastname,
      email,
      password,
      country,
      acceptTerms,
      businessName: businessName || undefined,
      phone: phone || undefined,
      city: city || undefined,
    };

    mutate(payload);
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
            <View style={styles.header}>
              <Ionicons
                name="person-add"
                size={48}
                color="#f59e0b"
                style={styles.icon}
              />
              <Text style={styles.welcomeTitle}>Crear Cuenta</Text>
              <Text style={styles.subtitle}>
                Únete a Kunto para potenciar tu negocio
              </Text>
            </View>

            <View style={styles.form}>
              <ProgressBar currentStep={currentStep} totalSteps={4} />
              {currentStep === 1 && <Step1Personal name={name} setName={setName} lastname={lastname} setLastname={setLastname} email={email} setEmail={setEmail} />}
              {currentStep === 2 && <Step2Security password={password} setPassword={setPassword} confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword} />}
              {currentStep === 3 && <Step3Location businessName={businessName} setBusinessName={setBusinessName} phone={phone} setPhone={setPhone} city={city} setCity={setCity} country={country} setCountry={setCountry} />}
              {currentStep === 4 && <Step4Finalize acceptTerms={acceptTerms} setAcceptTerms={setAcceptTerms} />}

              <View style={styles.navigationButtons}>
                {currentStep > 1 && (
                  <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                    <Text style={styles.backButtonText}>Atrás</Text>
                  </TouchableOpacity>
                )}
                {currentStep < 4 ? (
                  <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                    <Text style={styles.nextButtonText}>Siguiente</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={[styles.submitButton, isPending && styles.submitButtonDisabled]} onPress={handleSubmit} disabled={isPending}>
                    <Text style={styles.submitButtonText}>{isPending ? 'Creando cuenta...' : 'Crear Cuenta'}</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
                <TouchableOpacity onPress={() => router.push("/login")}>
                  <Text style={styles.loginLink}>Inicia Sesión</Text>
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
    navigationButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    backButton: {
        backgroundColor: '#334155',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    backButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    nextButton: {
        backgroundColor: '#f59e0b',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 8,
        flex: 1,
        marginLeft: 10
    },
    nextButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
  submitButtonDisabled: {
    backgroundColor: "#4b5563",
    opacity: 0.7,
  },
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
  header: {
    alignItems: "center",
    marginBottom: 30,
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
  },
  submitButton: {
    backgroundColor: "#f59e0b",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    flex: 1,
    marginLeft: 10
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  loginText: {
    fontSize: 14,
    color: "#9ca3af",
  },
  loginLink: {
    fontSize: 14,
    color: "#f59e0b",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
