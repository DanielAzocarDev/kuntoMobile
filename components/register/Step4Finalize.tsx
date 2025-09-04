import React from 'react';
import { View, Text, StyleSheet, Switch, Linking } from 'react-native';

interface Step4FinalizeProps {
  acceptTerms: boolean;
  setAcceptTerms: (value: boolean) => void;
}

const Step4Finalize: React.FC<Step4FinalizeProps> = ({ acceptTerms, setAcceptTerms }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Finalizar Registro</Text>
      <View style={styles.termsContainer}>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={acceptTerms ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={setAcceptTerms}
          value={acceptTerms}
        />
        <Text style={styles.termsText}>
          Acepto los{' '}
          <Text style={styles.link} onPress={() => Linking.openURL('#')}>
            términos y condiciones
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#e5e7eb',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  termsText: {
    marginLeft: 10,
    color: '#d1d5db',
    fontSize: 16,
  },
  link: {
    color: '#60a5fa',
    textDecorationLine: 'underline',
  },
});

export default Step4Finalize;
