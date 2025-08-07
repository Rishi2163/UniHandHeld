// Manual SKU input screen (input mode when barcode is OFF)
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { SKUItem } from '../../shared/schema';

type NavigationProp = StackNavigationProp<RootStackParamList, 'SKUInput'>;
type RouteProps = RouteProp<RootStackParamList, 'SKUInput'>;

const mockSKUItems: SKUItem[] = [
  {
    id: 'SK238402-437493023012',
    name: 'Nike Shoes-Red-Size10-Mens Revolution 6 Nn-Sports Shoes-Men...',
    brand: 'Nike',
    color: 'Red',
    size: '10',
    quantity: 20,
    scannedQuantity: 0,
    batchNumber: 'NK-2024-001',
    expiryDate: '2025-12-31',
    cost: 1000,
    shelfLocation: 'A1-001'
  },
  {
    id: 'SK238402-437493023013',
    name: 'Nike Shoes-Blue-Size10-Mens Revolution 6 Nn-Sports Shoes-Men...',
    brand: 'Nike',
    color: 'Blue',
    size: '10',
    quantity: 30,
    scannedQuantity: 0,
    batchNumber: 'AD-2024-002',
    expiryDate: '2025-11-30',
    cost: 1000,
    shelfLocation: 'A1-002'
  }
];

export const SKUInputScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const [items, setItems] = useState(mockSKUItems);
  const [skuInput, setSkuInput] = useState('');
  const [activeTab, setActiveTab] = useState<'pending' | 'scanned'>('pending');

  const { id, shelfCode } = route.params;

  const pendingItems = items.filter(item => item.scannedQuantity < item.quantity);
  const scannedItems = items.filter(item => item.scannedQuantity > 0);

  const handleSKUInput = () => {
    if (!skuInput.trim()) {
      Alert.alert('Error', 'Please enter a SKU code');
      return;
    }

    const foundItem = items.find(item => 
      item.id.toLowerCase() === skuInput.toLowerCase()
    );

    if (foundItem && foundItem.scannedQuantity < foundItem.quantity) {
      const updatedItems = items.map(item => {
        if (item.id === foundItem.id) {
          return { ...item, scannedQuantity: item.scannedQuantity + 1 };
        }
        return item;
      });
      
      setItems(updatedItems);
      setSkuInput('');
      
      Alert.alert('Success', `Added 1 of ${foundItem.name}`);
    } else if (foundItem) {
      Alert.alert('Error', 'Item already fully picked');
    } else {
      Alert.alert('Error', 'SKU not found in this shelf');
    }
  };

  const handlePickItem = (item: SKUItem) => {
    if (item.scannedQuantity < item.quantity) {
      const updatedItems = items.map(i => {
        if (i.id === item.id) {
          return { ...i, scannedQuantity: i.scannedQuantity + 1 };
        }
        return i;
      });
      setItems(updatedItems);
    }
  };

  const handleUnpickItem = (item: SKUItem) => {
    if (item.scannedQuantity > 0) {
      const updatedItems = items.map(i => {
        if (i.id === item.id) {
          return { ...i, scannedQuantity: Math.max(0, i.scannedQuantity - 1) };
        }
        return i;
      });
      setItems(updatedItems);
    }
  };

  const renderSKUItem = ({ item }: { item: SKUItem }) => {
    const isPending = activeTab === 'pending';
    const showInPending = item.scannedQuantity < item.quantity;
    const showInScanned = item.scannedQuantity > 0;
    
    if (isPending && !showInPending) return null;
    if (!isPending && !showInScanned) return null;

    return (
      <View style={styles.skuCard}>
        <View style={styles.skuHeader}>
          <View style={styles.productImageContainer}>
            <View style={[styles.productImage, { backgroundColor: item.color === 'Red' ? '#ef4444' : '#3b82f6' }]}>
              <Text style={styles.brandText}>NIKE</Text>
            </View>
          </View>
          
          <View style={styles.skuInfo}>
            <Text style={styles.skuName} numberOfLines={2}>{item.name}</Text>
            <Text style={styles.skuCode}>{item.id}</Text>
            
            <View style={styles.itemDetails}>
              <Text style={styles.quantityLabel}>
                Qty {isPending ? item.quantity - item.scannedQuantity : item.scannedQuantity}
                {!isPending && (
                  <Text style={styles.unpickText}> (click to unpick)</Text>
                )}
              </Text>
              <Text style={styles.vendorText}>Vendor B02363940</Text>
            </View>
            
            <View style={styles.bottomRow}>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>GOOD</Text>
              </View>
              <Text style={styles.priceText}>MRP ₹{item.cost.toLocaleString()}</Text>
            </View>
            
            <Text style={styles.mfgText}>Mfg 12/03/23</Text>
          </View>
        </View>
        
        {isPending && (
          <TouchableOpacity 
            style={styles.pickButton}
            onPress={() => handlePickItem(item)}
            disabled={item.scannedQuantity >= item.quantity}
          >
            <Text style={styles.pickButtonText}>Pick Item</Text>
          </TouchableOpacity>
        )}

        {!isPending && (
          <TouchableOpacity 
            style={styles.unpickArea}
            onPress={() => handleUnpickItem(item)}
          >
            <View style={styles.invisibleButton} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{shelfCode}</Text>
        <TouchableOpacity>
          <Text style={styles.closeButton}>CLOSE</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Scan SKU Code"
            value={skuInput}
            onChangeText={setSkuInput}
            autoCapitalize="characters"
          />
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleSKUInput}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>
            Pending
          </Text>
          <View style={[styles.tabBadge, activeTab === 'pending' && styles.activeTabBadge]}>
            <Text style={[styles.tabBadgeText, activeTab === 'pending' && styles.activeTabBadgeText]}>
              {pendingItems.length}
            </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'scanned' && styles.activeTab]}
          onPress={() => setActiveTab('scanned')}
        >
          <Text style={[styles.tabText, activeTab === 'scanned' && styles.activeTabText]}>
            Scanned
          </Text>
          <View style={[styles.tabBadge, activeTab === 'scanned' && styles.activeTabBadge]}>
            <Text style={[styles.tabBadgeText, activeTab === 'scanned' && styles.activeTabBadgeText]}>
              {scannedItems.filter(item => item.scannedQuantity > 0).length}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Items List */}
      <FlatList
        data={activeTab === 'pending' ? pendingItems : scannedItems}
        renderItem={renderSKUItem}
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
    fontSize: 24,
    color: '#000000',
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  closeButton: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
  },
  searchContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
    color: '#6b7280',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#6b7280',
  },
  addButton: {
    backgroundColor: '#1f2937',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  tabContainer: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    gap: 8,
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
  tabBadge: {
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  activeTabBadge: {
    backgroundColor: '#2563eb',
  },
  tabBadgeText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
  activeTabBadgeText: {
    color: '#ffffff',
  },
  listContainer: {
    padding: 16,
  },
  skuCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: 'relative',
  },
  skuHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  productImageContainer: {
    marginRight: 12,
  },
  productImage: {
    width: 60,
    height: 40,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  skuInfo: {
    flex: 1,
  },
  skuName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  skuCode: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  quantityLabel: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '600',
  },
  unpickText: {
    color: '#2563eb',
    fontWeight: 'normal',
  },
  vendorText: {
    fontSize: 14,
    color: '#6b7280',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusBadge: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  priceText: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '600',
  },
  mfgText: {
    fontSize: 12,
    color: '#6b7280',
  },
  pickButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  pickButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  unpickArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  invisibleButton: {
    flex: 1,
  },
});
