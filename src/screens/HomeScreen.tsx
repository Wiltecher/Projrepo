import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Invoice } from '../types';
import { apiService } from '../services/api';
import Toast from 'react-native-toast-message';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadRecentInvoices = async () => {
    try {
      setLoading(true);
      const invoices = await apiService.getRecentInvoices();
      setRecentInvoices(invoices);
    } catch (error) {
      console.error('Error loading recent invoices:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load recent invoices',
      });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRecentInvoices();
    setRefreshing(false);
  };

  useEffect(() => {
    loadRecentInvoices();
  }, []);

  const handleScanPress = () => {
    navigation.navigate('Camera');
  };

  const handleInventoryPress = () => {
    navigation.navigate('Inventory');
  };

  const handleInvoicePress = (invoice: Invoice) => {
    // For now, just show invoice details
    Alert.alert(
      'Invoice Details',
      `Vendor: ${invoice.vendor}\nDate: ${invoice.date}\nTotal: $${invoice.total.toFixed(2)}`,
    );
  };

  const renderInvoiceItem = ({ item }: { item: Invoice }) => (
    <TouchableOpacity
      style={styles.invoiceItem}
      onPress={() => handleInvoicePress(item)}
    >
      <View style={styles.invoiceHeader}>
        <Text style={styles.vendorName}>{item.vendor}</Text>
        <Text style={styles.invoiceTotal}>${item.total.toFixed(2)}</Text>
      </View>
      <Text style={styles.invoiceDate}>{item.date}</Text>
      {item.duplicateOfId && (
        <Text style={styles.duplicateLabel}>Duplicate</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Invoice Scanner</Text>
        <Text style={styles.subtitle}>Scan invoices and manage inventory</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.scanButton} onPress={handleScanPress}>
          <Text style={styles.scanButtonText}>📷 Scan Invoice</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.inventoryButton} onPress={handleInventoryPress}>
          <Text style={styles.inventoryButtonText}>📦 View Inventory</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Recent Invoices</Text>
        <FlatList
          data={recentInvoices}
          keyExtractor={(item) => item.id}
          renderItem={renderInvoiceItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No recent invoices</Text>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: 30,
  },
  scanButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scanButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  inventoryButton: {
    backgroundColor: '#34C759',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inventoryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  recentSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  invoiceItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  invoiceTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  invoiceDate: {
    fontSize: 14,
    color: '#666',
  },
  duplicateLabel: {
    fontSize: 12,
    color: '#FF3B30',
    fontWeight: '600',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 40,
  },
});

export default HomeScreen;

