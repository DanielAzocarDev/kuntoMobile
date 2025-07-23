import React, { useState, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Linking,
  StatusBar,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";

const { width: screenWidth } = Dimensions.get("window");

// Datos del carrusel basados en las features de WelcomePage.tsx
const carouselData = [
  {
    id: 1,
    icon: "cart-outline",
    title: "Gestión de Productos",
    description:
      "Organiza tu inventario, precios y detalles de productos de forma sencilla e intuitiva.",
    color: "#f59e0b",
  },
  {
    id: 2,
    icon: "cash-outline",
    title: "Ventas e Ingresos",
    description:
      "Registra ventas, sigue tus ingresos en tiempo real y obtén reportes detallados.",
    color: "#f59e0b",
  },
  {
    id: 3,
    icon: "people-outline",
    title: "Administración de Clientes",
    description:
      "Mantén una base de datos de tus clientes, sus historiales y preferencias.",
    color: "#f59e0b",
  },
  {
    id: 4,
    icon: "trending-up-outline",
    title: "Crecimiento y Más",
    description:
      "Herramientas adicionales para impulsar la eficiencia y expansión de tu negocio.",
    color: "#f59e0b",
  },
];

const WelcomeScreen = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const renderCarouselItem = ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }) => {
    const inputRange = [
      (index - 1) * (screenWidth * 0.8 + 20),
      index * (screenWidth * 0.8 + 20),
      (index + 1) * (screenWidth * 0.8 + 20),
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: "clamp",
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.7, 1, 0.7],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        style={[
          styles.carouselItem,
          {
            transform: [{ scale }],
            opacity,
          },
        ]}
      >
        <View
          style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}
        >
          <Ionicons name={item.icon as any} size={48} color={item.color} />
        </View>
        <Text style={styles.carouselTitle}>{item.title}</Text>
        <Text style={styles.carouselDescription}>{item.description}</Text>
      </Animated.View>
    );
  };

  const handleViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const handleJoinWaitlist = () => {
    Linking.openURL(
      "https://docs.google.com/forms/d/e/1FAIpQLSe6uGQWZMPbfoADdgRniHypP-lKqfelsHporQrWdp6D-1QAGA/viewform?usp=header"
    );
  };

  const handleLogin = () => {
    // Aquí puedes navegar a la pantalla de login
    console.log("Navegar a login");
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient
        colors={["#0f172a", "#1e293b", "#334155"]}
        style={styles.container}
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeTitle}>
            Bienvenido a <Text style={styles.highlightText}>Kunto</Text>
          </Text>
        </View>

        {/* Carrusel - 80% de la pantalla */}
        <View style={styles.carouselContainer}>
          {/* <Text style={styles.welcomeTitle}>
            Bienvenido a <Text style={styles.highlightText}>Kunto</Text>
          </Text> */}
          <Text style={styles.welcomeSubtitle}>
            Descubre una forma revolucionaria de gestionar tus finanzas,
            organizar tus tareas y alcanzar tus metas.
          </Text>

          <Animated.FlatList
            ref={flatListRef}
            data={carouselData}
            renderItem={renderCarouselItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            snapToInterval={screenWidth * 0.8 + 20}
            snapToAlignment="center"
            decelerationRate="fast"
            contentContainerStyle={styles.carouselContent}
            onViewableItemsChanged={handleViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
          />

          {/* Indicadores de página */}
          <View style={styles.pagination}>
            {carouselData.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === activeIndex && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Botones - 20% de la pantalla */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.joinButton}
            onPress={handleJoinWaitlist}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#f59e0b", "#d97706"]}
              style={styles.gradientButton}
            >
              <Ionicons name="gift-outline" size={24} color="white" />
              <Text style={styles.joinButtonText}>
                Únete a la Lista de Espera
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <BlurView intensity={20} style={styles.blurButton}>
              <Ionicons name="log-in-outline" size={20} color="#f59e0b" />
              <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
            </BlurView>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            ¿Ya tienes una cuenta?{" "}
            <Text style={styles.linkText} onPress={handleLogin}>
              Inicia Sesión Aquí
            </Text>
          </Text>
        </View>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 100,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  logo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#f59e0b",
    textAlign: "center",
  },
  carouselContainer: {
    flex: 0.8,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 10,
  },
  highlightText: {
    color: "#f59e0b",
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#cbd5e1",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },
  carouselContent: {
    paddingHorizontal: 10,
  },
  carouselItem: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    marginHorizontal: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    minHeight: 200,
    width: screenWidth * 0.8,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  carouselTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 10,
  },
  carouselDescription: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#475569",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#f59e0b",
    width: 24,
  },
  buttonContainer: {
    flex: 0.2,
    paddingHorizontal: 20,
    paddingBottom: 40,
    justifyContent: "space-between",
  },
  joinButton: {
    marginBottom: 15,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gradientButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  joinButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  loginButton: {
    marginBottom: 15,
    borderRadius: 12,
    overflow: "hidden",
  },
  blurButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  loginButtonText: {
    color: "#f59e0b",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  footerText: {
    color: "#94a3b8",
    textAlign: "center",
    fontSize: 14,
  },
  linkText: {
    color: "#f59e0b",
    fontWeight: "bold",
  },
});

export default WelcomeScreen;
