import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Controller, Control } from 'react-hook-form';

interface ControlledInputProps extends TextInputProps {
  control: Control<any>;
  name: string;
  label: string;
}

export const ControlledInput: React.FC<ControlledInputProps> = ({ control, name, label, ...props }) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={styles.container}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            style={[styles.input, error && styles.inputError]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholderTextColor="#6B7280"
            {...props}
          />
          {error && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    color: '#D1D5DB', // gray-300
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#374151', // gray-700
    color: '#F9FAFB', // gray-50
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4B5563', // gray-600
    fontSize: 16,
  },
  inputError: {
    borderColor: '#F87171', // red-400
  },
  errorText: {
    color: '#F87171', // red-400
    marginTop: 4,
    fontSize: 12,
  },
});
