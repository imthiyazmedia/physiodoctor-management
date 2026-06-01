import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../constants/colors';
import { getInvoices } from '../../services/database';

export default function BillingScreen({ navigation }: any) {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('All');

  const loadInvoices = useCallback(async () => {
    try {
      const data = await getInvoices();
      setInvoices(data);
    } catch (e) {
      console.error('Load invoices error:', e);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { loadInvoices(); }, [loadInvoices]));

  const filtered = filter === 'All' ? invoices : invoices.filter(i => i.status === filter);
  const totalPending = invoices.filter(i => i.status === 'Pending' || i.status === 'Overdue').reduce((s, i) => s + i.total, 0);
  const totalPaid = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.total, 0);

  return (
    <View style={styles.container}>
      {/* Summary Cards */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { backgroundColor: Colors.chartGreen + '12' }]}>
          <Text style={[styles.summaryValue, { color: Colors.chartGreen }]}>₹{totalPaid.toLocaleString('en-IN')}</Text>
          <Text style={styles.summaryLabel}>Total Collected</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: Colors.chartRed + '12' }]}>
          <Text style={[styles.summaryValue, { color: Colors.chartRed }]}>₹{totalPending.toLocaleString('en-IN')}</Text>
          <Text style={styles.summaryLabel}>Pending</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={styles.filterContent}>
        {['All', 'Pending', 'Paid', 'Overdue', 'Cancelled'].map((f) => (
          <TouchableOpacity key={f} style={[styles.filterChip, filter === f && styles.filterChipActive]} onPress={() => setFilter(f)}>
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Invoice List */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadInvoices(); }} colors={[Colors.primary]} />}
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={64} color={Colors.textLight} />
            <Text style={styles.emptyTitle}>No Invoices</Text>
            <Text style={styles.emptySubtitle}>Generate an invoice for a completed appointment</Text>
          </View>
        ) : (
          filtered.map((inv) => (
            <TouchableOpacity key={inv.id} style={styles.invoiceCard} onPress={() => navigation.navigate('InvoiceDetail', { invoiceId: inv.id })}>
              <View style={styles.invoiceLeft}>
                <Text style={styles.invoicePatient}>{inv.patientName}</Text>
                <Text style={styles.invoiceDate}>{new Date(inv.date).toLocaleDateString('en-IN')}</Text>
              </View>
              <View style={styles.invoiceRight}>
                <Text style={styles.invoiceAmount}>₹{inv.total.toLocaleString('en-IN')}</Text>
                <View style={[styles.statusBadge, { 
                  backgroundColor: inv.status === 'Paid' ? Colors.success + '20' : inv.status === 'Overdue' ? Colors.danger + '20' : Colors.warning + '20' 
                }]}>
                  <Text style={[styles.statusText, { 
                    color: inv.status === 'Paid' ? Colors.success : inv.status === 'Overdue' ? Colors.danger : Colors.warning 
                  }]}>{inv.status}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('NewInvoice')}>
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  summaryRow: { flexDirection: 'row', paddingHorizontal: Spacing.xl, gap: Spacing.md, marginTop: Spacing.lg },
  summaryCard: { flex: 1, padding: Spacing.lg, borderRadius: BorderRadius.md },
  summaryValue: { fontSize: FontSize.xxl, fontWeight: '700' },
  summaryLabel: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  filterRow: { marginTop: Spacing.lg },
  filterContent: { paddingHorizontal: Spacing.xl, gap: Spacing.sm },
  filterChip: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  filterTextActive: { color: '#FFF', fontWeight: '600' },
  list: { flex: 1, marginTop: Spacing.md },
  listContent: { paddingHorizontal: Spacing.xl, paddingBottom: 100 },
  invoiceCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.lg,
    marginBottom: Spacing.sm, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  invoiceLeft: {},
  invoicePatient: { fontSize: FontSize.md, fontWeight: '600', color: Colors.text },
  invoiceDate: { fontSize: FontSize.sm, color: Colors.textLight, marginTop: 2 },
  invoiceRight: { alignItems: 'flex-end' },
  invoiceAmount: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text },
  statusBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: BorderRadius.sm, marginTop: 4 },
  statusText: { fontSize: FontSize.xs, fontWeight: '600' },
  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: '600', color: Colors.text, marginTop: Spacing.lg },
  emptySubtitle: { fontSize: FontSize.sm, color: Colors.textLight, marginTop: Spacing.xs },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
});
