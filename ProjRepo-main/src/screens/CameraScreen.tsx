import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, ScanResult } from '../types';
import { apiService } from '../services/api';
import { convertToBase64 } from '../utils/imageUtils';
import Toast from 'react-native-toast-message';

// Import web version for browser
const CameraScreenWeb = React.lazy(() => import('./CameraScreen.web'));

// Import VisionCamera only for native platforms
let Camera: any, useCameraDevices: any;
if (Platform.OS !== 'web') {
  const visionCamera = require('react-native-vision-camera');
  Camera = visionCamera.Camera;
  useCameraDevices = visionCamera.useCameraDevices;
}

type CameraScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Camera'>;

interface Props {
  navigation: CameraScreenNavigationProp;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CameraScreen: React.FC<Props> = ({ navigation }) => {
  // Use web version for browser
  if (Platform.OS === 'web') {
    return (
      <React.Suspense fallback={<View style={styles.centerContainer}><ActivityIndicator size="large" color="#007AFF" /></View>}>
        <CameraScreenWeb navigation={navigation} />
      </React.Suspense>
    );
  }

  const camera = useRef<any>(null);
  const devices = useCameraDevices ? useCameraDevices() : { back: null };
  const device = devices.back;
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    try {
      const permission = await Camera.requestCameraPermission();
      setHasPermission(permission === 'authorized');
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      setHasPermission(false);
    }
  };

  const capturePhoto = async () => {
    if (!camera.current || isCapturing || isProcessing) return;

    try {
      setIsCapturing(true);
      const photo = await camera.current.takePhoto({
        qualityPrioritization: 'quality',
        flash: 'off',
      });

      await processPhoto(photo);
    } catch (error) {
      console.error('Error capturing photo:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to capture photo',
      });
    } finally {
      setIsCapturing(false);
    }
  };

  const processPhoto = async (photo: any) => {
    try {
      setIsProcessing(true);
      
      // Convert photo to base64
      const base64 = await convertToBase64(photo.path);
      
      // Check for duplicates
      const duplicateCheck = await apiService.checkDuplicates(base64);
      
      const scanResult: ScanResult = {
        imageBase64: base64,
        duplicateCheck,
        extractedData: {
          vendor: '',
          date: new Date().toISOString().split('T')[0],
          total: 0,
        },
      };

      navigation.navigate('Review', { scanResult });
    } catch (error) {
      console.error('Error processing photo:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to process photo',
      });
    } finally {
      setIsProcessing(false);
    }
  };


  if (hasPermission === null) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Camera permission denied</Text>
        <TouchableOpacity style={styles.button} onPress={checkCameraPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No camera device found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={styles.camera}
        device={device}
        isActive={true}
        photo={true}
        enableZoomGesture={true}
      />
      
      <View style={styles.overlay}>
        <View style={styles.scanArea}>
          <View style={styles.corner} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
      </View>

      <View style={styles.controls}>
        <Text style={styles.instructionText}>
          Position the invoice within the frame and tap to capture
        </Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.captureButton, (isCapturing || isProcessing) && styles.disabledButton]}
            onPress={capturePhoto}
            disabled={isCapturing || isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.captureButtonText}>
                {isCapturing ? 'Capturing...' : '📷'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: screenWidth * 0.8,
    height: screenHeight * 0.4,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderLeftWidth: 3,
    borderTopWidth: 3,
    borderColor: '#007AFF',
    top: 0,
    left: 0,
  },
  topRight: {
    borderLeftWidth: 0,
    borderRightWidth: 3,
    right: 0,
    left: 'auto',
  },
  bottomLeft: {
    borderTopWidth: 0,
    borderBottomWidth: 3,
    bottom: 0,
    top: 'auto',
  },
  bottomRight: {
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    right: 0,
    bottom: 0,
    left: 'auto',
    top: 'auto',
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
    paddingBottom: 40,
  },
  instructionText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  disabledButton: {
    opacity: 0.6,
  },
  captureButtonText: {
    fontSize: 32,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CameraScreen;
