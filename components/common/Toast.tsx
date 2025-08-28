import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onHide: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onHide }) => {
  const insets = useSafeAreaInsets();
  const translateY = new Animated.Value(-100);

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: insets.top,
      duration: 300,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start(() => onHide());
    }, 3000);

    return () => clearTimeout(timer);
  }, [insets.top, onHide, translateY]);

  const toastStyle = [
    styles.toast,
    styles[`${type}Toast`],
  ];

  return (
    <Animated.View style={[toastStyle, { transform: [{ translateY }] }]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingTop: 16, // Extra padding will be added by safe area
    marginHorizontal: 16,
    borderRadius: 8,
  },
  successToast: {
    backgroundColor: '#10B981', // Emerald-500
  },
  errorToast: {
    backgroundColor: '#EF4444', // Red-500
  },
  infoToast: {
    backgroundColor: '#3B82F6', // Blue-500
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
});
