// Main React Native App component
// This replaces the web version and provides the same functionality on mobile
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import our navigation and providers
import { AppNavigator } from './src/navigation/AppNavigator';
import { BarcodeModeProvider } from './src/contexts/BarcodeModeContext';
import { queryClient } from './src/lib/queryClient';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <BarcodeModeProvider>
            <StatusBar style="auto" />
            <AppNavigator />
          </BarcodeModeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
