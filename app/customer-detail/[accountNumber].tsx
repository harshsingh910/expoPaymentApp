import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  FlatList,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, User, Calendar, DollarSign, CreditCard } from 'lucide-react-native';
import { ApiService } from '@/services/api';
import { Customer, Payment } from '@/types/customer';

export default function CustomerDetailScreen() {
  const { accountNumber } = useLocalSearchParams<{ accountNumber: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCustomerData = async () => {
    try {
      // Fetch customer details
      const customers = await ApiService.getCustomers();
      const foundCustomer = customers.find(c => c.account_number === accountNumber);
      setCustomer(foundCustomer || null);

      // Fetch payment history
      if (accountNumber) {
        const paymentsData = await ApiService.getPayments(accountNumber);
        setPayments(paymentsData);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load customer data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, [accountNumber]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCustomerData();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const formatCurrency = (amount: string) => {
    return `₹${parseFloat(amount).toLocaleString('en-IN')}`;
  };

  const PaymentCard = ({ payment }: { payment: Payment }) => (
    <View style={styles.paymentCard}>
      <View style={styles.paymentHeader}>
        <View style={styles.paymentInfo}>
          <Text style={styles.paymentAmount}>{formatCurrency(payment.amount_paid)}</Text>
          <Text style={styles.paymentDate}>{formatDate(payment.payment_date)}</Text>
        </View>
        <View style={[
          styles.statusBadge,
          payment.status === 'SUCCESS' ? styles.successBadge : styles.pendingBadge
        ]}>
          <Text style={[
            styles.statusText,
            payment.status === 'SUCCESS' ? styles.successText : styles.pendingText
          ]}>
            {payment.status}
          </Text>
        </View>
      </View>
      <Text style={styles.paymentId}>Payment ID: {payment.payment_id}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading customer details...</Text>
      </View>
    );
  }

  if (!customer) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Customer not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{customer.customer_name}</Text>
          <Text style={styles.headerSubtitle}>{customer.account_number}</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.customerInfoCard}>
          <Text style={styles.cardTitle}>Loan Details</Text>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <DollarSign size={16} color="#1e40af" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Outstanding Balance</Text>
                <Text style={styles.infoValue}>{formatCurrency(customer.outstanding_balance)}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <CreditCard size={16} color="#d97706" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>EMI Due Amount</Text>
                <Text style={styles.infoValue}>{formatCurrency(customer.emi_due_amount)}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Calendar size={16} color="#059669" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Issue Date</Text>
                <Text style={styles.infoValue}>{formatDate(customer.issue_date)}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.percentIcon}>%</Text>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Interest Rate</Text>
                <Text style={styles.infoValue}>{customer.interest_rate}%</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <User size={16} color="#7c3aed" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Tenure</Text>
                <Text style={styles.infoValue}>{customer.tenure_months} months</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.paymentsSection}>
          <Text style={styles.sectionTitle}>Payment History</Text>
          {payments.length > 0 ? (
            <FlatList
              data={payments}
              renderItem={({ item }) => <PaymentCard payment={item} />}
              keyExtractor={(item) => item.payment_id.toString()}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No payments recorded yet</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#dc2626',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#1e40af',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#1e40af',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#bfdbfe',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  customerInfoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  percentIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc2626',
    width: 16,
    textAlign: 'center',
  },
  paymentsSection: {
    marginBottom: 100,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  paymentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  paymentDate: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  successBadge: {
    backgroundColor: '#dcfce7',
  },
  pendingBadge: {
    backgroundColor: '#fef3c7',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  successText: {
    color: '#059669',
  },
  pendingText: {
    color: '#d97706',
  },
  paymentId: {
    fontSize: 12,
    color: '#9ca3af',
  },
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6b7280',
  },
});