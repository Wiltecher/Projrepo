import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Product } from '../types';
import { apiService } from '../services/api';
import Toast from 'react-native-toast-message';

type InventoryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Inventory'>;

interface Props {
  navigation: InventoryScreenNavigationProp;
}

const InventoryScreen: React.FC<Props> = ({ navigation }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadInventory = useCallback(async (search?: string) => {
    try {
      setLoading(true);
      const inventory = await apiService.getInventory(search);
      setProducts(inventory);
      setFilteredProducts(inventory);
    } catch (error) {
      console.error('Error loading inventory:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load inventory',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadInventory(searchQuery);
    setRefreshing(false);
  }, [loadInventory, searchQuery]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.sku.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [products]);

  const handleSearchSubmit = useCallback(async () => {
    await loadInventory(searchQuery);
  }, [loadInventory, searchQuery]);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  const isLowStock = (product: Product) => {
    return product.lowStockThreshold && product.qty <= product.lowStockThreshold;
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productItem}>
      <View style={styles.productHeader}>
        <Text style={styles.productName}>{item.name}</Text>
        {isLowStock(item) && (
          <View style={styles.lowStockBadge}>
            <Text style={styles.lowStockText}>LOW</Text>
          </View>
        )}
      </View>
      
      <View style={styles.productDetails}>
        <Text style={styles.productSku}>SKU: {item.sku}</Text>
        <Text style={styles.productQty}>
          Qty: <Text style={[styles.qtyNumber, isLowStock(item) && styles.lowStockQty]}>
            {item.qty}
          </Text>
        </Text>
      </View>
      
      {item.lowStockThreshold && (
        <Text style={styles.thresholdText}>
          Low stock threshold: {item.lowStockThreshold}
        </Text>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>
        {searchQuery ? 'No products found matching your search' : 'No products in inventory'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={handleSearch}
          onSubmitEditing={handleSearchSubmit}
          placeholder="Search products by name or SKU..."
          returnKeyType="search"
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearchSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : (
            <Text style={styles.searchButtonText}>🔍</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inventory ({filteredProducts.length} items)</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={onRefresh}
          disabled={refreshing}
        >
          <Text style={styles.refreshButtonText}>↻</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderProductItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    fontSize: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    padding: 8,
  },
  refreshButtonText: {
    fontSize: 20,
    color: '#007AFF',
  },
  listContainer: {
    padding: 16,
  },
  productItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  lowStockBadge: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  lowStockText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  productSku: {
    fontSize: 14,
    color: '#666',
  },
  productQty: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  qtyNumber: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  lowStockQty: {
    color: '#FF3B30',
  },
  thresholdText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default InventoryScreen;

