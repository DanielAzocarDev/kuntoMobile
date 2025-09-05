import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

interface Step2SecurityProps {
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
}

export default function Step2Security({ password, setPassword, confirmPassword, setConfirmPassword }: Step2SecurityProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Contraseña</Text>
        <PasswordStrengthIndicator password={password} />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="••••••••"
            placeholderTextColor="#6b7280"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
            <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirmar Contraseña</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="••••••••"
            placeholderTextColor="#6b7280"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeButton}>
            <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 15,
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
  },
});
