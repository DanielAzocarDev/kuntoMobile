import React, { useState, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppStore } from "../../store";

const { width: screenWidth } = Dimensions.get("window");

const quickActionsData = [
  {
    id: 1,
    icon: "cart-outline",
    title: "Productos",
    description: "Gestiona tu inventario",
    color: "#f59e0b",
  },
  {
    id: 2,
    icon: "cash-outline",
    title: "Ventas",
    description: "Registra nuevas ventas",
    color: "#f59e0b",
  },
  {
    id: 3,
    icon: "people-outline",
    title: "Clientes",
    description: "Administra tus clientes",
    color: "#f59e0b",
  },
  {
    id: 4,
    icon: "trending-up-outline",
    title: "Reportes",
    description: "Visualiza tus reportes",
    color: "#f59e0b",
  },
];

const ITEM_WIDTH = screenWidth * 0.8;
const ITEM_MARGIN_HORIZONTAL = 10;
const ITEM_FULL_WIDTH = ITEM_WIDTH + ITEM_MARGIN_HORIZONTAL * 2;
const SPACING = (screenWidth - ITEM_WIDTH) / 2;

export default function Dashboard() {
  const router = useRouter();
  const { user, token, logout } = useAppStore();

  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleLogout = () => {
    logout();
    router.replace("/welcome");
  };

  const [activeIndex, setActiveIndex] = useState(0);

  const handleViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  };

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

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
      <TouchableOpacity>
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
            style={[
              styles.iconContainer,
              { backgroundColor: `${item.color}20` },
            ]}
          >
            <Ionicons name={item.icon as any} size={48} color={item.color} />
          </View>
          <Text style={styles.carouselTitle}>{item.title}</Text>
          <Text style={styles.carouselDescription}>{item.description}</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
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
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.welcomeText}>
                Bienvenido, <Text style={styles.userName}>{user.name}</Text>
              </Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
            <TouchableOpacity
              onPress={handleLogout}
              style={styles.logoutButton}
            >
              <Ionicons name="log-out-outline" size={24} color="#f59e0b" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Dashboard Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* User Info Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons
                name="person-circle-outline"
                size={24}
                color="#f59e0b"
              />
              <Text style={styles.cardTitle}>Información del Usuario</Text>
            </View>
            <View style={styles.userInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>País:</Text>
                <Text style={styles.infoValue}>
                  {user.country || "No especificado"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Moneda:</Text>
                <Text style={styles.infoValue}>
                  {user.currency} ({user.currencySymbol})
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Rol:</Text>
                <Text style={styles.infoValue}>{user.role}</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions Carousel */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="flash-outline" size={24} color="#f59e0b" />
              <Text style={styles.cardTitle}>Acciones Rápidas</Text>
            </View>
            <Animated.FlatList
              ref={flatListRef}
              data={quickActionsData}
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
            <View style={styles.pagination}>
              {quickActionsData.map((_, index) => (
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

          {/* Token Info (for debugging) */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="key-outline" size={24} color="#f59e0b" />
              <Text style={styles.cardTitle}>Estado de Sesión</Text>
            </View>
            <View style={styles.tokenInfo}>
              <Text style={styles.tokenStatus}>
                Token: {token ? "✅ Activo" : "❌ No disponible"}
              </Text>
              <Text style={styles.tokenPreview}>
                {token ? `${token.substring(0, 20)}...` : "No hay token"}
              </Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 18,
    color: "#e5e7eb",
    marginBottom: 4,
  },
  userName: {
    color: "#f59e0b",
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 14,
    color: "#9ca3af",
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "rgb(30, 41, 59)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#e5e7eb",
    marginLeft: 12,
  },
  userInfo: {
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 14,
    color: "#9ca3af",
  },
  infoValue: {
    fontSize: 14,
    color: "#e5e7eb",
    fontWeight: "500",
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  actionButton: {
    width: "100%",
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.2)",
  },
  actionText: {
    color: "#f59e0b",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
  },
  tokenInfo: {
    gap: 8,
  },
  tokenStatus: {
    fontSize: 14,
    color: "#e5e7eb",
    fontWeight: "500",
  },
  tokenPreview: {
    fontSize: 12,
    color: "#9ca3af",
    fontFamily: "monospace",
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
    width: screenWidth * 0.78,
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
    backgroundColor: "#9ca3af",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#f59e0b",
    width: 16,
  },
});
