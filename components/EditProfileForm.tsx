import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useQuery } from "@tanstack/react-query";
import { useAppStore } from "../store";
import { updateUserProfile } from "../api/user";
import { getCountries } from "../api/countries";

interface Country {
  code: string;
  name: string;
  currency: string;
  currencyCode: string;
  currencySymbol: string;
}

interface UpdateProfilePayload {
  name: string;
  email: string;
  country: string;
  currency: string;
  currencySymbol: string;
}

export default function EditProfileForm() {
  const user = useAppStore((state) => state.user);
  const updateUserInStore = useAppStore((state) => state.updateUser);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    country: user?.country || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const {
    data: countries = [],
    isLoading: isLoadingCountries,
    error: countriesError,
  } = useQuery({
    queryKey: ["countries"],
    queryFn: getCountries,
  });

  // Manejar errores de países
  React.useEffect(() => {
    if (countriesError) {
      console.error("Error loading countries:", countriesError);
      Alert.alert("Error", "No se pudieron cargar los países");
    }
  }, [countriesError]);

  console.log(countries.data);
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.country) {
      newErrors.country = "El país es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const selectedCountry = countries.data.find(
        (c: Country) => c.name === formData.country
      );
      if (!selectedCountry) {
        Alert.alert("Error", "País seleccionado no válido");
        return;
      }

      const payload: UpdateProfilePayload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        country: selectedCountry.name,
        currency: selectedCountry.currency,
        currencySymbol: selectedCountry.currencySymbol,
      };

      const response = await updateUserProfile(payload);

      if (response.success) {
        // Actualizar el usuario en el store
        updateUserInStore(
          selectedCountry.name,
          selectedCountry.currency,
          selectedCountry.currencySymbol
        );
        Alert.alert("Éxito", "Perfil actualizado con éxito");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Hubo un error al actualizar tu perfil");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Editar Perfil</Text>
        <Text style={styles.subtitle}>Actualiza tus datos personales</Text>
      </View>

      <ScrollView style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={formData.name}
            onChangeText={(text) => {
              setFormData((prev) => ({ ...prev, name: text }));
              if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
            }}
            placeholder="Ingresa tu nombre"
            placeholderTextColor="#64748b"
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            value={formData.email}
            onChangeText={(text) => {
              setFormData((prev) => ({ ...prev, email: text }));
              if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
            }}
            placeholder="Ingresa tu email"
            placeholderTextColor="#64748b"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>País</Text>
          <View
            style={[
              styles.pickerContainer,
              errors.country && styles.inputError,
            ]}
          >
            <Picker
              selectedValue={formData.country}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, country: value }));
                if (errors.country)
                  setErrors((prev) => ({ ...prev, country: "" }));
              }}
              style={styles.picker}
              enabled={!isLoadingCountries}
            >
              <Picker.Item
                label={
                  isLoadingCountries ? "Cargando..." : "Selecciona un país"
                }
                value=""
              />
              {countries.data &&
                countries.data.map((country: Country) => (
                  <Picker.Item
                    key={country.code}
                    label={`${country.name} (${country.currencySymbol})`}
                    value={country.name}
                    color="#fff"
                  />
                ))}
            </Picker>
          </View>
          {errors.country && (
            <Text style={styles.errorText}>{errors.country}</Text>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            isLoading && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.submitButtonText}>
            {isLoading ? "Guardando..." : "Guardar Cambios"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#94a3b8",
  },
  form: {
    flex: 1,
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
  pickerContainer: {
    backgroundColor: "#334155",
    borderWidth: 1,
    borderColor: "#475569",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    color: "#fff",
    backgroundColor: "transparent",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: "#f59e0b",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: "#64748b",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
