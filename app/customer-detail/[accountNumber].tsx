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
  Platform,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  DollarSign, 
  CreditCard,
  Percent,
  Clock,
  CheckCircle,
  TrendingUp,
  Receipt
} from 'lucide-react-native';
import { ApiService } from '@/services/api';
import { Customer, Payment } from '@/types/customer';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;

export default function CustomerDetailScreen() {
  const { accountNumber } = useLocalSearchParams<{ accountNumber: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCustomerData = async () => {
    try {
      const customers = await ApiService.getCustomers();
      const foundCustomer = customers.find(c => c.account_number === accountNumber);
      setCustomer(foundCustomer || null);

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
      <LinearGradient
        colors={payment.status === 'SUCCESS' ? ['#d1fae5', '#ecfdf5'] : ['#fef3c7', '#fef9c3']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.paymentGradient}
      >
        <View style={styles.paymentHeader}>
          <View style={[
            styles.paymentIconContainer,
            payment.status === 'SUCCESS' ? styles.successIconContainer : styles.pendingIconContainer
          ]}>
            {payment.status === 'SUCCESS' ? (
              <CheckCircle size={20} color="#059669" />
            ) : (
              <Clock size={20} color="#d97706" />
            )}
          </View>
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
        <View style={styles.paymentFooter}>
          <Receipt size={14} color="#6b7280" />
          <Text style={styles.paymentId}>ID: {payment.payment_id}</Text>
        </View>
      </LinearGradient>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={['#7c3aed', '#5b21b6']}
          style={styles.loadingGradient}
        >
          <TrendingUp size={48} color="#ffffff" />
          <Text style={styles.loadingText}>Loading customer details...</Text>
        </LinearGradient>
      </View>
    );
  }

  if (!customer) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorIconContainer}>
          <User size={48} color="#ef4444" />
        </View>
        <Text style={styles.errorTitle}>Customer Not Found</Text>
        <Text style={styles.errorText}>The requested customer account does not exist</Text>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#7c3aed', '#5b21b6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.backGradient}
          >
            <ArrowLeft size={20} color="#ffffff" />
            <Text style={styles.backButtonText}>Go Back</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#7c3aed', '#5b21b6', '#4c1d95']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backIcon} 
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <View style={styles.backIconContainer}>
              <ArrowLeft size={24} color="#ffffff" strokeWidth={2.5} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.headerContent}>
          <View style={styles.customerAvatarLarge}>
            <Text style={styles.customerAvatarTextLarge}>
              {customer.customer_name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.headerTitle}>{customer.customer_name}</Text>
          <Text style={styles.headerSubtitle}>{customer.account_number}</Text>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#7c3aed"
            colors={['#7c3aed']}
          />
        }
      >
        <View style={styles.contentContainer}>
          <View style={styles.customerInfoCard}>
            <View style={styles.cardHeader}>
              <TrendingUp size={24} color="#7c3aed" />
              <Text style={styles.cardTitle}>Loan Overview</Text>
            </View>
            
            <View style={styles.infoGrid}>
              <View style={styles.infoItemLarge}>
                <View style={styles.infoIconContainerLarge}>
                  <DollarSign size={20} color="#7c3aed" strokeWidth={2.5} />
                </View>
                <View style={styles.infoContentLarge}>
                  <Text style={styles.infoLabelLarge}>Outstanding Balance</Text>
                  <Text style={styles.infoValueLarge}>{formatCurrency(customer.outstanding_balance)}</Text>
                </View>
              </View>

              <View style={styles.infoItemLarge}>
                <View style={[styles.infoIconContainerLarge, { backgroundColor: '#fef3c7' }]}>
                  <CreditCard size={20} color="#d97706" strokeWidth={2.5} />
                </View>
                <View style={styles.infoContentLarge}>
                  <Text style={styles.infoLabelLarge}>Monthly EMI</Text>
                  <Text style={[styles.infoValueLarge, { color: '#d97706' }]}>
                    {formatCurrency(customer.emi_due_amount)}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <View style={[styles.detailIcon, { backgroundColor: '#dbeafe' }]}>
                    <Calendar size={16} color="#1e40af" />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Issue Date</Text>
                    <Text style={styles.detailValue}>{formatDate(customer.issue_date)}</Text>
                  </View>
                </View>

                <View style={styles.detailItem}>
                  <View style={[styles.detailIcon, { backgroundColor: '#fee2e2' }]}>
                    <Percent size={16} color="#dc2626" />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Interest Rate</Text>
                    <Text style={styles.detailValue}>{customer.interest_rate}% p.a.</Text>
                  </View>
                </View>

                <View style={styles.detailItem}>
                  <View style={[styles.detailIcon, { backgroundColor: '#d1fae5' }]}>
                    <Clock size={16} color="#059669" />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Tenure</Text>
                    <Text style={styles.detailValue}>{customer.tenure_months} months</Text>
                  </View>
                </View>

                <View style={styles.detailItem}>
                  <View style={[styles.detailIcon, { backgroundColor: '#ede9fe' }]}>
                    <User size={16} color="#7c3aed" />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Account Type</Text>
                    <Text style={styles.detailValue}>Active Loan</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.paymentsSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Receipt size={24} color="#111827" />
                <Text style={styles.sectionTitle}>Payment History</Text>
              </View>
              {payments.length > 0 && (
                <View style={styles.paymentCountBadge}>
                  <Text style={styles.paymentCountText}>{payments.length}</Text>
                </View>
              )}
            </View>

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
                <View style={styles.emptyIconContainer}>
                  <Receipt size={48} color="#d1d5db" />
                </View>
                <Text style={styles.emptyStateTitle}>No Payments Yet</Text>
                <Text style={styles.emptyStateText}>
                  Payment history will appear here once transactions are recorded
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 32,
  },
  errorIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  backButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  backGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    marginLeft: 8,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: {
    marginBottom: 20,
  },
  backIcon: {
    width: 40,
    height: 40,
  },
  backIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  customerAvatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  customerAvatarTextLarge: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
  },
  headerTitle: {
    fontSize: isSmallScreen ? 24 : 28,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: isSmallScreen ? 14 : 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    marginTop: -20,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  customerInfoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 12,
  },
  infoGrid: {
    gap: 20,
  },
  infoItemLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 16,
  },
  infoIconContainerLarge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#ede9fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  infoContentLarge: {
    flex: 1,
  },
  infoLabelLarge: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValueLarge: {
    fontSize: 22,
    fontWeight: '800',
    color: '#7c3aed',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  detailsGrid: {
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  paymentsSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 12,
  },
  paymentCountBadge: {
    backgroundColor: '#ede9fe',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  paymentCountText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7c3aed',
  },
  paymentCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentGradient: {
    padding: 16,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  successIconContainer: {
    backgroundColor: '#d1fae5',
  },
  pendingIconContainer: {
    backgroundColor: '#fef3c7',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 2,
  },
  paymentDate: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  successBadge: {
    backgroundColor: '#059669',
  },
  pendingBadge: {
    backgroundColor: '#d97706',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  successText: {
    color: '#ffffff',
  },
  pendingText: {
    color: '#ffffff',
  },
  paymentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentId: {
    fontSize: 12,
    color: '#9ca3af',
    marginLeft: 6,
    fontWeight: '500',
  },
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 48,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
  },
});