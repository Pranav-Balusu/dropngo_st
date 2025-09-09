import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  IndianRupee, 
  TrendingUp, 
  Calendar, 
  Package,
  Clock,
  Star,
  Download,
  CreditCard
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function PorterEarningsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const earningsData = {
    week: {
      total: 5600,
      completed: 18,
      commission: 1120,
      avgPerDelivery: 311,
      breakdown: [
        { day: 'Mon', amount: 800 },
        { day: 'Tue', amount: 950 },
        { day: 'Wed', amount: 650 },
        { day: 'Thu', amount: 1200 },
        { day: 'Fri', amount: 1100 },
        { day: 'Sat', amount: 900 },
        { day: 'Sun', amount: 0 },
      ]
    },
    month: {
      total: 24500,
      completed: 85,
      commission: 4900,
      avgPerDelivery: 288,
      breakdown: [
        { day: 'Week 1', amount: 6200 },
        { day: 'Week 2', amount: 5800 },
        { day: 'Week 3', amount: 6800 },
        { day: 'Week 4', amount: 5700 },
      ]
    }
  };

  const currentData = earningsData[selectedPeriod as keyof typeof earningsData];
  const maxAmount = Math.max(...currentData.breakdown.map(item => item.amount));

  const recentTransactions = [
    { id: 'LF001234', date: '2025-01-15', amount: 280, commission: 56, rating: 5 },
    { id: 'LF001233', date: '2025-01-14', amount: 320, commission: 64, rating: 4 },
    { id: 'LF001232', date: '2025-01-14', amount: 190, commission: 38, rating: 5 },
    { id: 'LF001231', date: '2025-01-13', amount: 150, commission: 30, rating: 4 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#059669', '#047857']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Earnings</Text>
        <Text style={styles.headerSubtitle}>Track your income and performance</Text>
        
        <View style={styles.totalEarnings}>
          <Text style={styles.totalLabel}>Total This {selectedPeriod}</Text>
          <Text style={styles.totalAmount}>₹{currentData.total.toLocaleString()}</Text>
          <Text style={styles.commission}>Commission: ₹{currentData.commission}</Text>
        </View>
      </LinearGradient>

      <View style={styles.periodSelector}>
        {['week', 'month'].map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.periodButtonActive
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text style={[
              styles.periodButtonText,
              selectedPeriod === period && styles.periodButtonTextActive
            ]}>
              This {period.charAt(0).toUpperCase() + period.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#3B82F6' }]}>
                <Package size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.statValue}>{currentData.completed}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#F97316' }]}>
                <IndianRupee size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.statValue}>₹{currentData.avgPerDelivery}</Text>
              <Text style={styles.statLabel}>Avg/Delivery</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#7C3AED' }]}>
                <Star size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.statValue}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        </View>

        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Earnings Chart</Text>
          <View style={styles.chart}>
            <View style={styles.chartContainer}>
              {currentData.breakdown.map((item, index) => (
                <View key={index} style={styles.chartItem}>
                  <View style={styles.chartBar}>
                    <View
                      style={[
                        styles.chartBarFill,
                        { height: (item.amount / maxAmount) * 120 }
                      ]}
                    />
                  </View>
                  <Text style={styles.chartLabel}>{item.day}</Text>
                  <Text style={styles.chartValue}>₹{item.amount}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionButton}>
            <Download size={20} color="#3B82F6" />
            <Text style={styles.actionButtonText}>Download Report</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <CreditCard size={20} color="#059669" />
            <Text style={styles.actionButtonText}>Withdraw Funds</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.transactionsSection}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {recentTransactions.map((transaction, index) => (
            <View key={index} style={styles.transactionCard}>
              <View style={styles.transactionHeader}>
                <Text style={styles.transactionId}>#{transaction.id}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
              <View style={styles.transactionDetails}>
                <View style={styles.transactionAmount}>
                  <Text style={styles.transactionTotal}>₹{transaction.amount}</Text>
                  <Text style={styles.transactionCommission}>+₹{transaction.commission}</Text>
                </View>
                <View style={styles.transactionRating}>
                  <Text style={styles.ratingText}>★ {transaction.rating}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E5E7EB',
    marginTop: 4,
    marginBottom: 20,
  },
  totalEarnings: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
  },
  totalLabel: {
    fontSize: 14,
    color: '#E5E7EB',
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  commission: {
    fontSize: 14,
    color: '#E5E7EB',
    marginTop: 4,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  periodButtonActive: {
    borderBottomColor: '#059669',
  },
  periodButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  periodButtonTextActive: {
    color: '#059669',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  statsSection: {
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  chartSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  chart: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 160,
  },
  chartItem: {
    alignItems: 'center',
    flex: 1,
  },
  chartBar: {
    width: 20,
    height: 120,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  chartBarFill: {
    backgroundColor: '#059669',
    borderRadius: 10,
    width: '100%',
  },
  chartLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 2,
  },
  chartValue: {
    fontSize: 10,
    fontWeight: '600',
    color: '#111827',
  },
  actionsSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  transactionsSection: {
    marginBottom: 32,
  },
  transactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  transactionId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  transactionDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionAmount: {
    flex: 1,
  },
  transactionTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  transactionCommission: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
    marginTop: 2,
  },
  transactionRating: {},
  ratingText: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '600',
  },
});