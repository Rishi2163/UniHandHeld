// // Landing/Welcome screen for the picking app
// import * as React from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   StatusBar,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import type { StackNavigationProp } from '@react-navigation/stack';
// import type { RootStackParamList } from '../navigation/AppNavigator';

// type NavigationProp = StackNavigationProp<RootStackParamList, 'PickingLanding'>;

// export const PickingLandingScreen: React.FC = () => {
//   const navigation = useNavigation<NavigationProp>();

//   const navigateToPicklists = () => {
//     navigation.navigate('B2BPacking');
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
//       <View style={styles.content}>
//         <View style={styles.header}>
//           <Text style={styles.title}>Picking Application</Text>
//           <Text style={styles.subtitle}>
//             Mobile warehouse picking and packing solution
//           </Text>
//         </View>

//         <View style={styles.buttonContainer}>
//           <TouchableOpacity 
//             style={styles.primaryButton} 
//             onPress={navigateToPicklists}
//           >
//             <Text style={styles.primaryButtonText}>
//               View Picklists
//             </Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={styles.secondaryButton}
//             onPress={() => {/* Navigate to settings or other features */}}
//           >
//             <Text style={styles.secondaryButtonText}>
//               Settings
//             </Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.footer}>
//           <Text style={styles.footerText}>
//             B2B Picking • Mobile Optimized
//           </Text>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: 24,
//     justifyContent: 'space-between',
//   },
//   header: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#1f2937',
//     textAlign: 'center',
//     marginBottom: 12,
//   },
//   subtitle: {
//     fontSize: 18,
//     color: '#6b7280',
//     textAlign: 'center',
//     lineHeight: 24,
//   },
//   buttonContainer: {
//     gap: 16,
//     marginBottom: 40,
//   },
//   primaryButton: {
//     backgroundColor: '#2563eb',
//     paddingVertical: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   primaryButtonText: {
//     color: '#ffffff',
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   secondaryButton: {
//     backgroundColor: 'transparent',
//     paddingVertical: 16,
//     borderRadius: 8,
//     borderWidth: 2,
//     borderColor: '#e5e7eb',
//     alignItems: 'center',
//   },
//   secondaryButtonText: {
//     color: '#374151',
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   footer: {
//     alignItems: 'center',
//     paddingBottom: 20,
//   },
//   footerText: {
//     fontSize: 14,
//     color: '#9ca3af',
//     textAlign: 'center',
//   },
// });

// import * as React from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   StatusBar,
//   Dimensions,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import type { StackNavigationProp } from "@react-navigation/stack";
// import type { RootStackParamList } from "../navigation/AppNavigator";
// // or any icon lib you use
// // If you don't have lucide-react-native, replace with your menu icon component

// type NavigationProp = StackNavigationProp<RootStackParamList, "PickingLanding">;

// const { width } = Dimensions.get("window");

// export const PickingLandingScreen: React.FC = () => {
//   const navigation = useNavigation<NavigationProp>();

//   const [isSideNavOpen, setIsSideNavOpen] = React.useState(false);

//   const handleMenuClick = () => {
//     // Hook this up to your side nav open logic
//     setIsSideNavOpen(true);
//   };

//   const handleCloseSideNav = () => {
//     setIsSideNavOpen(false);
//   };

//   const navigateToB2BPacking = () => {
//     navigation.navigate("B2BPacking");
//   };

//   const pickingOptions = [
//     {
//       title: "B2B PACKING",
//       isDisabled: false,
//       comingSoon: false,
//       onPress: navigateToB2BPacking,
//     },
//     {
//       title: "PICKLISTS",
//       isDisabled: true,
//       comingSoon: true,
//       onPress: () => {},
//     },
//   ];

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={handleMenuClick} style={styles.menuButton}>
//         <Text style={{fontSize: 24, color: '#374151'}}>☰</Text>
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>PICKING</Text>
//       </View>

//       {/* Picking options */}
//       <View style={styles.optionsContainer}>
//         {pickingOptions.map((option, idx) => (
//           <TouchableOpacity
//             key={idx}
//             activeOpacity={option.isDisabled ? 1 : 0.7}
//             onPress={option.isDisabled ? undefined : option.onPress}
//             style={[
//               styles.card,
//               option.isDisabled ? styles.cardDisabled : styles.cardEnabled,
//             ]}
//           >
//             <Text
//               style={[
//                 styles.cardTitle,
//                 option.isDisabled
//                   ? styles.cardTitleDisabled
//                   : styles.cardTitleEnabled,
//               ]}
//             >
//               {option.title}
//             </Text>
//             {option.comingSoon && (
//               <View style={styles.badge}>
//                 <Text style={styles.badgeText}>COMING SOON!</Text>
//               </View>
//             )}
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* You can add side nav modal or drawer here if needed */}
//     </SafeAreaView>
//   );
// };

// const CARD_HEIGHT = 120;
// const CARD_MARGIN = 16;
// const CARD_WIDTH = width - CARD_MARGIN * 2;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#ffffff",
//   },
//   header: {
//     height: 56,
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#e0e0e0",
//   },
//   menuButton: {
//     padding: 8,
//   },
//   headerTitle: {
//     flex: 1,
//     textAlign: "center",
//     fontSize: 20,
//     fontWeight: "700",
//     color: "#374151",
//     letterSpacing: 0,
//   },
//   optionsContainer: {
//     marginTop: 64,
//     paddingHorizontal: CARD_MARGIN,
//     gap: 16,
//   },
//   card: {
//     height: CARD_HEIGHT,
//     borderRadius: 12,
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     width: CARD_WIDTH,
//   },
//   cardEnabled: {
//     backgroundColor: "#f9fafb", // light bg for enabled card
//     borderWidth: 1,
//     borderColor: "#e0e0e0",
//   },
//   cardDisabled: {
//     backgroundColor: "#f0f0f0",
//   },
//   cardTitle: {
//     fontSize: 20,
//     fontWeight: "500",
//   },
//   cardTitleEnabled: {
//     color: "#374151",
//   },
//   cardTitleDisabled: {
//     color: "#a1a1aa",
//   },
//   badge: {
//     position: "absolute",
//     top: 12,
//     right: 12,
//     backgroundColor: "#2563eb",
//     borderRadius: 4,
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//   },
//   badgeText: {
//     color: "#ffffff",
//     fontSize: 12,
//     fontWeight: "600",
//   },
// });


// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Modal,
//   SafeAreaView,
//   FlatList,
//   StatusBar,
//   ScrollView,
//   Dimensions,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";

// export const PickingLandingScreen = (): JSX.Element => {
//   const [isSideNavOpen, setIsSideNavOpen] = useState(false);
//   const navigation = useNavigation();

//   const screenWidth = Dimensions.get("window").width;

//   const handleB2BPackingClick = () => {
//     navigation.navigate("B2BPackingScreen" as never);
//   };

//   const pickingOptions = [
//     {
//       title: "B2B PACKING",
//       isDisabled: false,
//       comingSoon: false,
//       onClick: handleB2BPackingClick,
//     },
//     {
//       title: "PICKLISTS",
//       isDisabled: true,
//       comingSoon: true,
//       onClick: () => {},
//     },
//   ];

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar backgroundColor="#fff" barStyle="dark-content" />

//       {/* Side Navigation */}
//       <Modal visible={isSideNavOpen} animationType="slide" transparent>
//         <View style={styles.sideNavOverlay}>
//           <View style={[styles.sideNav, { width: screenWidth * 0.75 }]}>
//             <TouchableOpacity
//               onPress={() => setIsSideNavOpen(false)}
//               style={styles.closeSideNav}
//             >
//               <Text style={styles.closeText}>Close</Text>
//             </TouchableOpacity>

//             {/* Add navigation items here */}
//             <Text style={styles.sideNavText}>Navigation Item</Text>
//           </View>
//         </View>
//       </Modal>

//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity
//           onPress={() => setIsSideNavOpen(true)}
//           style={styles.menuButton}
//         >
//           <Text style={{ fontSize: 24, color: "#374151" }}>☰</Text>
//         </TouchableOpacity>
//         <Text style={styles.pageTitle}>PICKING</Text>
//       </View>

//       {/* Main Content with ScrollView */}
//       <ScrollView
//         contentContainerStyle={styles.scrollContainer}
//         keyboardShouldPersistTaps="handled"
//       >
//         <FlatList
//           data={pickingOptions}
//           keyExtractor={(item) => item.title}
//           contentContainerStyle={styles.optionList}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               disabled={item.isDisabled}
//               onPress={item.onClick}
//               style={[
//                 styles.card,
//                 item.isDisabled ? styles.cardDisabled : styles.cardEnabled,
//               ]}
//             >
//               <Text
//                 style={[
//                   styles.cardTitle,
//                   item.isDisabled ? styles.disabledText : styles.enabledText,
//                 ]}
//               >
//                 {item.title}
//               </Text>
//               {item.comingSoon && (
//                 <View style={styles.badge}>
//                   <Text style={styles.badgeText}>COMING SOON!</Text>
//                 </View>
//               )}
//             </TouchableOpacity>
//           )}
//         />
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// // Responsive styles
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#ffffff",
//   },
//   scrollContainer: {
//     flexGrow: 1,
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     height: 56,
//     paddingHorizontal: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#e0e0e0",
//     backgroundColor: "#fff",
//   },
//   menuButton: {
//     width: 48,
//     height: 48,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   pageTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#000",
//     marginLeft: 16,
//   },
//   optionList: {
//     padding: 16,
//     paddingTop: 32,
//     flexGrow: 1,
//   },
//   card: {
//     height: 120,
//     borderRadius: 8,
//     padding: 16,
//     marginBottom: 16,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   cardEnabled: {
//     backgroundColor: "#fff",
//     borderColor: "#e0e0e0",
//     borderWidth: 1,
//     shadowColor: "#0000001a",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   cardDisabled: {
//     backgroundColor: "#eeeeee",
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: "500",
//   },
//   enabledText: {
//     color: "#000000",
//   },
//   disabledText: {
//     color: "#7a7a7a",
//   },
//   badge: {
//     marginTop: 8,
//     backgroundColor: "#007bff",
//     borderRadius: 4,
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//   },
//   badgeText: {
//     color: "#fff",
//     fontSize: 12,
//     fontWeight: "500",
//   },
//   sideNavOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.3)",
//     justifyContent: "flex-start",
//   },
//   sideNav: {
//     height: "100%",
//     backgroundColor: "#fff",
//     padding: 20,
//   },
//   closeSideNav: {
//     marginBottom: 20,
//   },
//   closeText: {
//     fontSize: 16,
//     color: "#007bff",
//   },
//   sideNavText: {
//     fontSize: 18,
//     marginVertical: 10,
//   },
// });

import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Modal,
  Animated,
  Dimensions,
  Switch,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { useBarcodeMode } from "../contexts/BarcodeModeContext";

type NavigationProp = StackNavigationProp<RootStackParamList, "PickingLanding">;

const { width } = Dimensions.get("window");

export const PickingLandingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { barcodeMode, setBarcodeMode } = useBarcodeMode();
  const [sidebarVisible, setSidebarVisible] = React.useState(false);
  const slideAnim = React.useRef(new Animated.Value(-width * 0.75)).current;

  const navigateToB2BPacking = () => {
    setSidebarVisible(false);
    navigation.navigate("B2BPacking");
  };

  const navigateToPicklists = () => {
    setSidebarVisible(false);
    navigation.navigate("B2BPacking");
  };

  const openSidebar = () => {
    setSidebarVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: -width * 0.75,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setSidebarVisible(false);
    });
  };

  const SidebarContent = () => (
    <Animated.View
      style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}
    >
      {/* Close button */}
      <TouchableOpacity style={styles.closeButton} onPress={closeSidebar}>
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>

      {/* User info section */}
      <View style={styles.userSection}>
        <View style={styles.userAvatar}>
          <Text style={styles.avatarText}>JW</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userEmail}>johnwick@unicommerce.com</Text>
          <TouchableOpacity>
            <Text style={styles.dropdownIcon}>⌄</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Barcode Mode Toggle */}
      <View style={styles.barcodeSection}>
        <View style={styles.barcodeModeRow}>
          <View style={styles.barcodeModeLeft}>
            <Text style={styles.barcodeModeIcon}>📊</Text>
            <View>
              <Text style={styles.barcodeModeTitle}>Barcode Mode</Text>
              <Text style={styles.barcodeModeSubtitle}>
                Camera scanning enabled
              </Text>
            </View>
          </View>
          <Switch
            value={barcodeMode}
            onValueChange={setBarcodeMode}
            trackColor={{ false: "#e5e7eb", true: "#000000" }}
            thumbColor={barcodeMode ? "#ffffff" : "#f3f4f6"}
          />
        </View>
      </View>

      {/* Navigation Items */}
      <View style={styles.navSection}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            closeSidebar();
          }}
        >
          <Text style={styles.navIcon}>📦</Text>
          <Text style={styles.navText}>Picking</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            closeSidebar();
            navigateToPicklists();
          }}
        >
          <Text style={styles.navIcon}>📋</Text>
          <Text style={styles.navText}>Picklists</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🔄</Text>
          <View style={styles.navTextContainer}>
            <Text style={styles.navText}>Cycle Count</Text>
            <View style={styles.comingSoonBadge}>
              <Text style={styles.comingSoonText}>COMING SOON!</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Bottom section */}
      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.facilitySection}>
          <View style={styles.facilityInfo}>
            <Text style={styles.facilityIcon}>🏢</Text>
            <Text style={styles.facilityText}>Facility_name</Text>
          </View>
          <Text style={styles.dropdownIcon}>⌄</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" translucent={false} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.hamburgerButton} onPress={openSidebar}>
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PICKING</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* B2B Packing Card */}
        <TouchableOpacity style={styles.card} onPress={navigateToB2BPacking}>
          <Text style={styles.cardTitle}>B2B PACKING</Text>
        </TouchableOpacity>

        {/* Picklists Card */}
        <TouchableOpacity style={[styles.card, styles.disabledCard]}>
          <Text style={[styles.cardTitle, styles.disabledCardTitle]}>
            PICKLISTS
          </Text>
          <View style={styles.comingSoonBadgeCard}>
            <Text style={styles.comingSoonTextCard}>COMING SOON!</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Sidebar Modal */}
      {sidebarVisible && (
        <Modal
          transparent
          visible={sidebarVisible}
          onRequestClose={closeSidebar}
          animationType="none"
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={styles.modalBackground}
              onPress={closeSidebar}
              activeOpacity={1}
            />
            <SidebarContent />
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingTop: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 24,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    minHeight: 64,
  },
  hamburgerButton: {
    width: 24,
    height: 24,
    justifyContent: "space-between",
  },
  hamburgerLine: {
    width: 24,
    height: 3,
    backgroundColor: "#000000",
    borderRadius: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
    letterSpacing: 1,
  },
  headerPlaceholder: {
    width: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    gap: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingVertical: 60,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  disabledCard: {
    backgroundColor: "#f3f4f6",
    opacity: 0.7,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    letterSpacing: 1,
  },
  disabledCardTitle: {
    color: "#9ca3af",
  },
  comingSoonBadgeCard: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 12,
  },
  comingSoonTextCard: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: width * 0.75,
    backgroundColor: "#ffffff",
    paddingTop: 0,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 1,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 20,
    color: "#ffffff",
  },
  userSection: {
    backgroundColor: "#374151",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#9ca3af",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
  },
  userInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userEmail: {
    color: "#ffffff",
    fontSize: 16,
  },
  dropdownIcon: {
    color: "#ffffff",
    fontSize: 16,
  },
  barcodeSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  barcodeModeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  barcodeModeLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  barcodeModeIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  barcodeModeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 2,
  },
  barcodeModeSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  navSection: {
    paddingVertical: 20,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  navIcon: {
    fontSize: 24,
    marginRight: 16,
    width: 32,
  },
  navText: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
  },
  navTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  comingSoonBadge: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 12,
  },
  comingSoonText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
  },
  bottomSection: {
    marginTop: "auto",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  facilitySection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#374151",
  },
  facilityInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  facilityIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  facilityText: {
    color: "#ffffff",
    fontSize: 16,
  },
});
