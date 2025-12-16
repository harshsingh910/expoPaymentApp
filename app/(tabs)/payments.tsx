import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { CreditCard, DollarSign, CircleCheck as CheckCircle } from 'lucide-react-native';
import { ApiService } from '@/services/api';

export default function PaymentsScreen() {
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePayment = async () => {
    if (!accountNumber.trim()) {
      Alert.alert('Error', 'Please enter an account number');
      return;
    }

    if (!amount.trim() || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const result = await ApiService.makePayment(accountNumber, parseFloat(amount));
      
      Alert.alert(
        'Payment Successful',
        `Payment processed successfully!\nNew Balance: ₹${result.new_balance.toLocaleString('en-IN')}`,
        [
          {
            text: 'OK',
            onPress: () => {
              setAccountNumber('');
              setAmount('');
              setSuccess(true);
              setTimeout(() => setSuccess(false), 3000);
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Payment Failed', 'Unable to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <CreditCard size={32} color="#ffffff" />
        <Text style={styles.headerTitle}>Process Payment</Text>
        <Text style={styles.headerSubtitle}>Collect loan payments securely</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Account Number</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter customer account number"
            value={accountNumber}
            onChangeText={setAccountNumber}
            autoCapitalize="characters"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Payment Amount (₹)</Text>
          <View style={styles.amountInputContainer}>
            <DollarSign size={20} color="#6b7280" />
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.paymentButton,
            loading && styles.paymentButtonDisabled,
            success && styles.paymentButtonSuccess,
          ]}
          onPress={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : success ? (
            <CheckCircle size={20} color="#ffffff" />
          ) : (
            <CreditCard size={20} color="#ffffff" />
          )}
          <Text style={styles.paymentButtonText}>
            {loading ? 'Processing...' : success ? 'Payment Successful' : 'Process Payment'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Payment Guidelines</Text>
          <View style={styles.infoList}>
            <Text style={styles.infoItem}>• Ensure account number is correct before processing</Text>
            <Text style={styles.infoItem}>• Payment amount should match customer's EMI or outstanding balance</Text>
            <Text style={styles.infoItem}>• All payments are processed instantly</Text>
            <Text style={styles.infoItem}>• Transaction receipt will be generated automatically</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Quick Actions</Text>
          <Text style={styles.infoDescription}>
            Use the Customers tab to quickly find account details and EMI amounts before processing payments.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 24,
    paddingTop: 64,
    backgroundColor: '#059669',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 12,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#a7f3d0',
  },
  formContainer: {
    padding: 24,
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  amountInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#111827',
  },
  paymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 12,
  },
  paymentButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  paymentButtonSuccess: {
    backgroundColor: '#059669',
  },
  paymentButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  infoContainer: {
    padding: 16,
    gap: 16,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  infoList: {
    gap: 8,
  },
  infoItem: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  infoDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});