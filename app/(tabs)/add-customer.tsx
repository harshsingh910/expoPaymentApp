import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import { UserPlus, User, Calendar, Percent, Clock, DollarSign, CheckCircle } from 'lucide-react-native';
import { ApiService } from '@/services/api';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;

export default function AddCustomerScreen() {
  const [formData, setFormData] = useState({
    customerName: '',
    issueDate: '',
    interestRate: '',
    tenureMonths: '',
    emiDueAmount: '',
    outstandingBalance: '',
  });
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const { customerName, issueDate, interestRate, tenureMonths, emiDueAmount, outstandingBalance } = formData;
    
    if (!customerName.trim()) {
      Alert.alert('Validation Error', 'Please enter customer name');
      return false;
    }

    if (!issueDate.trim()) {
      Alert.alert('Validation Error', 'Please enter issue date');
      return false;
    }

    if (!interestRate.trim() || parseFloat(interestRate) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid interest rate');
      return false;
    }

    if (!tenureMonths.trim() || parseInt(tenureMonths) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid tenure in months');
      return false;
    }

    if (!emiDueAmount.trim() || parseFloat(emiDueAmount) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid EMI amount');
      return false;
    }

    if (!outstandingBalance.trim() || parseFloat(outstandingBalance) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid outstanding balance');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const customerData = {
        customer_name: formData.customerName,
        issue_date: formData.issueDate,
        interest_rate: parseFloat(formData.interestRate),
        tenure_months: parseInt(formData.tenureMonths),
        emi_due_amount: parseFloat(formData.emiDueAmount),
        outstanding_balance: parseFloat(formData.outstandingBalance),
      };

      const result = await ApiService.createCustomer(customerData);

      Alert.alert(
        '✓ Success',
        `Account created successfully!\n\nAccount Number: ${result.account_number}\nCustomer: ${result.customer_name}`,
        [
          {
            text: 'Done',
            onPress: () => {
              setFormData({
                customerName: '',
                issueDate: '',
                interestRate: '',
                tenureMonths: '',
                emiDueAmount: '',
                outstandingBalance: '',
              });
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create customer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ 
    icon, 
    label, 
    placeholder, 
    value, 
    onChangeText, 
    keyboardType = 'default',
    fieldName
  }: any) => {
    const isFocused = focusedField === fieldName;
    const hasValue = value.length > 0;

    return (
      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, isFocused && styles.inputLabelFocused]}>
          {label}
        </Text>
        <View style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          hasValue && styles.inputWrapperFilled
        ]}>
          <View style={[styles.iconContainer, isFocused && styles.iconContainerFocused]}>
            {React.cloneElement(icon, { 
              color: isFocused ? '#7c3aed' : hasValue ? '#059669' : '#9ca3af',
              size: 22 
            })}
          </View>
          <TextInput
            style={styles.textInput}
            placeholder={placeholder}
            placeholderTextColor="#9ca3af"
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            autoCorrect={false}
            onFocus={() => setFocusedField(fieldName)}
            onBlur={() => setFocusedField(null)}
          />
          {hasValue && !isFocused && (
            <CheckCircle size={18} color="#059669" style={styles.checkIcon} />
          )}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <LinearGradient
          colors={['#7c3aed', '#5b21b6', '#4c1d95']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerIconContainer}>
            <UserPlus size={36} color="#ffffff" strokeWidth={2.5} />
          </View>
          <Text style={styles.headerTitle}>Add New Customer</Text>
          <Text style={styles.headerSubtitle}>Create a new loan account with ease</Text>
        </LinearGradient>

        <View style={styles.contentContainer}>
          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>Customer Details</Text>
              <View style={styles.formBadge}>
                <Text style={styles.formBadgeText}>Required</Text>
              </View>
            </View>

            <InputField
              icon={<User />}
              label="Customer Name"
              placeholder="Enter full name"
              value={formData.customerName}
              onChangeText={(value: string) => updateField('customerName', value)}
              fieldName="customerName"
            />

            <InputField
              icon={<Calendar />}
              label="Issue Date"
              placeholder="DD-MM-YYYY"
              value={formData.issueDate}
              onChangeText={(value: string) => updateField('issueDate', value)}
              fieldName="issueDate"
            />

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <InputField
                  icon={<Percent />}
                  label="Interest Rate"
                  placeholder="12.5"
                  value={formData.interestRate}
                  onChangeText={(value: string) => updateField('interestRate', value)}
                  keyboardType="decimal-pad"
                  fieldName="interestRate"
                />
              </View>

              <View style={styles.halfWidth}>
                <InputField
                  icon={<Clock />}
                  label="Tenure (Months)"
                  placeholder="24"
                  value={formData.tenureMonths}
                  onChangeText={(value: string) => updateField('tenureMonths', value)}
                  keyboardType="number-pad"
                  fieldName="tenureMonths"
                />
              </View>
            </View>

            <InputField
              icon={<DollarSign />}
              label="Monthly EMI Amount"
              placeholder="₹ 5,000"
              value={formData.emiDueAmount}
              onChangeText={(value: string) => updateField('emiDueAmount', value)}
              keyboardType="decimal-pad"
              fieldName="emiDueAmount"
            />

            <InputField
              icon={<DollarSign />}
              label="Outstanding Balance"
              placeholder="₹ 1,00,000"
              value={formData.outstandingBalance}
              onChangeText={(value: string) => updateField('outstandingBalance', value)}
              keyboardType="decimal-pad"
              fieldName="outstandingBalance"
            />

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={loading ? ['#9ca3af', '#6b7280'] : ['#7c3aed', '#5b21b6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitGradient}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <UserPlus size={22} color="#ffffff" strokeWidth={2.5} />
                )}
                <Text style={styles.submitButtonText}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <View style={styles.infoIconContainer}>
                <CheckCircle size={20} color="#7c3aed" />
              </View>
              <Text style={styles.infoTitle}>Guidelines</Text>
            </View>
            <View style={styles.infoList}>
              <InfoItem text="Customer name should match official documents" />
              <InfoItem text="Issue date format: DD-MM-YYYY" />
              <InfoItem text="Interest rate should be annual percentage" />
              <InfoItem text="All amounts should be in INR (₹)" />
              <InfoItem text="Account number will be auto-generated" />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  formBadgeText: {
    color: '#92400e',
    fontSize: 12,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 0,
  },
  halfWidth: {
    flex: 1,
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
  inputLabelFocused: {
    color: '#7c3aed',
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
    transition: 'all 0.2s',
  },
  inputWrapperFocused: {
    borderColor: '#7c3aed',
    backgroundColor: '#ffffff',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputWrapperFilled: {
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
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
  iconContainerFocused: {
    backgroundColor: '#ede9fe',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  checkIcon: {
    marginLeft: 8,
  },
  submitButton: {
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonDisabled: {
    shadowOpacity: 0.1,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  submitButtonText: {
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
    backgroundColor: '#ede9fe',
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
    backgroundColor: '#7c3aed',
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
});