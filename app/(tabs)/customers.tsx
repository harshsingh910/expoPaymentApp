import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  TextInput,
  Platform,
  Dimensions,
  Animated,
} from 'react-native';
import { Search, Filter, ArrowUpDown, TrendingUp, Users as UsersIcon, ChevronRight, DollarSign, Percent } from 'lucide-react-native';
import { ApiService } from '@/services/api';
import { Customer } from '@/types/customer';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

type SortOption = 'name' | 'balance' | 'emi' | 'rate';
type SortDirection = 'asc' | 'desc';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;

export default function CustomersScreen() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showFilters, setShowFilters] = useState(false);

  const fetchCustomers = async () => {
    try {
      const data = await ApiService.getCustomers();
      setCustomers(data);
      setFilteredCustomers(data);
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

  useEffect(() => {
    filterAndSortCustomers();
  }, [customers, searchQuery, sortBy, sortDirection]);

  const filterAndSortCustomers = () => {
    let filtered = customers.filter(customer =>
      customer.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.account_number.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.customer_name.toLowerCase();
          bValue = b.customer_name.toLowerCase();
          break;
        case 'balance':
          aValue = parseFloat(a.outstanding_balance);
          bValue = parseFloat(b.outstanding_balance);
          break;
        case 'emi':
          aValue = parseFloat(a.emi_due_amount);
          bValue = parseFloat(b.emi_due_amount);
          break;
        case 'rate':
          aValue = parseFloat(a.interest_rate);
          bValue = parseFloat(b.interest_rate);
          break;
        default:
          aValue = a.customer_name.toLowerCase();
          bValue = b.customer_name.toLowerCase();
      }

      if (typeof aValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortDirection === 'asc' 
          ? aValue - bValue
          : bValue - aValue;
      }
    });

    setFilteredCustomers(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchCustomers();
  };

  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortDirection('asc');
    }
  };

  const navigateToCustomerDetail = (customer: Customer) => {
    router.push(`/customer-detail/${customer.account_number}`);
  };

  const getTotalOutstanding = () => {
    return filteredCustomers.reduce(
      (sum, customer) => sum + parseFloat(customer.outstanding_balance),
      0
    );
  };

  const CustomerCard = ({ customer }: { customer: Customer }) => (
    <TouchableOpacity 
      style={styles.customerCard}
      onPress={() => navigateToCustomerDetail(customer)}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={['#02ff96ff', '#595cffff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarGradient}
          >
            <Text style={styles.avatarText}>
              {customer.customer_name.charAt(0).toUpperCase()}
            </Text>
          </LinearGradient>
        </View>
        <View style={styles.customerInfo}>
          <Text style={styles.customerName} numberOfLines={1}>
            {customer.customer_name}
          </Text>
          <Text style={styles.accountNumber}>{customer.account_number}</Text>
        </View>
        <View style={styles.chevronContainer}>
          <ChevronRight size={18} color="#94a3b8" />
        </View>
      </View>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <View style={styles.statIconBox}>
            <DollarSign size={14} color="#06b6d4" strokeWidth={2.5} />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statLabel}>Outstanding</Text>
            <Text style={styles.statValue}>
              ₹{(parseFloat(customer.outstanding_balance) / 1000).toFixed(1)}K
            </Text>
          </View>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <View style={[styles.statIconBox, { backgroundColor: '#fef3c7' }]}>
            <DollarSign size={14} color="#f59e0b" strokeWidth={2.5} />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statLabel}>EMI</Text>
            <Text style={styles.statValue}>
              ₹{(parseFloat(customer.emi_due_amount) / 1000).toFixed(1)}K
            </Text>
          </View>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <View style={[styles.statIconBox, { backgroundColor: '#fce7f3' }]}>
            <Percent size={14} color="#ec4899" strokeWidth={2.5} />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statLabel}>Rate</Text>
            <Text style={styles.statValue}>{customer.interest_rate}%</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const SortButton = ({ option, label }: { option: SortOption, label: string }) => (
    <TouchableOpacity 
      style={[
        styles.sortButton,
        sortBy === option && styles.activeSortButton
      ]}
      onPress={() => handleSort(option)}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.sortButtonText,
        sortBy === option && styles.activeSortButtonText
      ]}>
        {label}
      </Text>
      {sortBy === option && (
        <ArrowUpDown 
          size={12} 
          color="#06b6d4" 
          style={{
            transform: [{ rotate: sortDirection === 'desc' ? '180deg' : '0deg' }]
          }}
        />
      )}
    </TouchableOpacity>
  );

  const ListHeaderComponent = () => (
    <>
      <View style={styles.statsCard}>
        <LinearGradient
          colors={['#06b6d4', '#387dffff', '#6441ffff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.statsGradient}
        >
          <View style={styles.statsRow}>
            <View style={styles.statBlock}>
              <View style={styles.statIconContainer}>
                <UsersIcon size={20} color="rgba(0, 0, 0, 0.9)" strokeWidth={2.5} />
              </View>
              <Text style={styles.statBlockValue}>{filteredCustomers.length}</Text>
              <Text style={styles.statBlockLabel}>Active</Text>
            </View>
            <View style={styles.statBlockDivider} />
            <View style={styles.statBlock}>
              <View style={styles.statIconContainer}>
                <TrendingUp size={20} color="rgba(0, 0, 0, 0.9)" strokeWidth={2.5} />
              </View>
              <Text style={styles.statBlockValue}>
                ₹{(getTotalOutstanding() / 100000).toFixed(1)}L
              </Text>
              <Text style={styles.statBlockLabel}>Outstanding</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={18} color="#94a3b8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search customers..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.clearButton}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity 
          style={[styles.filterButton, showFilters && styles.filterButtonActive]}
          onPress={() => setShowFilters(!showFilters)}
          activeOpacity={0.7}
        >
          <Filter size={18} color={showFilters ? '#06b6d4' : '#64748b'} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Sort by</Text>
          <View style={styles.sortButtons}>
            <SortButton option="name" label="Name" />
            <SortButton option="balance" label="Balance" />
            <SortButton option="emi" label="EMI" />
            <SortButton option="rate" label="Rate" />
          </View>
        </View>
      )}

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>All Accounts</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{filteredCustomers.length}</Text>
        </View>
      </View>
    </>
  );

  const EmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <UsersIcon size={40} color="#cbd5e1" strokeWidth={1.5} />
      </View>
      <Text style={styles.emptyTitle}>No customers found</Text>
      <Text style={styles.emptyText}>
        {searchQuery ? 'Try a different search term' : 'Add your first customer to get started'}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={['#06b6d4', '#0891b2']}
          style={styles.loadingGradient}
        >
          <Animated.View>
            <UsersIcon size={48} color="#ffffff" strokeWidth={2} />
          </Animated.View>
          <Text style={styles.loadingText}>Loading customers...</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#06b6d4', '#0891b2', '#0e7490']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Customers</Text>
        <Text style={styles.headerSubtitle}>Manage loan accounts</Text>
      </LinearGradient>

      <FlatList
        data={filteredCustomers}
        renderItem={({ item }) => <CustomerCard customer={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={EmptyComponent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#06b6d4"
            colors={['#06b6d4']}
          />
        }
        showsVerticalScrollIndicator={false}
      />
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
    backgroundColor: '#f8fafc',
  },
  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 16,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 28,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTitle: {
    fontSize: isSmallScreen ? 26 : 32,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: isSmallScreen ? 13 : 15,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  listContainer: {
    paddingBottom: 100,
  },
  statsCard: {
    marginHorizontal: 16,
    marginTop: -2,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#fdff7bff',
    overflow: 'hidden',
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  statsGradient: {
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statBlock: {
    flex: 1,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statBlockValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#6f00ffff',
    marginBottom: 2,
  },
  statBlockLabel: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.85)',
    fontWeight: '600',
  },
  statBlockDivider: {
    width: 1,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 10,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#0f172a',
    fontWeight: '500',
  },
  clearButton: {
    fontSize: 16,
    color: '#94a3b8',
    padding: 2,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  filterButtonActive: {
    backgroundColor: '#cffafe',
  },
  sortContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sortLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '700',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  activeSortButton: {
    borderColor: '#06b6d4',
    backgroundColor: '#cffafe',
  },
  sortButtonText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
    marginRight: 4,
  },
  activeSortButtonText: {
    color: '#06b6d4',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  countBadge: {
    backgroundColor: '#cffafe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  countBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0891b2',
  },
  customerCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    marginRight: 10,
  },
  avatarGradient: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 2,
  },
  accountNumber: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  chevronContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 10,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#cffafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
});