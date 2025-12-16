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
} from 'react-native';
import { UserPlus, User, Calendar, Percent, Clock, DollarSign } from 'lucide-react-native';
import { ApiService } from '@/services/api';

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

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const { customerName, issueDate, interestRate, tenureMonths, emiDueAmount, outstandingBalance } = formData;
    
    if (!customerName.trim()) {
      Alert.alert('Error', 'Please enter customer name');
      return false;
    }

    if (!issueDate.trim()) {
      Alert.alert('Error', 'Please enter issue date');
      return false;
    }

    if (!interestRate.trim() || parseFloat(interestRate) <= 0) {
      Alert.alert('Error', 'Please enter a valid interest rate');
      return false;
    }

    if (!tenureMonths.trim() || parseInt(tenureMonths) <= 0) {
      Alert.alert('Error', 'Please enter a valid tenure in months');
      return false;
    }

    if (!emiDueAmount.trim() || parseFloat(emiDueAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid EMI amount');
      return false;
    }

    if (!outstandingBalance.trim() || parseFloat(outstandingBalance) <= 0) {
      Alert.alert('Error', 'Please enter a valid outstanding balance');
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
        'Customer Added Successfully',
        `Account Number: ${result.account_number}\nCustomer: ${result.customer_name}`,
        [
          {
            text: 'OK',
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
    keyboardType = 'default' 
  }: any) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        {icon}
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCorrect={false}
        />
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <UserPlus size={32} color="#ffffff" />
        <Text style={styles.headerTitle}>Add New Customer</Text>
        <Text style={styles.headerSubtitle}>Create a new loan account</Text>
      </View>

      <View style={styles.formContainer}>
        <InputField
          icon={<User size={20} color="#6b7280" />}
          label="Customer Name"
          placeholder="Enter full name"
          value={formData.customerName}
          onChangeText={(value: string) => updateField('customerName', value)}
        />

        <InputField
          icon={<Calendar size={20} color="#6b7280" />}
          label="Issue Date"
          placeholder="DD-MM-YYYY"
          value={formData.issueDate}
          onChangeText={(value: string) => updateField('issueDate', value)}
        />

        <InputField
          icon={<Percent size={20} color="#6b7280" />}
          label="Interest Rate (%)"
          placeholder="Enter annual interest rate"
          value={formData.interestRate}
          onChangeText={(value: string) => updateField('interestRate', value)}
          keyboardType="decimal-pad"
        />

        <InputField
          icon={<Clock size={20} color="#6b7280" />}
          label="Tenure (Months)"
          placeholder="Enter loan tenure in months"
          value={formData.tenureMonths}
          onChangeText={(value: string) => updateField('tenureMonths', value)}
          keyboardType="number-pad"
        />

        <InputField
          icon={<DollarSign size={20} color="#6b7280" />}
          label="EMI Due Amount (₹)"
          placeholder="Enter monthly EMI amount"
          value={formData.emiDueAmount}
          onChangeText={(value: string) => updateField('emiDueAmount', value)}
          keyboardType="decimal-pad"
        />

        <InputField
          icon={<DollarSign size={20} color="#6b7280" />}
          label="Outstanding Balance (₹)"
          placeholder="Enter total outstanding balance"
          value={formData.outstandingBalance}
          onChangeText={(value: string) => updateField('outstandingBalance', value)}
          keyboardType="decimal-pad"
        />

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <UserPlus size={20} color="#ffffff" />
          )}
          <Text style={styles.submitButtonText}>
            {loading ? 'Creating Account...' : 'Create Customer Account'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Account Creation Guidelines</Text>
          <View style={styles.infoList}>
            <Text style={styles.infoItem}>• Customer name should match official documents</Text>
            <Text style={styles.infoItem}>• Issue date format: DD-MM-YYYY</Text>
            <Text style={styles.infoItem}>• Interest rate should be annual percentage</Text>
            <Text style={styles.infoItem}>• All amounts should be in INR</Text>
            <Text style={styles.infoItem}>• Account number will be auto-generated</Text>
          </View>
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
    backgroundColor: '#7c3aed',
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
    color: '#ddd6fe',
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  textInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#111827',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7c3aed',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 12,
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  infoContainer: {
    padding: 16,
    paddingBottom: 100,
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
});