import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, ScanResult } from '../types';
import { apiService } from '../services/api';
import Toast from 'react-native-toast-message';

type CameraScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Camera'>;

interface Props {
  navigation: CameraScreenNavigationProp;
}

const CameraScreen: React.FC<Props> = ({ navigation }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      
      // Convert file to base64
      const base64 = await convertToBase64(file);
      
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
      console.error('Error processing file:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to process image',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleCapturePress = () => {
    fileInputRef.current?.click();
  };

  return (
    <View style={styles.container}>
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
          Click to select an invoice image file
        </Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.captureButton, isProcessing && styles.disabledButton]}
            onPress={handleCapturePress}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.captureButtonText}>
                📁 Select Image
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
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
    width: 300,
    height: 200,
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
    width: 200,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  disabledButton: {
    opacity: 0.6,
  },
  captureButtonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default CameraScreen;

