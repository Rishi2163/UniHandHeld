// Main navigation setup for React Native app using React Navigation
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import all the screens
import PickingLandingScreen from '../screens/PickingLandingScreen';
import B2BPackingScreen from '../screens/B2BPackingScreen';
import PicklistDetailScreen from '../screens/PicklistDetailScreen';
import ToteScannerScreen from '../screens/ToteScannerScreen';
import ShelfDetailScreen from '../screens/ShelfDetailScreen';
import SKUScannerScreen from '../screens/SKUScannerScreen';
import ShelfSelectionScreen from '../screens/ShelfSelectionScreen';
import SKUInputScreen from '../screens/SKUInputScreen';

// Define the parameter list for type safety
export type RootStackParamList = {
  PickingLanding: undefined;
  B2BPacking: undefined;
  PicklistDetail: { id: string };
  ToteScanner: { id: string };
  ShelfDetail: { id: string };
  SKUScanner: { toteId: string };
  ShelfSelection: { id: string };
  SKUInput: { id: string; shelfCode: string };
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// Tab navigator for main sections
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
        },
      }}
    >
      <Tab.Screen 
        name="Picking" 
        component={PickingLandingScreen}
        options={{
          tabBarLabel: 'Picking',
        }}
      />
      <Tab.Screen 
        name="Picklists" 
        component={B2BPackingScreen}
        options={{
          tabBarLabel: 'Picklists',
        }}
      />
    </Tab.Navigator>
  );
};

// Main stack navigator
export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="PickingLanding"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="PickingLanding" component={TabNavigator} />
        <Stack.Screen name="B2BPacking" component={B2BPackingScreen} />
        <Stack.Screen 
          name="PicklistDetail" 
          component={PicklistDetailScreen}
          options={({ route }) => ({
            title: `Picklist ${route.params.id}`,
          })}
        />
        <Stack.Screen 
          name="ToteScanner" 
          component={ToteScannerScreen}
          options={{
            title: 'Scan Tote',
          }}
        />
        <Stack.Screen 
          name="ShelfDetail" 
          component={ShelfDetailScreen}
          options={{
            title: 'Shelf Details',
          }}
        />
        <Stack.Screen 
          name="SKUScanner" 
          component={SKUScannerScreen}
          options={{
            title: 'Scan Products',
          }}
        />
        <Stack.Screen 
          name="ShelfSelection" 
          component={ShelfSelectionScreen}
          options={{
            title: 'Select Shelf',
          }}
        />
        <Stack.Screen 
          name="SKUInput" 
          component={SKUInputScreen}
          options={{
            title: 'Enter SKU',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};