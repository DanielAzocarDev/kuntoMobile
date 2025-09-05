import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, ActivityIndicator } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { getCountries, Country } from "../../api/countries";

interface Step3LocationProps {
  businessName: string;
  setBusinessName: (name: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  city: string;
  setCity: (city: string) => void;
  country: Country | null;
  setCountry: (country: Country | null) => void;
}

export default function Step3Location({ businessName, setBusinessName, phone, setPhone, city, setCity, country, setCountry }: Step3LocationProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await getCountries();
        if (response.success) {
          setCountries(response.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return (
    <View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nombre del Negocio (Opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Mi Tienda C.A."
          placeholderTextColor="#6b7280"
          value={businessName}
          onChangeText={setBusinessName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Teléfono (Opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="+123456789"
          placeholderTextColor="#6b7280"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputRow}>
        <View style={[styles.inputContainer, styles.inputHalf]}>
          <Text style={styles.label}>Ciudad (Opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Caracas"
            placeholderTextColor="#6b7280"
            value={city}
            onChangeText={setCity}
          />
        </View>
        <View style={[styles.inputContainer, styles.inputHalf]}>
          <Text style={styles.label}>País</Text>
          {isLoading ? (
            <ActivityIndicator color="#e5e7eb" />
          ) : (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={country ? JSON.stringify(country) : ""}
                onValueChange={(itemValue) => {
                  if (itemValue) {
                    setCountry(JSON.parse(itemValue as string));
                  } else {
                    setCountry(null);
                  }
                }}
                style={styles.picker}
                dropdownIconColor="#e5e7eb"
              >
                <Picker.Item label="Selecciona un país..." value="" />
                {countries.map((c) => (
                  <Picker.Item key={c.code} label={c.name} value={JSON.stringify(c)} />
                ))}
              </Picker>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    backgroundColor: "#374151",
    borderWidth: 1,
    borderColor: "#4b5563",
    borderRadius: 8,
  },
  picker: {
    color: "#e5e7eb",
    height: 50,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputHalf: {
    width: '48%',
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
});