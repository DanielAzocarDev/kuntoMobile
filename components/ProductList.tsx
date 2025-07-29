import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppStore } from "../store";
import { IProduct } from "../interfaces/product.interfaces";

interface ProductListProps {
  products: IProduct[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onSearch,
  searchQuery,
}) => {
  const { addToCart } = useAppStore();

  const handleAddToCart = (product: IProduct) => {
    addToCart(product, 1);
  };

  const renderProduct = ({ item }: { item: IProduct }) => (
    <View style={styles.productCard}>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.productPrice}>${item.price.toLocaleString()}</Text>
        <Text style={styles.productStock}>Stock: {item.quantity}</Text>
      </View>

      <TouchableOpacity
        style={styles.addToCartButton}
        onPress={() => handleAddToCart(item)}
        disabled={item.quantity <= 0}
      >
        <Ionicons
          name="add-circle-outline"
          size={24}
          color={item.quantity > 0 ? "#f59e0b" : "#6b7280"}
        />
      </TouchableOpacity>
    </View>
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[
            styles.paginationButton,
            currentPage === 1 && styles.paginationButtonDisabled,
          ]}
          onPress={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <Ionicons
            name="chevron-back"
            size={20}
            color={currentPage === 1 ? "#6b7280" : "#f59e0b"}
          />
          {/* <Text
            style={[
              styles.paginationText,
              currentPage === 1 && styles.paginationTextDisabled,
            ]}
          >
            Anterior
          </Text> */}
        </TouchableOpacity>

        <View style={styles.pageInfo}>
          <Text style={styles.pageInfoText}>
            Página {currentPage} de {totalPages}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.paginationButton,
            currentPage === totalPages && styles.paginationButtonDisabled,
          ]}
          onPress={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          {/* <Text
            style={[
              styles.paginationText,
              currentPage === totalPages && styles.paginationTextDisabled,
            ]}
          >
            Siguiente
          </Text> */}
          <Ionicons
            name="chevron-forward"
            size={20}
            color={currentPage === totalPages ? "#6b7280" : "#f59e0b"}
          />
        </TouchableOpacity>
      </View>
    );
  };

  if (isLoading && products.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f59e0b" />
        <Text style={styles.loadingText}>Cargando productos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="cube-outline" size={24} color="#f59e0b" />
        <Text style={styles.headerTitle}>Productos</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#9ca3af" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar productos..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={onSearch}
        />
      </View>

      <View style={styles.listContainer}>
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          style={styles.productList}
          contentContainerStyle={styles.productListContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="cube-outline" size={48} color="#9ca3af" />
              <Text style={styles.emptyText}>
                {searchQuery
                  ? "No se encontraron productos"
                  : "No hay productos disponibles"}
              </Text>
            </View>
          }
        />
      </View>

      {renderPagination()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#e5e7eb",
    marginLeft: 12,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 14,
    color: "#e5e7eb",
  },
  listContainer: {
    flex: 1,
    minHeight: 300,
  },
  productList: {
    flex: 1,
  },
  productListContent: {
    flexGrow: 1,
  },
  productCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(156, 163, 175, 0.2)",
  },
  productInfo: {
    flex: 1,
    marginRight: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#e5e7eb",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f59e0b",
    marginBottom: 2,
  },
  productStock: {
    fontSize: 12,
    color: "#9ca3af",
  },
  addToCartButton: {
    padding: 8,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  loadingText: {
    color: "#9ca3af",
    marginLeft: 8,
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 12,
    textAlign: "center",
  },
  paginationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(156, 163, 175, 0.2)",
  },
  paginationButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "rgba(245, 158, 11, 0.1)",
  },
  paginationButtonDisabled: {
    backgroundColor: "rgba(107, 114, 128, 0.1)",
  },
  paginationText: {
    fontSize: 14,
    color: "#f59e0b",
    marginHorizontal: 4,
  },
  paginationTextDisabled: {
    color: "#6b7280",
  },
  pageInfo: {
    alignItems: "center",
  },
  pageInfoText: {
    fontSize: 14,
    color: "#9ca3af",
  },
});

export default ProductList;
