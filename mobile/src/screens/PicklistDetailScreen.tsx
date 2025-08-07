// Individual picklist detail screen showing shelf locations and items
// Individual picklist detail screen showing shelf locations and items
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  StatusBar,
  Modal,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useBarcodeMode } from '../contexts/BarcodeModeContext';

type NavigationProp = StackNavigationProp<RootStackParamList, 'PicklistDetail'>;
type RouteProps = RouteProp<RootStackParamList, 'PicklistDetail'>;

interface ShelfSection {
  id: string;
  code: string;
  skuCount: number;
  pendingQty: number;
  status: 'pending' | 'scanned';
}

// Mock shelf data
const mockShelves: ShelfSection[] = [
  { id: '1', code: 'SHELF_001', skuCount: 5, pendingQty: 120, status: 'pending' },
  { id: '2', code: 'SHELF_002', skuCount: 3, pendingQty: 80, status: 'pending' },
  { id: '3', code: 'SHELF_003', skuCount: 2, pendingQty: 45, status: 'scanned' },
];

export const PicklistDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { barcodeMode } = useBarcodeMode();
  const [showSectionDialog, setShowSectionDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'scanned'>('pending');
  const [sortAZ, setSortAZ] = useState(true);
  const [shelves] = useState(mockShelves);

  const { id } = route.params;

  const pendingShelves = shelves.filter(shelf => shelf.status === 'pending');
  const scannedShelves = shelves.filter(shelf => shelf.status === 'scanned');
  const displayShelves = activeTab === 'pending' ? pendingShelves : scannedShelves;

  const handleStartPicking = () => {
    if (barcodeMode) {
      // Go to tote scanner for barcode mode
      navigation.navigate('ToteScanner', { id });
    } else {
      // Go to shelf selection for input mode
      navigation.navigate('ShelfSelection', { id });
    }
  };

  const handleSectionPress = () => {
    setShowSectionDialog(true);
  };

  const handleSectionSelect = (section: string) => {
    Alert.alert('Section Selected', `Selected section: ${section}`);
    setShowSectionDialog(false);
  };

  const toggleSort = () => {
    // Sort functionality can be implemented here if needed
  };

  const renderShelfItem = ({ item }: { item: ShelfSection }) => (
    <View style={styles.shelfCard}>
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
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.hamburgerButton}>
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.title}>PL{id}-WH</Text>
        
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuDots}>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>
            Pending Shelf ({pendingShelves.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'scanned' && styles.activeTab]}
          onPress={() => setActiveTab('scanned')}
        >
          <Text style={[styles.tabText, activeTab === 'scanned' && styles.activeTabText]}>
            Scanned Shelf ({scannedShelves.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Section Controls */}
      <View style={styles.sectionControls}>
        <TouchableOpacity onPress={handleSectionPress}>
          <Text style={styles.sectionLabel}>SECTION</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={toggleSort}>
          <Text style={styles.shelfCodeSort}>Shelf Code A-Z</Text>
        </TouchableOpacity>
      </View>

      {/* Shelves List */}
      <FlatList
        data={displayShelves}
        renderItem={renderShelfItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Start Picking Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity 
          style={styles.startButton}
          onPress={handleStartPicking}
        >
          <Text style={styles.startButtonText}>START PICKING</Text>
        </TouchableOpacity>
      </View>

      {/* Section Selection Modal */}
      <Modal
        visible={showSectionDialog}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Section</Text>
            </View>
            
            <FlatList
              data={['Section A', 'Section B', 'Section C', 'Section D']}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.sectionItem}
                  onPress={() => handleSectionSelect(item)}
                >
                  <Text style={styles.sectionItemText}>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowSectionDialog(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={() => setShowSectionDialog(false)}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hamburgerButton: {
    width: 24,
    height: 24,
    justifyContent: 'space-between',
    marginRight: 16,
  },
  hamburgerLine: {
    width: 24,
    height: 3,
    backgroundColor: '#000000',
    borderRadius: 2,
  },
  backButton: {
    marginRight: 8,
  },
  backArrow: {
    fontSize: 24,
    color: '#000000',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  menuButton: {
    padding: 8,
  },
  menuDots: {
    fontSize: 20,
    color: '#000000',
  },
  tabsContainer: {
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
  sectionControls: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sectionLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  shelfCodeSort: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
  },
  shelfCard: {
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
  bottomSection: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  startButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    margin: 20,
    maxHeight: '80%',
    width: '90%',
  },
  modalHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
  },
  sectionItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  sectionItemText: {
    fontSize: 16,
    color: '#374151',
  },
  modalButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#e5e7eb',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
});
