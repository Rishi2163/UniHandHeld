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
  items: number;
}

const mockShelves: ShelfOption[] = [
  { id: '1', code: 'A1-001', description: 'Athletic Shoes - Level 1', items: 3 },
  { id: '2', code: 'A1-002', description: 'Athletic Shoes - Level 1', items: 2 },
  { id: '3', code: 'B2-001', description: 'Casual Wear - Level 2', items: 4 },
  { id: '4', code: 'B2-002', description: 'Casual Wear - Level 2', items: 1 },
  { id: '5', code: 'C3-001', description: 'Accessories - Level 3', items: 2 },
];

export const ShelfSelectionScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const [selectedShelf, setSelectedShelf] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');

  const { id } = route.params;

  const filteredShelves = mockShelves.filter(shelf =>
    shelf.code.toLowerCase().includes(searchText.toLowerCase()) ||
    shelf.description.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleShelfSelect = (shelfCode: string) => {
    setSelectedShelf(shelfCode);
  };

  const handleContinue = () => {
    if (selectedShelf) {
      navigation.navigate('SKUInput', { id, shelfCode: selectedShelf });
    }
  };

  const renderShelfItem = ({ item }: { item: ShelfOption }) => (
    <TouchableOpacity 
      style={[
        styles.shelfCard,
        selectedShelf === item.code && styles.selectedShelfCard
      ]}
      onPress={() => handleShelfSelect(item.code)}
    >
      <View style={styles.shelfHeader}>
        <Text style={styles.shelfCode}>{item.code}</Text>
        <Text style={styles.itemCount}>{item.items} items</Text>
      </View>
      <Text style={styles.shelfDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Select Shelf</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search shelf code or description..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          Select a shelf to continue with manual picking
        </Text>
      </View>

      {/* Shelf List */}
      <FlatList
        data={filteredShelves}
        renderItem={renderShelfItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Continue Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity 
          style={[
            styles.continueButton,
            !selectedShelf && styles.disabledButton
          ]}
          onPress={handleContinue}
          disabled={!selectedShelf}
        >
          <Text style={[
            styles.continueButtonText,
            !selectedShelf && styles.disabledButtonText
          ]}>
            Continue to SKU Input
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
  searchContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  searchInput: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  instructions: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  instructionText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
  },
  shelfCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedShelfCard: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  shelfHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  shelfCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  itemCount: {
    fontSize: 14,
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  shelfDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  bottomSection: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  continueButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#e5e7eb',
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButtonText: {
    color: '#9ca3af',
  },
});