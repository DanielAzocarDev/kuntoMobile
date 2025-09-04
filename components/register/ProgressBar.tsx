import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.stepText}>{`Paso ${currentStep} de ${totalSteps}`}</Text>
      <View style={styles.progressBarContainer}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.stepIndicator,
              index < currentStep ? styles.activeStep : styles.inactiveStep,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  stepText: {
    color: '#e5e7eb',
    fontSize: 16,
    marginBottom: 10,
  },
  progressBarContainer: {
    flexDirection: 'row',
    height: 10,
    width: '80%',
    backgroundColor: '#334155',
    borderRadius: 5,
    overflow: 'hidden',
  },
  stepIndicator: {
    flex: 1,
  },
  activeStep: {
    backgroundColor: '#f59e0b',
  },
  inactiveStep: {
    backgroundColor: 'transparent',
  },
});

export default ProgressBar;
