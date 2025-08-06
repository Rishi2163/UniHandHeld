// Main picklists screen showing all available picking tasks
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  StatusBar,
  Switch,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { Picklist } from '../../shared/schema';
import { useBarcodeMode } from '../contexts/BarcodeModeContext';

type NavigationProp = StackNavigationProp<RootStackParamList, 'B2BPacking'>;

// Mock data - in real app this would come from API
const mockPicklists: Picklist[] = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    customerName: 'Nike Store Downtown',
    numberOfItems: 12,
    priority: 'High',
    paymentMethod: 'Credit Card',
    channel: 'B2B',
    shelfCode: 'A1-B2'
  },
  {
    id: '2',
    orderNumber: 'ORD-002',
    customerName: 'Adidas Outlet',
    numberOfItems: 8,
    priority: 'Medium',
    paymentMethod: 'Bank Transfer',
    channel: 'B2B',
    shelfCode: 'C3-D4'
  },
  {
    id: '3',
    orderNumber: 'ORD-003',
    customerName: 'Puma Sports',
    numberOfItems: 15,
    priority: 'Urgent',
    paymentMethod: 'PayPal',
    channel: 'B2B',
    shelfCode: 'E5-F6'
  },
];

const B2BPackingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { barcodeMode, setBarcodeMode } = useBarcodeMode();
  const [assignToMe, setAssignToMe] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredPicklists, setFilteredPicklists] = useState(mockPicklists);
  const [sortAZ, setSortAZ] = useState(true);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return '#ef4444';
      case 'High': return '#f97316';
      case 'Medium': return '#eab308';
      case 'Low': return '#22c55e';
      default: return '#6b7280';
    }
  };

  const handlePicklistPress = (picklist: Picklist) => {
    navigation.navigate('PicklistDetail', { id: picklist.id });
  };

  const toggleSort = () => {
    setSortAZ(!sortAZ);
    const sorted = [...filteredPicklists].sort((a, b) => {
      return sortAZ 
        ? b.orderNumber.localeCompare(a.orderNumber)
        : a.orderNumber.localeCompare(b.orderNumber);
    });
    setFilteredPicklists(sorted);
  };

  const applySearch = (text: string) => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilteredPicklists(mockPicklists);
    } else {
      const filtered = mockPicklists.filter(picklist =>
        picklist.orderNumber.toLowerCase().includes(text.toLowerCase()) ||
        picklist.customerName.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredPicklists(filtered);
    }
  };

  const renderPicklistCard = ({ item }: { item: Picklist }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => handlePicklistPress(item)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.orderNumber}>{item.orderNumber}</Text>
        <View 
          style={[
            styles.priorityBadge, 
            { backgroundColor: getPriorityColor(item.priority) }
          ]}
        >
          <Text style={styles.priorityText}>{item.priority}</Text>
        </View>
      </View>
      
      <Text style={styles.customerName}>{item.customerName}</Text>
      
      <View style={styles.cardDetails}>
        <Text style={styles.detailText}>Items: {item.numberOfItems}</Text>
        <Text style={styles.detailText}>Payment: {item.paymentMethod}</Text>
        <Text style={styles.detailText}>Channel: {item.channel}</Text>
        {item.shelfCode && (
          <Text style={styles.detailText}>Shelf: {item.shelfCode}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>B2B Packing</Text>
        
        {/* Barcode Toggle */}
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>Barcode</Text>
          <Switch
            value={barcodeMode}
            onValueChange={setBarcodeMode}
            trackColor={{ false: '#e5e7eb', true: '#2563eb' }}
            thumbColor={barcodeMode ? '#ffffff' : '#f3f4f6'}
          />
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <View style={styles.assignToggle}>
          <Text style={styles.assignLabel}>Assign to me</Text>
          <Switch
            value={assignToMe}
            onValueChange={setAssignToMe}
            trackColor={{ false: '#e5e7eb', true: '#2563eb' }}
            thumbColor={assignToMe ? '#ffffff' : '#f3f4f6'}
          />
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilters(true)}
          >
            <Text style={styles.filterButtonText}>Filter</Text>
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
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search picklists..."
          value={searchText}
          onChangeText={applySearch}
        />
      </View>

      {/* Picklist Grid */}
      <FlatList
        data={filteredPicklists}
        renderItem={renderPicklistCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Text style={styles.closeButton}>Done</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <Text style={styles.filterSection}>Priority</Text>
            <Text style={styles.filterSection}>Payment Method</Text>
            <Text style={styles.filterSection}>Channel</Text>
            <Text style={styles.filterSection}>Customer</Text>
          </ScrollView>
        </SafeAreaView>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleLabel: {
    fontSize: 16,
    color: '#374151',
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
  assignToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  assignLabel: {
    fontSize: 14,
    color: '#374151',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  filterButton: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  filterButtonText: {
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
  searchContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchInput: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  customerName: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  cardDetails: {
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  closeButton: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  filterSection: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
});