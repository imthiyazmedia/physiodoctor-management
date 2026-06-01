import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../constants/colors';

const { width } = Dimensions.get('window');

const reportCards = [
  { title: 'Patient Statistics', icon: 'people-outline', color: Colors.chartBlue, items: ['Total Patients', 'New Registrations', 'Active vs Inactive', 'Age Distribution'] },
  { title: 'Appointment Analytics', icon: 'calendar-outline', color: Colors.chartOrange, items: ['Daily Appointments', 'No-Show Rate', 'Cancellation Rate', 'Peak Hours'] },
  { title: 'Revenue Reports', icon: 'cash-outline', color: Colors.chartGreen, items: ['Monthly Revenue', 'Pending Collections', 'Payment Methods', 'Revenue Comparison'] },
  { title: 'Treatment Outcomes', icon: 'analytics-outline', color: Colors.chartPurple, items: ['Recovery Rates', 'Avg Sessions/Patient', 'Common Diagnoses', 'Exercise Compliance'] },
];

export default function ReportsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Period Selector */}
      <View style={styles.periodRow}>
        {['Today', 'This Week', 'This Month', 'This Year'].map((p) => (
          <TouchableOpacity key={p} style={[styles.periodChip, selectedPeriod === p && styles.periodChipActive]} onPress={() => setSelectedPeriod(p)}>
            <Text style={[styles.periodText, selectedPeriod === p && styles.periodTextActive]}>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Report Cards */}
      {reportCards.map((card) => (
        <View key={card.title} style={styles.reportCard}>
          <View style={styles.reportHeader}>
            <View style={[styles.reportIcon, { backgroundColor: card.color + '15' }]}>
              <Ionicons name={card.icon as any} size={22} color={card.color} />
            </View>
            <Text style={styles.reportTitle}>{card.title}</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
          </View>
          <View style={styles.reportItems}>
            {card.items.map((item, idx) => (
              <TouchableOpacity key={idx} style={styles.reportItem}>
                <Ionicons name="document-text-outline" size={16} color={Colors.textSecondary} />
                <Text style={styles.reportItemText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {/* Coming Soon */}
      <View style={styles.comingSoon}>
        <Ionicons name="trending-up-outline" size={32} color={Colors.chartGreen} />
        <Text style={styles.comingSoonTitle}>More Reports Coming Soon</Text>
        <Text style={styles.comingSoonText}>Data visualization with charts and graphs will be available in the next update.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.xl, paddingBottom: 60 },
  periodRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl },
  periodChip: { flex: 1, paddingVertical: Spacing.sm, borderRadius: BorderRadius.sm, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', backgroundColor: Colors.surface },
  periodChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  periodText: { fontSize: FontSize.xs, color: Colors.textSecondary, fontWeight: '500' },
  periodTextActive: { color: '#FFF' },
  reportCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, marginBottom: Spacing.md, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  reportHeader: { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg, borderBottomWidth: 1, borderBottomColor: Colors.divider },
  reportIcon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  reportTitle: { flex: 1, fontSize: FontSize.md, fontWeight: '600', color: Colors.text },
  reportItems: { padding: Spacing.sm },
  reportItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm, paddingHorizontal: Spacing.sm },
  reportItemText: { fontSize: FontSize.sm, color: Colors.textSecondary, marginLeft: Spacing.sm },
  comingSoon: { alignItems: 'center', paddingVertical: Spacing.xxl, marginTop: Spacing.lg },
  comingSoonTitle: { fontSize: FontSize.lg, fontWeight: '600', color: Colors.text, marginTop: Spacing.md },
  comingSoonText: { fontSize: FontSize.sm, color: Colors.textLight, textAlign: 'center', marginTop: Spacing.xs, paddingHorizontal: Spacing.xl },
});
