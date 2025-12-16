import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { TrendingUp, DollarSign, Users, Clock } from 'lucide-react-native';
import { ApiService } from '@/services/api';
import { Customer } from '@/types/customer';

export default function DashboardScreen() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCustomers = async () => {
    try {
      const data = await ApiService.getCustomers();
      setCustomers(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load customers');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCustomers();
  };

  const totalOutstanding = customers.reduce(
    (sum, customer) => sum + parseFloat(customer.outstanding_balance),
    0
  );

  const totalEmiDue = customers.reduce(
    (sum, customer) => sum + parseFloat(customer.emi_due_amount),
    0
  );

  const averageInterestRate = customers.length > 0 
    ? customers.reduce((sum, customer) => sum + parseFloat(customer.interest_rate), 0) / customers.length
    : 0;

  const StatCard = ({ icon, title, value, subtitle, color }: any) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        {icon}
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statSubtitle}>{subtitle}</Text>
    </View>
  );

  const CustomerCard = ({ customer }: { customer: Customer }) => (
    <View style={styles.customerCard}>
      <View style={styles.customerHeader}>
        <Text style={styles.customerName}>{customer.customer_name}</Text>
        <Text style={styles.accountNumber}>{customer.account_number}</Text>
      </View>
      
      <View style={styles.customerDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Outstanding Balance</Text>
          <Text style={styles.detailValue}>₹{parseFloat(customer.outstanding_balance).toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>EMI Due</Text>
          <Text style={styles.detailValue}>₹{parseFloat(customer.emi_due_amount).toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Interest Rate</Text>
          <Text style={styles.detailValue}>{customer.interest_rate}%</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Loan Dashboard</Text>
        <Text style={styles.headerSubtitle}>Payment Collection Overview</Text>
      </View>

      <View style={styles.statsContainer}>
        <StatCard
          icon={<DollarSign size={24} color="#1e40af" />}
          title="Total Outstanding"
          value={`₹${totalOutstanding.toLocaleString('en-IN')}`}
          subtitle="Across all customers"
          color="#1e40af"
        />
        
        <StatCard
          icon={<Clock size={24} color="#d97706" />}
          title="Total EMI Due"
          value={`₹${totalEmiDue.toLocaleString('en-IN')}`}
          subtitle="This month"
          color="#d97706"
        />
        
        <StatCard
          icon={<Users size={24} color="#059669" />}
          title="Active Customers"
          value={customers.length.toString()}
          subtitle="Total loan accounts"
          color="#059669"
        />
        
        <StatCard
          icon={<TrendingUp size={24} color="#dc2626" />}
          title="Avg. Interest Rate"
          value={`${averageInterestRate.toFixed(2)}%`}
          subtitle="Portfolio average"
          color="#dc2626"
        />
      </View>

      <View style={styles.recentCustomersSection}>
        <Text style={styles.sectionTitle}>Recent Customers</Text>
        {customers.slice(0, 5).map((customer) => (
          <CustomerCard key={customer.id} customer={customer} />
        ))}
      </View>
    </ScrollView>
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
  header: {
    padding: 24,
    paddingTop: 64,
    backgroundColor: '#1e40af',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#bfdbfe',
  },
  statsContainer: {
    padding: 16,
    gap: 16,
  },
  statCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statTitle: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#9ca3af',
  },
  recentCustomersSection: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  customerCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
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
  customerHeader: {
    marginBottom: 12,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  accountNumber: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  customerDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
});