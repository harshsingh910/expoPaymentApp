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
} from 'react-native';
import { Search, ListFilter as Filter, ArrowUpDown } from 'lucide-react-native';
import { ApiService } from '@/services/api';
import { Customer } from '@/types/customer';
import { router } from 'expo-router';

type SortOption = 'name' | 'balance' | 'emi' | 'rate';
type SortDirection = 'asc' | 'desc';

export default function CustomersScreen() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

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

  const CustomerCard = ({ customer }: { customer: Customer }) => (
    <TouchableOpacity 
      style={styles.customerCard}
      onPress={() => navigateToCustomerDetail(customer)}
    >
      <View style={styles.customerHeader}>
        <Text style={styles.customerName}>{customer.customer_name}</Text>
        <Text style={styles.accountNumber}>{customer.account_number}</Text>
      </View>
      
      <View style={styles.customerDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Outstanding</Text>
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
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Tenure</Text>
          <Text style={styles.detailValue}>{customer.tenure_months} months</Text>
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
    >
      <Text style={[
        styles.sortButtonText,
        sortBy === option && styles.activeSortButtonText
      ]}>
        {label}
      </Text>
      {sortBy === option && (
        <ArrowUpDown 
          size={16} 
          color="#1e40af" 
          style={{
            transform: [{ rotate: sortDirection === 'desc' ? '180deg' : '0deg' }]
          }}
        />
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading customers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Customers</Text>
        <Text style={styles.headerSubtitle}>{filteredCustomers.length} loan accounts</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or account number"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.sortContainer}>
        <View style={styles.sortHeader}>
          <Filter size={16} color="#6b7280" />
          <Text style={styles.sortLabel}>Sort by:</Text>
        </View>
        <View style={styles.sortButtons}>
          <SortButton option="name" label="Name" />
          <SortButton option="balance" label="Balance" />
          <SortButton option="emi" label="EMI" />
          <SortButton option="rate" label="Rate" />
        </View>
      </View>

      <FlatList
        data={filteredCustomers}
        renderItem={({ item }) => <CustomerCard customer={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
  searchContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#111827',
  },
  sortContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sortHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sortLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  activeSortButton: {
    borderColor: '#1e40af',
    backgroundColor: '#eff6ff',
  },
  sortButtonText: {
    fontSize: 12,
    color: '#6b7280',
    marginRight: 4,
  },
  activeSortButtonText: {
    color: '#1e40af',
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  customerCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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