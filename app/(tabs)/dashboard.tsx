import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../../constants/colors';
import { getDashboardStats, getTodayAppointments } from '../../../services/database';
import StatCard from '../../../components/StatCard';
import AppointmentCard from '../../../components/AppointmentCard';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }: any) {
  const [stats, setStats] = useState<any>(null);
  const [todayAppts, setTodayAppts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [statsData, appts] = await Promise.all([
        getDashboardStats(),
        getTodayAppointments(),
      ]);
      setStats(statsData);
      setTodayAppts(appts);
    } catch (e) {
      console.error('Dashboard load error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome Back,</Text>
          <Text style={styles.clinicName}>Physiodoctor Clinic</Text>
        </View>
        <TouchableOpacity style={styles.profileBtn}>
          <Ionicons name="person-circle-outline" size={36} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Date */}
      <Text style={styles.dateText}>
        {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
      </Text>

      {/* Stats Grid */}
      {stats && (
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatCard title="Total Patients" value={stats.totalPatients} icon="people-outline" color={Colors.chartBlue} />
            <StatCard title="Active Patients" value={stats.activePatients} icon="person-check-outline" color={Colors.chartGreen} />
          </View>
          <View style={styles.statsRow}>
            <StatCard title="Today's Appts" value={stats.todayAppointments} icon="calendar-outline" color={Colors.chartOrange} onPress={() => navigation.navigate('appointments')} />
            <StatCard title="Completed" value={stats.completedToday} icon="checkmark-circle-outline" color={Colors.chartGreen} />
          </View>
          <View style={styles.statsRow}>
            <StatCard title="Monthly Revenue" value={`₹${stats.monthlyRevenue.toLocaleString('en-IN')}`} icon="cash-outline" color={Colors.chartPurple} />
            <StatCard title="Pending Payments" value={stats.pendingPayments} icon="hourglass-outline" color={Colors.chartRed} />
          </View>
          <View style={styles.statsRow}>
            <StatCard title="New This Month" value={stats.newPatientsThisMonth} icon="person-add-outline" color={Colors.info} />
          </View>
        </View>
      )}

      {/* Today's Schedule */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Schedule</Text>
          <TouchableOpacity onPress={() => navigation.navigate('appointments')}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        {todayAppts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color={Colors.textLight} />
            <Text style={styles.emptyText}>No appointments today</Text>
            <TouchableOpacity 
              style={styles.addBtn} 
              onPress={() => navigation.navigate('appointments', { screen: 'NewAppointment' })}
            >
              <Ionicons name="add-circle-outline" size={20} color="#FFF" />
              <Text style={styles.addBtnText}>New Appointment</Text>
            </TouchableOpacity>
          </View>
        ) : (
          todayAppts.map((appt) => (
            <AppointmentCard key={appt.id} appointment={appt} onPress={() => {}} />
          ))
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('patients', { screen: 'NewPatient' })}>
            <View style={[styles.actionIcon, { backgroundColor: Colors.chartBlue + '15' }]}>
              <Ionicons name="person-add-outline" size={22} color={Colors.chartBlue} />
            </View>
            <Text style={styles.actionText}>New Patient</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('appointments', { screen: 'NewAppointment' })}>
            <View style={[styles.actionIcon, { backgroundColor: Colors.chartOrange + '15' }]}>
              <Ionicons name="calendar-add-outline" size={22} color={Colors.chartOrange} />
            </View>
            <Text style={styles.actionText}>New Appt</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('billing', { screen: 'NewInvoice' })}>
            <View style={[styles.actionIcon, { backgroundColor: Colors.chartGreen + '15' }]}>
              <Ionicons name="receipt-outline" size={22} color={Colors.chartGreen} />
            </View>
            <Text style={styles.actionText}>New Invoice</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('patients')}>
            <View style={[styles.actionIcon, { backgroundColor: Colors.chartPurple + '15' }]}>
              <Ionicons name="search-outline" size={22} color={Colors.chartPurple} />
            </View>
            <Text style={styles.actionText}>Find Patient</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: Spacing.xxxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
  },
  greeting: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  clinicName: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
    color: Colors.text,
  },
  profileBtn: {
    padding: Spacing.xs,
  },
  dateText: {
    fontSize: FontSize.sm,
    color: Colors.textLight,
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  statsGrid: {
    paddingHorizontal: Spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  section: {
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  viewAll: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.textLight,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  addBtnText: {
    color: '#FFF',
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionBtn: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  actionText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.text,
  },
});
