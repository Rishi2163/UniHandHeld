// Tote scanner screen for scanning tote/container barcodes
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { CameraCapture } from '../components/CameraCapture';

type NavigationProp = StackNavigationProp<RootStackParamList, 'ToteScanner'>;
type RouteProp = RouteProp<RootStackParamList, 'ToteScanner'>;

const ToteScannerScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp>();
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  const { id } = route.params;

  const handleBarcodeScanned = (data: string) => {
    setScannedData(data);
    Alert.alert(
      'Tote Scanned', 
      `Scanned: ${data}`,
      [
        { text: 'Scan Again', style: 'cancel' },
        { 
          text: 'Continue', 
          onPress: () => navigation.navigate('ShelfDetail', { id: data })
        }
      ]
    );
  };

  const handlePhotoCapture = (photoUri: string) => {
    setCapturedPhoto(photoUri);
  };

  const clearPhoto = () => {
    setCapturedPhoto(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Scan Tote</Text>
        {capturedPhoto && (
          <TouchableOpacity onPress={clearPhoto}>
            <Text style={styles.clearButton}>🗑️</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Camera Section */}
      <View style={styles.cameraContainer}>
        <CameraCapture
          mode="barcode"
          onScan={handleBarcodeScanned}
          onCapture={handlePhotoCapture}
          overlayText="Position tote barcode in the center"
        />
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          Scan tote to continue picking
        </Text>
        {scannedData && (
          <Text style={styles.scannedText}>
            Last scanned: {scannedData}
          </Text>
        )}
      </View>

      {/* Manual Input Option */}
      <View style={styles.bottomSection}>
        <TouchableOpacity 
          style={styles.manualButton}
          onPress={() => {
            Alert.prompt(
              'Manual Entry',
              'Enter tote barcode manually:',
              (text) => {
                if (text) {
                  handleBarcodeScanned(text);
                }
              }
            );
          }}
        >
          <Text style={styles.manualButtonText}>
            Enter Manually
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  backButton: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  clearButton: {
    fontSize: 20,
  },
  cameraContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  instructions: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  scannedText: {
    fontSize: 14,
    color: '#22c55e',
    textAlign: 'center',
  },
  bottomSection: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  manualButton: {
    backgroundColor: '#374151',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  manualButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});