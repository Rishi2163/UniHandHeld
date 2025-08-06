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
type RouteProp = RouteProp<RootStackParamList, 'SKUInput'>;

const mockSKUItems: SKUItem[] = [
  {
    id: 'NK001',
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
    id: 'AD002',
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
  }
];

export const SKUInputScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp>();
  const [items, setItems] = useState(mockSKUItems);
  const [skuInput, setSkuInput] = useState('');
  const [quantityInput, setQuantityInput] = useState('');

  const { id, shelfCode } = route.params;

  const handleSKUInput = () => {
    if (!skuInput.trim()) {
      Alert.alert('Error', 'Please enter a SKU code');
      return;
    }

    const quantity = parseInt(quantityInput) || 1;
    const foundItem = items.find(item => 
      item.id.toLowerCase() === skuInput.toLowerCase()
    );

    if (foundItem) {
      const updatedItems = items.map(item => {
        if (item.id === foundItem.id) {
          const newScannedQuantity = Math.min(
            item.quantity, 
            item.scannedQuantity + quantity
          );
          return { ...item, scannedQuantity: newScannedQuantity };
        }
        return item;
      });
      
      setItems(updatedItems);
      setSkuInput('');
      setQuantityInput('');
      
      Alert.alert('Success', `Added ${quantity} of ${foundItem.name}`);
    } else {
      Alert.alert('Error', 'SKU not found in this shelf');
    }
  };

  const handleItemPress = (item: SKUItem) => {
    if (item.scannedQuantity > 0) {
      // Remove one unit
      const updatedItems = items.map(i => {
        if (i.id === item.id) {
          return { ...i, scannedQuantity: Math.max(0, i.scannedQuantity - 1) };
        }
        return i;
      });
      setItems(updatedItems);
    }
  };

  const handleComplete = () => {
    const allCompleted = items.every(item => item.scannedQuantity >= item.quantity);
    
    if (allCompleted) {
      Alert.alert(
        'Picking Complete',
        'All items have been picked!',
        [{ text: 'OK', onPress: () => navigation.navigate('PicklistDetail', { id }) }]
      );
    } else {
      Alert.alert('Warning', 'Not all items have been picked. Continue anyway?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => navigation.navigate('PicklistDetail', { id }) }
      ]);
    }
  };

  const renderSKUItem = ({ item }: { item: SKUItem }) => {
    const isCompleted = item.scannedQuantity >= item.quantity;
    
    return (
      <TouchableOpacity 
        style={[styles.skuCard, isCompleted && styles.completedCard]}
        onPress={() => handleItemPress(item)}
      >
        <View style={styles.skuHeader}>
          <View style={styles.skuInfo}>
            <Text style={styles.skuCode}>{item.id}</Text>
            <Text style={styles.skuName}>{item.name}</Text>
            <Text style={styles.skuDetails}>
              {item.brand} • {item.color} • Size {item.size}
            </Text>
          </View>
          
          <View style={styles.quantitySection}>
            <Text style={[
              styles.quantityText,
              isCompleted && styles.completedText
            ]}>
              {item.scannedQuantity}/{item.quantity}
            </Text>
          </View>
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
        <Text style={styles.title}>SKU Input</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Shelf Info */}
      <View style={styles.shelfInfo}>
        <Text style={styles.shelfLabel}>Shelf: {shelfCode}</Text>
        <Text style={styles.modeLabel}>Manual Input Mode</Text>
      </View>

      {/* Input Section */}
      <View style={styles.inputSection}>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, styles.skuInputField]}
            placeholder="Enter SKU code..."
            value={skuInput}
            onChangeText={setSkuInput}
            autoCapitalize="characters"
          />
          <TextInput
            style={[styles.input, styles.quantityInputField]}
            placeholder="Qty"
            value={quantityInput}
            onChangeText={setQuantityInput}
            keyboardType="numeric"
          />
        </View>
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleSKUInput}
        >
          <Text style={styles.addButtonText}>Add Item</Text>
        </TouchableOpacity>
      </View>

      {/* Items List */}
      <View style={styles.listSection}>
        <Text style={styles.sectionTitle}>
          Items in {shelfCode} ({items.length} total)
        </Text>
        
        <FlatList
          data={items}
          renderItem={renderSKUItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Complete Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity 
          style={styles.completeButton}
          onPress={handleComplete}
        >
          <Text style={styles.completeButtonText}>
            Complete Shelf Picking
          </Text>
        </TouchableOpacity>
      </View>
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
  shelfInfo: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  shelfLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  modeLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  inputSection: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  skuInputField: {
    flex: 1,
  },
  quantityInputField: {
    width: 80,
  },
  addButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  listSection: {
    flex: 1,
    backgroundColor: '#ffffff',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  listContainer: {
    padding: 16,
  },
  skuCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  completedCard: {
    backgroundColor: '#f0fdf4',
    borderColor: '#22c55e',
  },
  skuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  skuInfo: {
    flex: 1,
  },
  skuCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  skuName: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 2,
  },
  skuDetails: {
    fontSize: 12,
    color: '#6b7280',
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
  completedText: {
    color: '#22c55e',
  },
  bottomSection: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  completeButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});