import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../constants/colors';
import { getAppointments, getAppointmentsByDate } from '../../services/database';
import AppointmentCard from '../../components/AppointmentCard';

export default function AppointmentsScreen({ navigation }: any) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [refreshing, setRefreshing] = useState(false);

  const loadAppts = useCallback(async () => {
    try {
      const data = await getAppointmentsByDate(selectedDate);
      setAppointments(data);
    } catch (e) {
      console.error('Load appts error:', e);
    } finally {
      setRefreshing(false);
    }
  }, [selectedDate]);

  useFocusEffect(useCallback(() => { loadAppts(); }, [loadAppts]));

  // Generate week dates
  const weekDates: { date: string; label: string; day: string }[] = [];
  const today = new Date();
  for (let i = -3; i <= 3; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    weekDates.push({
      date: d.toISOString().split('T')[0],
      label: d.toLocaleDateString('en-IN', { weekday: 'short' }),
      day: d.getDate().toString(),
    });
  }

  const stats = {
    total: appointments.length,
    completed: appointments.filter(a => a.status === 'Completed').length,
    cancelled: appointments.filter(a => a.status === 'Cancelled').length,
    scheduled: appointments.filter(a => a.status === 'Scheduled').length,
  };

  return (
    <View style={styles.container}>
      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}><Text style={styles.statValue}>{stats.total}</Text><Text style={styles.statLabel}>Total</Text></View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}><Text style={[styles.statValue, { color: Colors.chartBlue }]}>{stats.scheduled}</Text><Text style={styles.statLabel}>Scheduled</Text></View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}><Text style={[styles.statValue, { color: Colors.chartGreen }]}>{stats.completed}</Text><Text style={styles.statLabel}>Done</Text></View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}><Text style={[styles.statValue, { color: Colors.chartRed }]}>{stats.cancelled}</Text><Text style={styles.statLabel}>Cancel</Text></View>
      </View>

      {/* Week Date Picker */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.weekRow} contentContainerStyle={styles.weekContent}>
        {weekDates.map((d) => {
          const isToday = d.date === new Date().toISOString().split('T')[0];
          const isSelected = d.date === selectedDate;
          return (
            <TouchableOpacity
              key={d.date}
              style={[styles.dateChip, isSelected && styles.dateChipSelected]}
              onPress={() => setSelectedDate(d.date)}
            >
              <Text style={[styles.dateLabel, isSelected && styles.dateLabelSelected]}>{d.label}</Text>
              <Text style={[styles.dateDay, isSelected && styles.dateDaySelected]}>{d.day}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Appointments List */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadAppts(); }} colors={[Colors.primary]} />}
      >
        {appointments.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color={Colors.textLight} />
            <Text style={styles.emptyTitle}>No Appointments</Text>
            <Text style={styles.emptySubtitle}>No appointments scheduled for this day</Text>
          </View>
        ) : (
          appointments.map((appt) => (
            <AppointmentCard key={appt.id} appointment={appt} onPress={() => navigation.navigate('AppointmentDetail', { appointmentId: appt.id })} />
          ))
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('NewAppointment')}>
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  statsBar: { flexDirection: 'row', backgroundColor: Colors.surface, marginHorizontal: Spacing.xl, marginTop: Spacing.lg, borderRadius: BorderRadius.md, padding: Spacing.md, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.text },
  statLabel: { fontSize: FontSize.xs, color: Colors.textLight },
  statDivider: { width: 1, backgroundColor: Colors.divider },
  weekRow: { marginTop: Spacing.lg },
  weekContent: { paddingHorizontal: Spacing.xl, gap: Spacing.sm },
  dateChip: { alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, backgroundColor: Colors.surface, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border, minWidth: 60 },
  dateChipSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  dateLabel: { fontSize: FontSize.xs, color: Colors.textSecondary },
  dateLabelSelected: { color: '#FFF' },
  dateDay: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.text, marginTop: 2 },
  dateDaySelected: { color: '#FFF' },
  list: { flex: 1, marginTop: Spacing.md },
  listContent: { paddingHorizontal: Spacing.xl, paddingBottom: 100 },
  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: '600', color: Colors.text, marginTop: Spacing.lg },
  emptySubtitle: { fontSize: FontSize.sm, color: Colors.textLight, marginTop: Spacing.xs },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
});
