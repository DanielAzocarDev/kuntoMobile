import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({ title, onPress, variant = 'primary', loading = false, disabled = false, style }) => {
  const buttonStyle = [styles.button, styles[`${variant}Button`], (disabled || loading) && styles.disabledButton, style];
  const textStyle = [styles.text, styles[`${variant}Text`]];

  return (
    <TouchableOpacity onPress={onPress} style={buttonStyle} disabled={disabled || loading}>
      {loading ? <ActivityIndicator color={variant === 'primary' ? '#FFFFFF' : '#f59e0b'} /> : <Text style={textStyle}>{title}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primaryButton: {
    backgroundColor: '#f59e0b', // amber-400
  },
  secondaryButton: {
    backgroundColor: '#4B5563', // gray-600
  },
  disabledButton: {
    opacity: 0.7,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  primaryText: {
    color: '#fff', // gray-800
  },
  secondaryText: {
    color: '#FFFFFF',
  },
});
