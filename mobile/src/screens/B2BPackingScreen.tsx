// // Main picklists screen showing all available picking tasks
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   FlatList,
//   StatusBar,
//   Switch,
//   Modal,
//   TextInput,
//   ScrollView,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import type { StackNavigationProp } from '@react-navigation/stack';
// import type { RootStackParamList } from '../navigation/AppNavigator';
// import { Picklist } from '../../shared/schema';
// import { useBarcodeMode } from '../contexts/BarcodeModeContext';

// type NavigationProp = StackNavigationProp<RootStackParamList, 'B2BPacking'>;

// // Mock data - in real app this would come from API
// const mockPicklists: Picklist[] = [
//   {
//     id: '1',
//     orderNumber: 'ORD-001',
//     customerName: 'Nike Store Downtown',
//     numberOfItems: 12,
//     priority: 'High',
//     paymentMethod: 'Credit Card',
//     channel: 'B2B',
//     shelfCode: 'A1-B2'
//   },
//   {
//     id: '2',
//     orderNumber: 'ORD-002',
//     customerName: 'Adidas Outlet',
//     numberOfItems: 8,
//     priority: 'Medium',
//     paymentMethod: 'Bank Transfer',
//     channel: 'B2B',
//     shelfCode: 'C3-D4'
//   },
//   {
//     id: '3',
//     orderNumber: 'ORD-003',
//     customerName: 'Puma Sports',
//     numberOfItems: 15,
//     priority: 'Urgent',
//     paymentMethod: 'PayPal',
//     channel: 'B2B',
//     shelfCode: 'E5-F6'
//   },
// ];

// export const B2BPackingScreen: React.FC = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const { barcodeMode, setBarcodeMode } = useBarcodeMode();
//   const [assignToMe, setAssignToMe] = useState(false);
//   const [showFilters, setShowFilters] = useState(false);
//   const [searchText, setSearchText] = useState('');
//   const [filteredPicklists, setFilteredPicklists] = useState(mockPicklists);
//   const [sortAZ, setSortAZ] = useState(true);

//   const getPriorityColor = (priority: string) => {
//     switch (priority) {
//       case 'Urgent': return '#ef4444';
//       case 'High': return '#f97316';
//       case 'Medium': return '#eab308';
//       case 'Low': return '#22c55e';
//       default: return '#6b7280';
//     }
//   };

//   const handlePicklistPress = (picklist: Picklist) => {
//     navigation.navigate('PicklistDetail', { id: picklist.id });
//   };

//   const toggleSort = () => {
//     setSortAZ(!sortAZ);
//     const sorted = [...filteredPicklists].sort((a, b) => {
//       return sortAZ 
//         ? b.orderNumber.localeCompare(a.orderNumber)
//         : a.orderNumber.localeCompare(b.orderNumber);
//     });
//     setFilteredPicklists(sorted);
//   };

//   const applySearch = (text: string) => {
//     setSearchText(text);
//     if (text.trim() === '') {
//       setFilteredPicklists(mockPicklists);
//     } else {
//       const filtered = mockPicklists.filter(picklist =>
//         picklist.orderNumber.toLowerCase().includes(text.toLowerCase()) ||
//         picklist.customerName.toLowerCase().includes(text.toLowerCase())
//       );
//       setFilteredPicklists(filtered);
//     }
//   };

//   const renderPicklistCard = ({ item }: { item: Picklist }) => (
//     <TouchableOpacity 
//       style={styles.card} 
//       onPress={() => handlePicklistPress(item)}
//     >
//       <View style={styles.cardHeader}>
//         <Text style={styles.orderNumber}>{item.orderNumber}</Text>
//         <View 
//           style={[
//             styles.priorityBadge, 
//             { backgroundColor: getPriorityColor(item.priority) }
//           ]}
//         >
//           <Text style={styles.priorityText}>{item.priority}</Text>
//         </View>
//       </View>
      
//       <Text style={styles.customerName}>{item.customerName}</Text>
      
//       <View style={styles.cardDetails}>
//         <Text style={styles.detailText}>Items: {item.numberOfItems}</Text>
//         <Text style={styles.detailText}>Payment: {item.paymentMethod}</Text>
//         <Text style={styles.detailText}>Channel: {item.channel}</Text>
//         {item.shelfCode && (
//           <Text style={styles.detailText}>Shelf: {item.shelfCode}</Text>
//         )}
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.title}>B2B Packing</Text>
        
//         {/* Barcode Toggle */}
//         <View style={styles.toggleContainer}>
//           <Text style={styles.toggleLabel}>Barcode</Text>
//           <Switch
//             value={barcodeMode}
//             onValueChange={setBarcodeMode}
//             trackColor={{ false: '#e5e7eb', true: '#2563eb' }}
//             thumbColor={barcodeMode ? '#ffffff' : '#f3f4f6'}
//           />
//         </View>
//       </View>

//       {/* Controls */}
//       <View style={styles.controls}>
//         <View style={styles.assignToggle}>
//           <Text style={styles.assignLabel}>Assign to me</Text>
//           <Switch
//             value={assignToMe}
//             onValueChange={setAssignToMe}
//             trackColor={{ false: '#e5e7eb', true: '#2563eb' }}
//             thumbColor={assignToMe ? '#ffffff' : '#f3f4f6'}
//           />
//         </View>
        
//         <View style={styles.actionButtons}>
//           <TouchableOpacity 
//             style={styles.filterButton}
//             onPress={() => setShowFilters(true)}
//           >
//             <Text style={styles.filterButtonText}>Filter</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={styles.sortButton}
//             onPress={toggleSort}
//           >
//             <Text style={styles.sortButtonText}>
//               {sortAZ ? 'A-Z' : 'Z-A'}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Search */}
//       <View style={styles.searchContainer}>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search picklists..."
//           value={searchText}
//           onChangeText={applySearch}
//         />
//       </View>

//       {/* Picklist Grid */}
//       <FlatList
//         data={filteredPicklists}
//         renderItem={renderPicklistCard}
//         keyExtractor={(item) => item.id}
//         numColumns={2}
//         contentContainerStyle={styles.listContainer}
//         columnWrapperStyle={styles.row}
//         showsVerticalScrollIndicator={false}
//       />

//       {/* Filter Modal */}
//       <Modal
//         visible={showFilters}
//         animationType="slide"
//         presentationStyle="pageSheet"
//       >
//         <SafeAreaView style={styles.modalContainer}>
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>Filters</Text>
//             <TouchableOpacity onPress={() => setShowFilters(false)}>
//               <Text style={styles.closeButton}>Done</Text>
//             </TouchableOpacity>
//           </View>
          
//           <ScrollView style={styles.modalContent}>
//             <Text style={styles.filterSection}>Priority</Text>
//             <Text style={styles.filterSection}>Payment Method</Text>
//             <Text style={styles.filterSection}>Channel</Text>
//             <Text style={styles.filterSection}>Customer</Text>
//           </ScrollView>
//         </SafeAreaView>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f9fafb',
//   },
//   header: {
//     backgroundColor: '#ffffff',
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e5e7eb',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#1f2937',
//   },
//   toggleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   toggleLabel: {
//     fontSize: 16,
//     color: '#374151',
//   },
//   controls: {
//     backgroundColor: '#ffffff',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e5e7eb',
//   },
//   assignToggle: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   assignLabel: {
//     fontSize: 14,
//     color: '#374151',
//   },
//   actionButtons: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   filterButton: {
//     backgroundColor: '#e5e7eb',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 6,
//   },
//   filterButtonText: {
//     fontSize: 14,
//     color: '#374151',
//     fontWeight: '500',
//   },
//   sortButton: {
//     backgroundColor: '#e5e7eb',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 6,
//   },
//   sortButtonText: {
//     fontSize: 14,
//     color: '#374151',
//     fontWeight: '500',
//   },
//   searchContainer: {
//     backgroundColor: '#ffffff',
//     paddingHorizontal: 16,
//     paddingBottom: 16,
//   },
//   searchInput: {
//     backgroundColor: '#f3f4f6',
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderRadius: 8,
//     fontSize: 16,
//   },
//   listContainer: {
//     padding: 16,
//   },
//   row: {
//     justifyContent: 'space-between',
//     marginBottom: 16,
//   },
//   card: {
//     backgroundColor: '#ffffff',
//     borderRadius: 8,
//     padding: 16,
//     width: '48%',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   orderNumber: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#1f2937',
//   },
//   priorityBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 4,
//   },
//   priorityText: {
//     fontSize: 12,
//     color: '#ffffff',
//     fontWeight: '600',
//   },
//   customerName: {
//     fontSize: 14,
//     color: '#6b7280',
//     marginBottom: 12,
//   },
//   cardDetails: {
//     gap: 4,
//   },
//   detailText: {
//     fontSize: 12,
//     color: '#9ca3af',
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e5e7eb',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1f2937',
//   },
//   closeButton: {
//     fontSize: 16,
//     color: '#2563eb',
//     fontWeight: '600',
//   },
//   modalContent: {
//     flex: 1,
//     padding: 16,
//   },
//   filterSection: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#374151',
//     marginBottom: 16,
//   },
// });

// import React, { useState, useMemo } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   Modal,
//   Switch,
  
//   SafeAreaView,
//   StatusBar,
// } from 'react-native';

// interface PicklistItem {
//   id: string;
//   picklistCode: string;
//   pendingQuantity: number;
//   pendingSection: number;
//   channel: string;
//   customer: string;
//   sku: string;
//   fulfillmentTAT: string;
//   order: string;
//   paymentMethod: string;
// }

// interface FilterState {
//   sku: string;
//   fulfillmentTAT: string;
//   order: string;
//   paymentMethod: string;
//   quantity: string;
//   customers: string;
//   channel: string;
// }

// const sampleData: PicklistItem[] = [
//   { id: "1", picklistCode: "PL001-WH", pendingQuantity: 25, pendingSection: 5, channel: "Online", customer: "TechCorp Ltd", sku: "SK001", fulfillmentTAT: "18/02/2023", order: "ORD001", paymentMethod: "Credit Card" },
//   { id: "2", picklistCode: "PL002-USB", pendingQuantity: 50, pendingSection: 12, channel: "Retail", customer: "ElectroMax", sku: "SK002", fulfillmentTAT: "19/02/2023", order: "ORD002", paymentMethod: "Cash" },
//   { id: "3", picklistCode: "PL003-LS", pendingQuantity: 15, pendingSection: 3, channel: "Online", customer: "OfficeSupply Co", sku: "SK003", fulfillmentTAT: "20/02/2023", order: "ORD003", paymentMethod: "Debit Card" },
//   { id: "4", picklistCode: "PL004-BM", pendingQuantity: 30, pendingSection: 8, channel: "B2B", customer: "Corporate Solutions", sku: "SK004", fulfillmentTAT: "21/02/2023", order: "ORD004", paymentMethod: "Bank Transfer" },
//   { id: "5", picklistCode: "PL005-PC", pendingQuantity: 40, pendingSection: 15, channel: "Retail", customer: "Mobile World", sku: "SK005", fulfillmentTAT: "22/02/2023", order: "ORD005", paymentMethod: "Credit Card" },
//   { id: "6", picklistCode: "AL001-TEST", pendingQuantity: 35, pendingSection: 7, channel: "Online", customer: "Alpha Corp", sku: "SK006", fulfillmentTAT: "23/02/2023", order: "ORD006", paymentMethod: "PayPal" },
// ];

// export const B2BPackingScreen = () => {
//   const [assignToMe, setAssignToMe] = useState(false);
//   const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
//   const [picklistCode, setPicklistCode] = useState("");
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
//   const [filters, setFilters] = useState<FilterState>({
//     sku: "",
//     fulfillmentTAT: "",
//     order: "",
//     paymentMethod: "",
//     quantity: "",
//     customers: "",
//     channel: "",
//   });

//   const handleSort = () => {
//     setSortOrder(prev => prev === "asc" ? "desc" : "asc");
//   };

//   const handleClearAllFilters = () => {
//     setFilters({
//       sku: "",
//       fulfillmentTAT: "",
//       order: "",
//       paymentMethod: "",
//       quantity: "",
//       customers: "",
//       channel: "",
//     });
//   };

//   const filteredItems = useMemo(() => {
//     let items = sampleData;

//     if (picklistCode.trim()) {
//       items = items.filter(item =>
//         item.picklistCode.toLowerCase().includes(picklistCode.toLowerCase())
//       );
//     }

//     Object.keys(filters).forEach(key => {
//       const val = (filters as any)[key];
//       if (val) {
//         items = items.filter(item =>
//           (item as any)[key]?.toLowerCase().includes(val.toLowerCase())
//         );
//       }
//     });

//     return items.sort((a, b) => {
//       const cmp = a.picklistCode.localeCompare(b.picklistCode);
//       return sortOrder === "asc" ? cmp : -cmp;
//     });
//   }, [picklistCode, filters, sortOrder]);

//   const renderItem = ({ item }: { item: PicklistItem }) => (
//     <TouchableOpacity style={styles.card}>
//       <Text style={styles.cardTitle}>{item.picklistCode}</Text>
//       <View style={styles.cardRow}>
//         <View style={styles.cardColumn}>
//           <Text style={styles.cardLabel}>Pending Quantity</Text>
//           <Text style={styles.cardValue}>{item.pendingQuantity}</Text>
//         </View>
//         <View style={styles.cardColumn}>
//           <Text style={styles.cardLabel}>Channel</Text>
//           <Text style={styles.cardValue}>{item.channel}</Text>
//         </View>
//         <View style={styles.cardColumn}>
//           <Text style={styles.cardLabel}>Pending Section</Text>
//           <Text style={styles.cardValue}>{item.pendingSection}</Text>
//         </View>
//         <View style={styles.cardColumn}>
//           <Text style={styles.cardLabel}>Customer</Text>
//           <Text style={styles.cardValue}>{item.customer}</Text>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar backgroundColor="#fff" barStyle="dark-content" />

//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.menuIcon}>☰</Text>
//         <Text style={styles.headerTitle}>PICKLISTS</Text>
//         <View style={styles.switchContainer}>
//           <Text style={styles.switchLabel}>Assign to me</Text>
//           <Switch value={assignToMe} onValueChange={setAssignToMe} />
//         </View>
//       </View>

//       {/* Filter + Search + Sort */}
//       <View style={styles.filterRow}>
//         <TouchableOpacity onPress={() => setIsFilterModalOpen(true)} style={styles.button}>
//           <Text style={styles.buttonText}>Filter</Text>
//         </TouchableOpacity>

//         <TextInput
//           placeholder="Picklist Code"
//           style={styles.input}
//           value={picklistCode}
//           onChangeText={setPicklistCode}
//         />

//         <TouchableOpacity onPress={handleSort} style={styles.button}>
//           <Text style={styles.buttonText}>{sortOrder === "asc" ? "A-Z" : "Z-A"}</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Picklist Cards */}
//       <FlatList
//         data={filteredItems}
//         keyExtractor={(item) => item.id}
//         renderItem={renderItem}
//         contentContainerStyle={{ paddingBottom: 100 }}
//       />

//       {/* Filter Modal */}
//       <Modal visible={isFilterModalOpen} animationType="slide" transparent>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modal}>
//             <Text style={styles.modalTitle}>FILTERS</Text>

//             <Text style={styles.modalLabel}>SKU</Text>
//             <TextInput
//               style={styles.input}
//               value={filters.sku}
//               onChangeText={(text) => setFilters(prev => ({ ...prev, sku: text }))}
//               placeholder="e.g. SK001"
//             />

//             <Text style={styles.modalLabel}>Customer</Text>
//             <TextInput
//               style={styles.input}
//               value={filters.customers}
//               onChangeText={(text) => setFilters(prev => ({ ...prev, customers: text }))}
//               placeholder="e.g. Alpha Corp"
//             />

//             <Text style={styles.modalLabel}>Channel</Text>
//             <TextInput
//               style={styles.input}
//               value={filters.channel}
//               onChangeText={(text) => setFilters(prev => ({ ...prev, channel: text }))}
//               placeholder="e.g. Online"
//             />

//             <View style={styles.modalActions}>
//               <TouchableOpacity onPress={handleClearAllFilters}>
//                 <Text style={styles.clearText}>Clear All</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => setIsFilterModalOpen(false)} style={styles.applyButton}>
//                 <Text style={styles.applyText}>Apply</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff' },
//   header: {
//     height: 56,
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderBottomColor: '#e0e0e0',
//     borderBottomWidth: 1,
//     paddingHorizontal: 16,
//     justifyContent: 'space-between',
//   },
//   headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#374151' },
//   menuIcon: { fontSize: 24, color: '#374151' },
//   switchContainer: { flexDirection: 'row', alignItems: 'center' },
//   switchLabel: { marginRight: 8, fontSize: 12, color: '#374151' },
//   filterRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 12,
//     gap: 8,
//   },
//   button: {
//     backgroundColor: '#e5e7eb',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 4,
//   },
//   buttonText: { fontSize: 14, color: '#374151' },
//   input: {
//     flex: 1,
//     borderColor: '#d1d5db',
//     borderWidth: 1,
//     borderRadius: 4,
//     paddingHorizontal: 10,
//     height: 40,
//     fontSize: 14,
//     color: '#111827',
//   },
//   card: {
//     backgroundColor: '#f9fafb',
//     borderRadius: 8,
//     padding: 16,
//     marginHorizontal: 12,
//     marginVertical: 6,
//     borderColor: '#e5e7eb',
//     borderWidth: 1,
//   },
//   cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#111827' },
//   cardRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
//   cardColumn: { width: '50%', marginBottom: 8 },
//   cardLabel: { fontSize: 12, color: '#6b7280' },
//   cardValue: { fontSize: 14, color: '#111827', fontWeight: '500' },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: '#000000aa',
//     justifyContent: 'center',
//     padding: 20,
//   },
//   modal: {
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     padding: 20,
//   },
//   modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
//   modalLabel: { fontSize: 14, color: '#374151', marginTop: 12 },
//   modalActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 24,
//   },
//   clearText: { color: '#374151' },
//   applyButton: {
//     backgroundColor: '#2563eb',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 4,
//   },
//   applyText: { color: '#fff' },
// });



import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Switch,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

interface PicklistItem {
  id: string;
  picklistCode: string;
  pickType: string;
  orderType: string;
  order: string;
  fulfillmentTAT: string;
  paymentMethod: string;
  deliveryType: string;
  createdAt: string;
}

type NavigationProp = StackNavigationProp<RootStackParamList, 'B2BPacking'>;

export const B2BPackingScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const [filterVisible, setFilterVisible] = useState(false);
  const [sortByRecent, setSortByRecent] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'b2b' | 'b2c'>('all');
  const [searchText, setSearchText] = useState('');

  const picklists: PicklistItem[] = [
    {
      id: '1',
      picklistCode: 'PKL-001',
      pickType: 'B2B',
      orderType: 'Bulk',
      order: '10001',
      fulfillmentTAT: '24h',
      paymentMethod: 'Prepaid',
      deliveryType: 'Express',
      createdAt: '2024-08-01T10:00:00Z',
    },
    {
      id: '2',
      picklistCode: 'PKL-002',
      pickType: 'B2C',
      orderType: 'Single',
      order: '10002',
      fulfillmentTAT: '48h',
      paymentMethod: 'COD',
      deliveryType: 'Standard',
      createdAt: '2024-08-02T12:00:00Z',
    },
  ];

  const filteredPicklists = useMemo(() => {
    let filtered = [...picklists];

    if (filterType !== 'all') {
      filtered = filtered.filter(
        (item) => item.pickType.toLowerCase() === filterType
      );
    }

    if (searchText.trim()) {
      filtered = filtered.filter((item) =>
        item.picklistCode.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (sortByRecent) {
      filtered = filtered.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return filtered;
  }, [filterType, sortByRecent, searchText, picklists]);

  const renderItem = ({ item }: { item: PicklistItem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('PicklistDetail', { id: item.id })}
    >
      <Text style={styles.code}>{item.picklistCode}</Text>
      <Text>Type: {item.pickType}</Text>
      <Text>Order: {item.order}</Text>
      <Text>Created At: {new Date(item.createdAt).toLocaleString()}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>B2B Picklists</Text>
        <TouchableOpacity onPress={() => setFilterVisible(true)}>
          <Text style={styles.filterButton}>Filter</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search by Picklist Code"
        value={searchText}
        onChangeText={setSearchText}
      />

      <FlatList
        data={filteredPicklists}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />

      <Modal visible={filterVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filters</Text>

            <View style={styles.switchRow}>
              <Text>Sort by Recent</Text>
              <Switch value={sortByRecent} onValueChange={setSortByRecent} />
            </View>

            <View style={styles.filterRow}>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  filterType === 'all' && styles.selectedOption,
                ]}
                onPress={() => setFilterType('all')}
              >
                <Text>All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  filterType === 'b2b' && styles.selectedOption,
                ]}
                onPress={() => setFilterType('b2b')}
              >
                <Text>B2B</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  filterType === 'b2c' && styles.selectedOption,
                ]}
                onPress={() => setFilterType('b2c')}
              >
                <Text>B2C</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => setFilterVisible(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
  },
  title: { fontSize: 20, fontWeight: 'bold' },
  filterButton: { fontSize: 16, color: 'blue' },
  searchInput: {
    backgroundColor: '#eee',
    margin: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  listContainer: { paddingHorizontal: 12 },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  code: { fontWeight: 'bold', fontSize: 16 },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  filterOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedOption: {
    backgroundColor: '#ddd',
  },
  closeButton: {
    marginTop: 12,
    textAlign: 'center',
    color: 'red',
    fontWeight: 'bold',
  },
});
