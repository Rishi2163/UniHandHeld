// Manual shelf selection screen (input mode when barcode is OFF)
// Manual shelf selection screen (input mode when barcode is OFF)
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
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList, 'ShelfSelection'>;
type RouteProps = RouteProp<RootStackParamList, 'ShelfSelection'>;

interface ShelfOption {
  id: string;
  code: string;
  description: string;
  skuCount: number;
  pendingQty: number;
  status: 'pending' | 'scanned';
}

const mockShelves: ShelfOption[] = [
  { id: '1', code: 'SHELF_001', description: 'Athletic Shoes - Level 1', skuCount: 5, pendingQty: 120, status: 'pending' },
  { id: '2', code: 'SHELF_002', description: 'Casual Wear - Level 2', skuCount: 3, pendingQty: 80, status: 'pending' },
  { id: '3', code: 'SHELF_003', description: 'Accessories - Level 3', skuCount: 2, pendingQty: 45, status: 'scanned' },
];

export const ShelfSelectionScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const [selectedShelf, setSelectedShelf] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState<'pending' | 'scanned'>('pending');

  const { id } = route.params;

  const pendingShelves = mockShelves.filter(shelf => shelf.status === 'pending');
  const scannedShelves = mockShelves.filter(shelf => shelf.status === 'scanned');
  const displayShelves = activeTab === 'pending' ? pendingShelves : scannedShelves;

  const filteredShelves = displayShelves.filter(shelf =>
    shelf.code.toLowerCase().includes(searchText.toLowerCase()) ||
    shelf.description.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleShelfSelect = (shelfCode: string) => {
    setSelectedShelf(shelfCode);
    // Navigate immediately when shelf is selected
    navigation.navigate('SKUInput', { id, shelfCode });
  };

  const renderShelfItem = ({ item }: { item: ShelfOption }) => (
    <TouchableOpacity 
      style={styles.shelfCard}
      onPress={() => handleShelfSelect(item.code)}
    >
      <Text style={styles.shelfCode}>{item.code}</Text>
      
      <View style={styles.shelfStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>SKU Count</Text>
          <Text style={styles.statValue}>{item.skuCount}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Pending Qty</Text>
          <Text style={styles.statValue}>{item.pendingQty}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>PKPL{id}-WH</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Scan Shelf Code"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>
            Pending Shelf
          </Text>
          <View style={[styles.tabBadge, activeTab === 'pending' && styles.activeTabBadge]}>
            <Text style={[styles.tabBadgeText, activeTab === 'pending' && styles.activeTabBadgeText]}>
              {pendingShelves.length}
            </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'scanned' && styles.activeTab]}
          onPress={() => setActiveTab('scanned')}
        >
          <Text style={[styles.tabText, activeTab === 'scanned' && styles.activeTabText]}>
            Scanned Shelf
          </Text>
          <View style={[styles.tabBadge, activeTab === 'scanned' && styles.activeTabBadge]}>
            <Text style={[styles.tabBadgeText, activeTab === 'scanned' && styles.activeTabBadgeText]}>
              {scannedShelves.length}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Filters Section */}
      <View style={styles.filtersSection}>
        <View style={styles.filtersLeft}>
          <Text style={styles.filterIcon}>⚒</Text>
          <Text style={styles.filtersText}>FILTERS</Text>
        </View>
        <View style={styles.filtersRight}>
          <Text style={styles.picklistCode}>Picklist Code</Text>
          <Text style={styles.dropdownIcon}>⌄</Text>
        </View>
      </View>

      {/* Shelf List */}
      <FlatList
        data={filteredShelves}
        renderItem={renderShelfItem}
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
  placeholder: {
    width: 24,
  },
  searchContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchInputContainer: {
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
  tabsContainer: {
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
  filtersSection: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filtersLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterIcon: {
    fontSize: 16,
    color: '#6b7280',
  },
  filtersText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  filtersRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  picklistCode: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  dropdownIcon: {
    fontSize: 16,
    color: '#6b7280',
  },
  listContainer: {
    padding: 16,
  },
  shelfCard: {
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
  },
  shelfCode: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  shelfStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
});
