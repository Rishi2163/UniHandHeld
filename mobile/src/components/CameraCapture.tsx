// Camera component for barcode scanning in React Native
import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  Dimensions,
  Image
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

interface CameraCaptureProps {
  onCapture?: (photoUri: string) => void;
  onScan?: (data: string) => void;
  mode?: 'photo' | 'barcode';
  overlayText?: string;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  onCapture,
  onScan,
  mode = 'barcode',
  overlayText = 'Position barcode in the center'
}) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        if (photo?.uri) {
          setCapturedPhoto(photo.uri);
          onCapture?.(photo.uri);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const deletePicture = () => {
    setCapturedPhoto(null);
  };

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (!isScanning) {
      setIsScanning(true);
      onScan?.(data);
      // Reset scanning state after a delay
      setTimeout(() => setIsScanning(false), 2000);
    }
  };

  const requestPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>No access to camera</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {capturedPhoto ? (
        <View style={styles.photoContainer}>
          <Image source={{ uri: capturedPhoto }} style={styles.capturedImage} />
          <TouchableOpacity style={styles.deleteButton} onPress={deletePicture}>
            <Text style={styles.buttonText}>Delete Photo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={'back'}
            onBarcodeScanned={mode === 'barcode' ? handleBarcodeScanned : undefined}
          >
            {/* Scanning overlay */}
            <View style={styles.overlay}>
              <View style={styles.scanArea}>
                <View style={styles.cornerTopLeft} />
                <View style={styles.cornerTopRight} />
                <View style={styles.cornerBottomLeft} />
                <View style={styles.cornerBottomRight} />
              </View>
              <Text style={styles.overlayText}>{overlayText}</Text>
            </View>
          </CameraView>
          
          {mode === 'photo' && (
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <Text style={styles.buttonText}>Take Picture</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 150,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#00ff00',
  },
  cornerTopRight: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#00ff00',
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#00ff00',
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#00ff00',
  },
  overlayText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 5,
  },
  message: {
    textAlign: 'center',
    fontSize: 18,
    color: '#fff',
    margin: 20,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    margin: 20,
  },
  captureButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    margin: 20,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 5,
    margin: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  photoContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  capturedImage: {
    flex: 1,
    resizeMode: 'contain',
  },
});