// SKU scanner screen for scanning individual product barcodes
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { CameraCapture } from '../components/CameraCapture';
import { SKUItem } from '../../shared/schema';

type NavigationProp = StackNavigationProp<RootStackParamList, 'SKUScanner'>;
type RouteProp = RouteProp<RootStackParamList, 'SKUScanner'>;

// Mock SKU data with realistic product information
const mockSKUItems: SKUItem[] = [
  {
    id: '1',
    name: 'Nike Air Max 90',
    brand: 'Nike',
    color: 'White/Black',
    size: '10',
    quantity: 2,
    scannedQuantity: 0,
    batchNumber: 'NK-2024-001',
    expiryDate: '2025-12-31',
    cost: 129.99,
    shelfLocation: 'A1-001'
  },
  {
    id: '2',
    name: 'Adidas Ultraboost 22',
    brand: 'Adidas',
    color: 'Core Black',
    size: '9',
    quantity: 1,
    scannedQuantity: 0,
    batchNumber: 'AD-2024-002',
    expiryDate: '2025-11-30',
    cost: 189.99,
    shelfLocation: 'A1-002'
  },
  {
    id: '3',
    name: 'Puma RS-X',
    brand: 'Puma',
    color: 'Gray/Blue',
    size: '10.5',
    quantity: 1,
    scannedQuantity: 0,
    batchNumber: 'PM-2024-003',
    expiryDate: '2025-10-31',
    cost: 99.99,
    shelfLocation: 'A1-003'
  }
];

export const SKUScannerScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp>();
  const [items, setItems] = useState(mockSKUItems);
  const [activeTab, setActiveTab] = useState<'pending' | 'scanned'>('pending');
  const [showCamera, setShowCamera] = useState(true);

  const { toteId } = route.params;

  const pendingItems = items.filter(item => item.scannedQuantity < item.quantity);
  const scannedItems = items.filter(item => item.scannedQuantity > 0);

  const handleBarcodeScanned = (data: string) => {
    // Find matching item and increment scanned quantity
    const updatedItems = items.map(item => {
      if (item.id === data && item.scannedQuantity < item.quantity) {
        return { ...item, scannedQuantity: item.scannedQuantity + 1 };
      }
      return item;
    });
    
    setItems(updatedItems);
    
    // Check if all items are completed
    const allCompleted = updatedItems.every(item => item.scannedQuantity >= item.quantity);
    if (allCompleted) {
      Alert.alert(
        'Picking Complete',
        'All items have been scanned!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
  };

  const handleItemPress = (item: SKUItem) => {
    if (activeTab === 'scanned' && item.scannedQuantity > 0) {
      // Reverse scan: move one unit back to pending
      const updatedItems = items.map(i => {
        if (i.id === item.id) {
          return { ...i, scannedQuantity: Math.max(0, i.scannedQuantity - 1) };
        }
        return i;
      });
      setItems(updatedItems);
    } else if (activeTab === 'pending') {
      // Show bulk pick modal or scan one
      handleBarcodeScanned(item.id);
    }
  };

  const renderProductCard = ({ item }: { item: SKUItem }) => {
    const isCompleted = item.scannedQuantity >= item.quantity;
    const isScannedView = activeTab === 'scanned';
    
    return (
      <TouchableOpacity 
        style={[
          styles.productCard,
          isCompleted && styles.completedCard,
          isScannedView && styles.scannedCard
        ]}
        onPress={() => handleItemPress(item)}
        disabled={activeTab === 'pending' && isCompleted}
      >
        <View style={styles.productHeader}>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productBrand}>{item.brand}</Text>
            <Text style={styles.productDetails}>
              {item.color} • Size {item.size}
            </Text>
          </View>
          
          <View style={styles.quantitySection}>
            <Text style={styles.quantityText}>
              {item.scannedQuantity}/{item.quantity}
            </Text>
          </View>
        </View>
        
        <View style={styles.productFooter}>
          <Text style={styles.batchText}>Batch: {item.batchNumber}</Text>
          <Text style={styles.costText}>${item.cost}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>SKU Scanner</Text>
        <TouchableOpacity onPress={() => setShowCamera(!showCamera)}>
          <Text style={styles.toggleButton}>📷</Text>
        </TouchableOpacity>
      </View>

      {/* Camera Section */}
      {showCamera && (
        <View style={styles.cameraSection}>
          <CameraCapture
            mode="barcode"
            onScan={handleBarcodeScanned}
            overlayText="Scan product barcode"
          />
        </View>
      )}

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>
            Pending ({pendingItems.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'scanned' && styles.activeTab]}
          onPress={() => setActiveTab('scanned')}
        >
          <Text style={[styles.tabText, activeTab === 'scanned' && styles.activeTabText]}>
            Scanned ({scannedItems.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Product List */}
      <FlatList
        data={activeTab === 'pending' ? pendingItems : scannedItems}
        renderItem={renderProductCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  toggleButton: {
    fontSize: 20,
  },
  cameraSection: {
    height: 200,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tabContainer: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#2563eb',
  },
  tabText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#2563eb',
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  completedCard: {
    backgroundColor: '#f0fdf4',
    borderColor: '#22c55e',
    borderWidth: 1,
  },
  scannedCard: {
    backgroundColor: '#fefce8',
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  productDetails: {
    fontSize: 12,
    color: '#9ca3af',
  },
  quantitySection: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  batchText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  costText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
});