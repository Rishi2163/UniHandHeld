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
type RouteProp = RouteProp<RootStackParamList, 'PicklistDetail'>;

interface ShelfSection {
  id: string;
  code: string;
  level: number;
  items: number;
}

// Mock shelf data
const mockShelves: ShelfSection[] = [
  { id: '1', code: 'A1-001', level: 1, items: 3 },
  { id: '2', code: 'A1-002', level: 1, items: 2 },
  { id: '3', code: 'B2-001', level: 2, items: 4 },
  { id: '4', code: 'B2-002', level: 2, items: 1 },
  { id: '5', code: 'C3-001', level: 3, items: 2 },
];

const PicklistDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp>();
  const { barcodeMode } = useBarcodeMode();
  const [showSectionDialog, setShowSectionDialog] = useState(false);
  const [sortAZ, setSortAZ] = useState(true);
  const [shelves, setShelves] = useState(mockShelves);

  const { id } = route.params;

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
    setSortAZ(!sortAZ);
    const sorted = [...shelves].sort((a, b) => {
      return sortAZ 
        ? b.code.localeCompare(a.code)
        : a.code.localeCompare(b.code);
    });
    setShelves(sorted);
  };

  const renderShelfItem = ({ item }: { item: ShelfSection }) => (
    <View style={styles.shelfCard}>
      <View style={styles.shelfHeader}>
        <Text style={styles.shelfCode}>{item.code}</Text>
        <Text style={styles.shelfLevel}>Level {item.level}</Text>
      </View>
      <Text style={styles.shelfItems}>{item.items} items</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Picklist {id}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Barcode Info */}
      <View style={styles.barcodeSection}>
        <Text style={styles.barcodeLabel}>Barcode: {id}</Text>
        <Text style={styles.modeLabel}>
          Mode: {barcodeMode ? 'Scanner' : 'Manual Input'}
        </Text>
      </View>

      {/* Section Controls */}
      <View style={styles.controls}>
        <TouchableOpacity 
          style={styles.sectionButton}
          onPress={handleSectionPress}
        >
          <Text style={styles.sectionButtonText}>Select Section</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.sortButton}
          onPress={toggleSort}
        >
          <Text style={styles.sortButtonText}>
            {sortAZ ? 'A-Z' : 'Z-A'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Shelves List */}
      <FlatList
        data={shelves}
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
        presentationStyle="pageSheet"
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
  placeholder: {
    width: 50,
  },
  barcodeSection: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  barcodeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  modeLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  controls: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sectionButton: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  sectionButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  sortButton: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  sortButtonText: {
    fontSize: 14,
    color: '#374151',
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
  shelfHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  shelfCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  shelfLevel: {
    fontSize: 14,
    color: '#6b7280',
  },
  shelfItems: {
    fontSize: 14,
    color: '#9ca3af',
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