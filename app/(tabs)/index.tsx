import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  Platform,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { TrendingUp, DollarSign, Users, Clock, Sparkles, ArrowUpRight } from 'lucide-react-native';
import { ApiService } from '@/services/api';
import { Customer } from '@/types/customer';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;

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

  const StatCard = ({ icon, title, value, subtitle, colors, index }: any) => (
    <TouchableOpacity 
      style={styles.statCard}
      activeOpacity={0.7}
      delayPressIn={50}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.statGradient}
      >
        <View style={styles.statIconContainer}>
          {icon}
        </View>
        <View style={styles.statContent}>
          <Text style={styles.statTitle}>{title}</Text>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statSubtitle}>{subtitle}</Text>
        </View>
        <View style={styles.statArrow}>
          <ArrowUpRight size={20} color="rgba(255, 255, 255, 0.6)" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const CustomerCard = ({ customer }: { customer: Customer }) => (
    <TouchableOpacity 
      style={styles.customerCard}
      activeOpacity={0.7}
      onPress={() => router.push(`/customer-detail/${customer.account_number}`)}
    >
      <View style={styles.customerCardContent}>
        <View style={styles.customerHeader}>
          <View style={styles.customerAvatar}>
            <Text style={styles.customerAvatarText}>
              {customer.customer_name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName} numberOfLines={1}>
              {customer.customer_name}
            </Text>
            <Text style={styles.accountNumber}>{customer.account_number}</Text>
          </View>
        </View>
        
        <View style={styles.customerDivider} />
        
        <View style={styles.customerDetails}>
          <View style={styles.detailItem}>
            <View style={styles.detailIconContainer}>
              <DollarSign size={14} color="#7c3aed" />
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Outstanding</Text>
              <Text style={styles.detailValue}>
                ₹{parseFloat(customer.outstanding_balance).toLocaleString('en-IN')}
              </Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={[styles.detailIconContainer, { backgroundColor: '#fef3c7' }]}>
              <Clock size={14} color="#d97706" />
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>EMI Due</Text>
              <Text style={styles.detailValue}>
                ₹{parseFloat(customer.emi_due_amount).toLocaleString('en-IN')}
              </Text>
            </View>
          </View>

          <View style={styles.interestBadge}>
            <Text style={styles.interestBadgeText}>{customer.interest_rate}% p.a.</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={['#7c3aed', '#5b21b6']}
          style={styles.loadingGradient}
        >
          <Sparkles size={48} color="#ffffff" />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
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
      <LinearGradient
        colors={['#7c3aed', '#5b21b6', '#4c1d95']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerIconContainer}>
            <Sparkles size={28} color="#ffffff" />
          </View>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSubtitle}>Your loan portfolio at a glance</Text>
        </View>
      </LinearGradient>

      <View style={styles.statsContainer}>
        <StatCard
          icon={<DollarSign size={24} color="#ffffff" strokeWidth={2.5} />}
          title="Total Outstanding"
          value={`₹${(totalOutstanding / 100000).toFixed(1)}L`}
          subtitle="Across all customers"
          colors={['#7c3aed', '#5b21b6']}
          index={0}
        />
        
        <StatCard
          icon={<Clock size={24} color="#ffffff" strokeWidth={2.5} />}
          title="EMI Due"
          value={`₹${(totalEmiDue / 1000).toFixed(1)}K`}
          subtitle="This month"
          colors={['#f59e0b', '#d97706']}
          index={1}
        />
        
        <View style={styles.statsRow}>
          <View style={styles.halfStatCard}>
            <LinearGradient
              colors={['#059669', '#047857']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.halfStatGradient}
            >
              <Users size={20} color="#ffffff" strokeWidth={2.5} />
              <Text style={styles.halfStatValue}>{customers.length}</Text>
              <Text style={styles.halfStatLabel}>Active Loans</Text>
            </LinearGradient>
          </View>

          <View style={styles.halfStatCard}>
            <LinearGradient
              colors={['#ef4444', '#dc2626']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.halfStatGradient}
            >
              <TrendingUp size={20} color="#ffffff" strokeWidth={2.5} />
              <Text style={styles.halfStatValue}>{averageInterestRate.toFixed(1)}%</Text>
              <Text style={styles.halfStatLabel}>Avg. Interest</Text>
            </LinearGradient>
          </View>
        </View>
      </View>

      <View style={styles.recentCustomersSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Customers</Text>
          <TouchableOpacity onPress={() => router.push('/customers')}>
            <Text style={styles.viewAllButton}>View All →</Text>
          </TouchableOpacity>
        </View>
        {customers.slice(0, 5).map((customer) => (
          <CustomerCard key={customer.id} customer={customer} />
        ))}
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
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
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: isSmallScreen ? 28 : 34,
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
  statsContainer: {
    marginTop: -20,
    paddingHorizontal: 20,
    gap: 16,
  },
  statCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  statGradient: {
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  statContent: {
    flex: 1,
  },
  statTitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 6,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  statArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  halfStatCard: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  halfStatGradient: {
    padding: 20,
    alignItems: 'center',
  },
  halfStatValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 12,
    marginBottom: 4,
  },
  halfStatLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  recentCustomersSection: {
    padding: 20,
    paddingTop: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  viewAllButton: {
    fontSize: 15,
    color: '#7c3aed',
    fontWeight: '600',
  },
  customerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  customerCardContent: {
    padding: 20,
  },
  customerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  customerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ede9fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  customerAvatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#7c3aed',
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  accountNumber: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  customerDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginBottom: 16,
  },
  customerDetails: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#ede9fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  detailTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  interestBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#f3f4f6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 4,
  },
  interestBadgeText: {
    fontSize: 12,
    color: '#4b5563',
    fontWeight: '600',
  },
  bottomPadding: {
    height: 100,
  },
});