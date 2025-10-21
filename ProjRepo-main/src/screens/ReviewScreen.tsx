import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, ScanResult, ValidationResult } from '../types';
import { apiService } from '../services/api';
import Toast from 'react-native-toast-message';

type ReviewScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Review'>;
type ReviewScreenRouteProp = RouteProp<RootStackParamList, 'Review'>;

interface Props {
  navigation: ReviewScreenNavigationProp;
  route: ReviewScreenRouteProp;
}

const ReviewScreen: React.FC<Props> = ({ navigation, route }) => {
  const { scanResult } = route.params;
  const [vendor, setVendor] = useState(scanResult.extractedData?.vendor || '');
  const [date, setDate] = useState(scanResult.extractedData?.date || '');
  const [total, setTotal] = useState(scanResult.extractedData?.total?.toString() || '');
  const [isValidating, setIsValidating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);

  useEffect(() => {
    if (scanResult.duplicateCheck.isDuplicate) {
      setShowDuplicateAlert(true);
    }
  }, [scanResult.duplicateCheck.isDuplicate]);

  const handleValidate = async () => {
    if (!vendor.trim() || !date.trim() || !total.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setIsValidating(true);
      const result = await apiService.validateInvoice({
        vendor: vendor.trim(),
        date: date.trim(),
        total: parseFloat(total),
      });
      setValidationResult(result);
    } catch (error) {
      console.error('Error validating invoice:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to validate invoice',
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleSave = async () => {
    if (!vendor.trim() || !date.trim() || !total.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setIsSaving(true);
      await apiService.saveInvoice({
        vendor: vendor.trim(),
        date: date.trim(),
        total: parseFloat(total),
        imageBase64: scanResult.imageBase64,
        duplicateOfId: scanResult.duplicateCheck.isDuplicate 
          ? scanResult.duplicateCheck.similarInvoices[0]?.id 
          : undefined,
      });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Invoice saved successfully',
      });

      navigation.navigate('Home');
    } catch (error) {
      console.error('Error saving invoice:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save invoice',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleMarkAsDuplicate = () => {
    setShowDuplicateAlert(false);
    // Continue with save as duplicate
  };

  const handleContinueAnyway = () => {
    setShowDuplicateAlert(false);
    // Continue with normal save
  };

  const DuplicateAlert = () => (
    <View style={styles.duplicateAlert}>
      <Text style={styles.duplicateTitle}>⚠️ Potential Duplicate Detected</Text>
      <Text style={styles.duplicateText}>
        This invoice appears similar to a previously scanned invoice.
      </Text>
      
      {scanResult.duplicateCheck.similarInvoices.length > 0 && (
        <View style={styles.similarInvoice}>
          <Text style={styles.similarInvoiceText}>
            Similar to: {scanResult.duplicateCheck.similarInvoices[0].vendor} - 
            ${scanResult.duplicateCheck.similarInvoices[0].total.toFixed(2)}
          </Text>
        </View>
      )}

      <View style={styles.duplicateActions}>
        <TouchableOpacity
          style={styles.duplicateButton}
          onPress={handleMarkAsDuplicate}
        >
          <Text style={styles.duplicateButtonText}>Mark as Duplicate</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.duplicateButton, styles.continueButton]}
          onPress={handleContinueAnyway}
        >
          <Text style={[styles.duplicateButtonText, styles.continueButtonText]}>
            Continue Anyway
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {showDuplicateAlert && <DuplicateAlert />}

      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Invoice Details</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Vendor *</Text>
          <TextInput
            style={styles.input}
            value={vendor}
            onChangeText={setVendor}
            placeholder="Enter vendor name"
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date *</Text>
          <TextInput
            style={styles.input}
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
            keyboardType="default"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Total Amount *</Text>
          <TextInput
            style={styles.input}
            value={total}
            onChangeText={setTotal}
            placeholder="0.00"
            keyboardType="numeric"
          />
        </View>

        {validationResult && !validationResult.isValid && validationResult.question && (
          <View style={styles.validationAlert}>
            <Text style={styles.validationText}>
              ❓ {validationResult.question}
            </Text>
          </View>
        )}

        {validationResult && validationResult.isValid && (
          <View style={styles.validationSuccess}>
            <Text style={styles.validationSuccessText}>
              ✅ All fields look good!
            </Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.validateButton]}
            onPress={handleValidate}
            disabled={isValidating || isSaving}
          >
            {isValidating ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Validate Fields</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleSave}
            disabled={isValidating || isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Save Invoice</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  duplicateAlert: {
    backgroundColor: '#FFF3CD',
    borderColor: '#FFEAA7',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    margin: 16,
  },
  duplicateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  duplicateText: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 12,
  },
  similarInvoice: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  similarInvoiceText: {
    fontSize: 14,
    color: '#333',
  },
  duplicateActions: {
    flexDirection: 'row',
    gap: 12,
  },
  duplicateButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#6C757D',
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: '#28A745',
  },
  duplicateButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  continueButtonText: {
    color: '#ffffff',
  },
  form: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  validationAlert: {
    backgroundColor: '#F8D7DA',
    borderColor: '#F5C6CB',
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
  },
  validationText: {
    color: '#721C24',
    fontSize: 14,
  },
  validationSuccess: {
    backgroundColor: '#D4EDDA',
    borderColor: '#C3E6CB',
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
  },
  validationSuccessText: {
    color: '#155724',
    fontSize: 14,
  },
  buttonContainer: {
    gap: 12,
    marginTop: 20,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  validateButton: {
    backgroundColor: '#17A2B8',
  },
  saveButton: {
    backgroundColor: '#28A745',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ReviewScreen;

