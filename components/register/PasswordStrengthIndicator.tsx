import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PasswordStrengthIndicatorProps {
  password?: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password = '' }) => {
  const calculateStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    return score;
  };

  const strength = calculateStrength();
  const strengthText = ['Muy Débil', 'Débil', 'Normal', 'Fuerte', 'Muy Fuerte'][strength];
  const barColor = ['#ef4444', '#ef4444', '#f97316', '#f59e0b', '#22c55e'][strength];

  return (
    <View style={styles.container}>
        <View style={styles.barsContainer}>
            {Array.from({ length: 4 }).map((_, index) => (
            <View
                key={index}
                style={[
                styles.bar,
                { backgroundColor: index < strength ? barColor : '#334155' },
                ]}
            />
            ))}
        </View>
        <Text style={[styles.strengthText, { color: barColor }]}>{strengthText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    alignItems: 'flex-start',
  },
  barsContainer: {
    flexDirection: 'row',
    height: 6,
    width: '100%',
    borderRadius: 3,
    backgroundColor: '#334155',
    overflow: 'hidden',
  },
  bar: {
    flex: 1,
    height: '100%',
  },
  strengthText: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default PasswordStrengthIndicator;
