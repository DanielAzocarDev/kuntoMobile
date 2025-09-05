import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  StatusBar,
  Animated,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";

const { width: screenWidth } = Dimensions.get("window");

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
    color: "#10b981",
  },
  {
    id: 3,
    icon: "people-outline",
    title: "Administración de Clientes",
    description:
      "Mantén una base de datos de tus clientes, sus historiales y preferencias.",
    color: "#3b82f6",
  },
  {
    id: 4,
    icon: "trending-up-outline",
    title: "Crecimiento y Más",
    description:
      "Herramientas adicionales para impulsar la eficiencia y expansión de tu negocio.",
    color: "#8b5cf6",
  },
];

const WelcomeScreen = () => {
  const navigate = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const fadeInAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeInAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeInAnim]);

  const renderCarouselItem = ({ item, index }: { item: any; index: number }) => {
    const inputRange = [
      (index - 1) * screenWidth,
      index * screenWidth,
      (index + 1) * screenWidth,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: "clamp",
    });

    return (
      <Animated.View style={[styles.carouselItemContainer, { transform: [{ scale }] }]}>
        <BlurView intensity={50} tint="dark" style={styles.carouselItem}>
          <View style={[styles.iconContainer, { backgroundColor: `${item.color}30` }]}>
            <Ionicons name={item.icon as any} size={48} color={item.color} />
          </View>
          <Text style={styles.carouselTitle}>{item.title}</Text>
          <Text style={styles.carouselDescription}>{item.description}</Text>
        </BlurView>
      </Animated.View>
    );
  };

  const handleViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient colors={["#0f172a", "#1e293b"]} style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <Animated.View style={[styles.header, { opacity: fadeInAnim }]}>
          <Ionicons name="aperture-outline" size={48} color="#f59e0b" style={styles.logo} />
          <Text style={styles.welcomeTitle}>
            Bienvenido a <Text style={styles.highlightText}>Kunto</Text>
          </Text>
          <Text style={styles.welcomeSubtitle}>
            La herramienta definitiva para potenciar tu negocio.
          </Text>
        </Animated.View>

        <View style={styles.carouselContainer}>
          <Animated.FlatList
            ref={flatListRef}
            data={carouselData}
            renderItem={renderCarouselItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            snapToInterval={screenWidth}
            snapToAlignment="center"
            decelerationRate="fast"
            onViewableItemsChanged={handleViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
          />
          <View style={styles.pagination}>
            {carouselData.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === activeIndex && [styles.paginationDotActive, { backgroundColor: carouselData[activeIndex].color }],
                ]}
              />
            ))}
          </View>
        </View>

        <Animated.View style={[styles.buttonContainer, { opacity: fadeInAnim }]}>
          <Pressable style={styles.joinButton} onPress={() => navigate.push("/register")}>
            <LinearGradient colors={["#f59e0b", "#d97706"]} style={styles.gradientButton}>
              <Ionicons name="person-add-outline" size={24} color="white" />
              <Text style={styles.joinButtonText}>Crear una cuenta</Text>
            </LinearGradient>
          </Pressable>
          <Pressable style={styles.loginButton} onPress={() => navigate.push("/login")}>
            <Text style={styles.loginButtonText}>¿Ya tienes una cuenta? Inicia Sesión</Text>
          </Pressable>
        </Animated.View>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    paddingTop: 80,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  logo: {
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  highlightText: {
    color: "#f59e0b",
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: "#cbd5e1",
    textAlign: "center",
    marginTop: 8,
  },
  carouselContainer: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 20,
  },
  carouselItemContainer: {
    width: screenWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselItem: {
    borderRadius: 24,
    padding: 30,
    alignItems: "center",
    width: screenWidth * 0.85,
    height: 300,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  carouselTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 12,
  },
  carouselDescription: {
    fontSize: 15,
    color: "#e2e8f0",
    textAlign: "center",
    lineHeight: 22,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#475569",
    marginHorizontal: 5,
  },
  paginationDotActive: {
    width: 24,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  joinButton: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gradientButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
  },
  joinButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 12,
  },
  loginButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  loginButtonText: {
    color: "#f59e0b",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default WelcomeScreen;
