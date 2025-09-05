import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

interface Step1PersonalProps {
  name: string;
  setName: (name: string) => void;
  lastname: string;
  setLastname: (lastname: string) => void;
  email: string;
  setEmail: (email: string) => void;
}

export default function Step1Personal({ name, setName, lastname, setLastname, email, setEmail }: Step1PersonalProps) {
  return (
    <View>
      <View style={styles.inputRow}>
        <View style={[styles.inputContainer, styles.inputHalf]}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            placeholder="John"
            placeholderTextColor="#6b7280"
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={[styles.inputContainer, styles.inputHalf]}>
          <Text style={styles.label}>Apellido</Text>
          <TextInput
            style={styles.input}
            placeholder="Doe"
            placeholderTextColor="#6b7280"
            value={lastname}
            onChangeText={setLastname}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="john.doe@example.com"
          placeholderTextColor="#6b7280"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
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
