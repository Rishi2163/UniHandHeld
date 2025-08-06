// Shelf detail screen showing shelf information and items
import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList, 'ShelfDetail'>;
type RouteProps = RouteProp<RootStackParamList, 'ShelfDetail'>;

interface ShelfItem {
  id: string;
  name: string;
  quantity: number;
  location: string;
}

// Mock shelf items
const mockShelfItems: ShelfItem[] = [
  { id: '1', name: 'Nike Air Max 90', quantity: 2, location: 'A1-001' },
  { id: '2', name: 'Adidas Ultraboost', quantity: 1, location: 'A1-002' },
  { id: '3', name: 'Puma RS-X', quantity: 3, location: 'A1-003' },
];

export const ShelfDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();

  const { id } = route.params;

  const handleContinueToSKU = () => {
    navigation.navigate('SKUScanner', { toteId: id });
  };

  const renderShelfItem = ({ item }: { item: ShelfItem }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemLocation}>{item.location}</Text>
      </View>
      <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
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
        <Text style={styles.title}>Shelf Details</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Shelf Info */}
      <View style={styles.shelfInfo}>
        <Text style={styles.shelfBarcode}>Barcode: {id}</Text>
        <Text style={styles.shelfLocation}>Shelf Location: A1</Text>
        <Text style={styles.itemCount}>{mockShelfItems.length} items to pick</Text>
      </View>

      {/* Items List */}
      <View style={styles.listSection}>
        <Text style={styles.sectionTitle}>Items on this shelf:</Text>
        <FlatList
          data={mockShelfItems}
          renderItem={renderShelfItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Continue Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={handleContinueToSKU}
        >
          <Text style={styles.continueButtonText}>
            Continue to SKU Scanner
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
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  shelfBarcode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  shelfLocation: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 4,
  },
  itemCount: {
    fontSize: 14,
    color: '#9ca3af',
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
  itemCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  itemLocation: {
    fontSize: 14,
    color: '#6b7280',
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  itemQuantity: {
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
  continueButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});