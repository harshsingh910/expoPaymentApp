import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  Platform,
  Dimensions,
} from 'react-native';
import { CreditCard, DollarSign, CheckCircle, Hash, Sparkles, Info } from 'lucide-react-native';
import { ApiService } from '@/services/api';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;

export default function PaymentsScreen() {
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePayment = useCallback(async () => {
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
        '✓ Payment Successful',
        `Payment processed successfully!\n\nNew Balance: ₹${result.new_balance.toLocaleString('en-IN')}`,
        [
          {
            text: 'Done',
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
  }, [accountNumber, amount]);

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="none"
    >
      <LinearGradient
        colors={['#059669', '#047857', '#065f46']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerIconContainer}>
          <CreditCard size={36} color="#ffffff" strokeWidth={2.5} />
        </View>
        <Text style={styles.headerTitle}>Process Payment</Text>
        <Text style={styles.headerSubtitle}>Collect loan payments securely</Text>
      </LinearGradient>

      <View style={styles.contentContainer}>
        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Payment Details</Text>
            <View style={styles.formBadge}>
              <Sparkles size={14} color="#059669" />
              <Text style={styles.formBadgeText}>Secure</Text>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Account Number</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.iconContainer}>
                <Hash size={22} color={accountNumber ? '#7c3aed' : '#9ca3af'} />
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Enter customer account number"
                placeholderTextColor="#9ca3af"
                value={accountNumber}
                onChangeText={setAccountNumber}
                autoCapitalize="characters"
                autoCorrect={false}
                blurOnSubmit={false}
                returnKeyType="next"
              />
              {accountNumber.length > 0 && (
                <CheckCircle size={18} color="#7c3aed" style={styles.checkIcon} />
              )}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Payment Amount</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.iconContainer}>
                <DollarSign size={22} color={amount ? '#7c3aed' : '#9ca3af'} />
              </View>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={[styles.textInput, styles.amountInput]}
                placeholder="0.00"
                placeholderTextColor="#9ca3af"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                autoCorrect={false}
                blurOnSubmit={false}
                returnKeyType="done"
              />
              {amount.length > 0 && (
                <CheckCircle size={18} color="#7c3aed" style={styles.checkIcon} />
              )}
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
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={
                loading 
                  ? ['#9ca3af', '#6b7280'] 
                  : success 
                  ? ['#059669', '#047857'] 
                  : ['#059669', '#047857']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.paymentGradient}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : success ? (
                <CheckCircle size={22} color="#ffffff" strokeWidth={2.5} />
              ) : (
                <CreditCard size={22} color="#ffffff" strokeWidth={2.5} />
              )}
              <Text style={styles.paymentButtonText}>
                {loading ? 'Processing Payment...' : success ? 'Payment Successful!' : 'Process Payment'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <View style={styles.infoIconContainer}>
              <Info size={20} color="#059669" />
            </View>
            <Text style={styles.infoTitle}>Payment Guidelines</Text>
          </View>
          <View style={styles.infoList}>
            <InfoItem text="Verify account number before processing payment" />
            <InfoItem text="Amount should match EMI or outstanding balance" />
            <InfoItem text="All payments are processed instantly" />
            <InfoItem text="Receipt generated automatically after payment" />
            <InfoItem text="Check Customers tab for quick account lookup" />
          </View>
        </View>

        <View style={styles.tipCard}>
          <LinearGradient
            colors={['#fef3c7', '#fde68a']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.tipGradient}
          >
            <Sparkles size={24} color="#d97706" />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Quick Tip</Text>
              <Text style={styles.tipText}>
                Navigate to the Customers tab to quickly find account details and EMI amounts before processing payments.
              </Text>
            </View>
          </LinearGradient>
        </View>
      </View>
    </ScrollView>
  );
}

const InfoItem = ({ text }: { text: string }) => (
  <View style={styles.infoItemContainer}>
    <View style={styles.infoDot} />
    <Text style={styles.infoItem}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: isSmallScreen ? 26 : 32,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: isSmallScreen ? 14 : 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  contentContainer: {
    marginTop: -20,
    paddingHorizontal: 20,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  formBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  formBadgeText: {
    color: '#065f46',
    fontSize: 12,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#f9fafb',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6b7280',
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  amountInput: {
    fontSize: 18,
    fontWeight: '700',
  },
  checkIcon: {
    marginLeft: 8,
  },
  paymentButton: {
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  paymentButtonDisabled: {
    shadowOpacity: 0.1,
  },
  paymentButtonSuccess: {
    shadowColor: '#059669',
  },
  paymentGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  paymentButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    marginLeft: 10,
    letterSpacing: 0.5,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#d1fae5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  infoList: {
    gap: 12,
  },
  infoItemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#059669',
    marginTop: 6,
    marginRight: 12,
  },
  infoItem: {
    flex: 1,
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    fontWeight: '500',
  },
  tipCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 20,
  },
  tipGradient: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'flex-start',
  },
  tipContent: {
    flex: 1,
    marginLeft: 16,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#92400e',
    lineHeight: 20,
    fontWeight: '500',
  },
});