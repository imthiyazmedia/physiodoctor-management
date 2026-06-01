import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../constants/colors';

export default function AppointmentDetailScreen() {
  const { id } = useLocalSearchParams();
  const [appt, setAppt] = useState<any>(null);

  useEffect(() => {
    // In a full app, fetch from DB
    setAppt({ id, status: 'Scheduled', patientName: 'Patient' });
  }, [id]);

  if (!appt) return <View style={styles.loading}><Text>Loading...</Text></View>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Status Actions */}
      <View style={styles.statusActions}>
        <Text style={styles.sectionTitle}>Update Status</Text>
        <View style={styles.statusRow}>
          {['Scheduled', 'In Progress', 'Completed', 'Cancelled'].map((s) => (
            <TouchableOpacity key={s} style={[styles.statusBtn, appt.status === s && styles.statusBtnActive]}>
              <Text style={[styles.statusBtnText, appt.status === s && styles.statusBtnTextActive]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.xl },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text, marginBottom: Spacing.md },
  statusActions: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.lg },
  statusRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  statusBtn: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: BorderRadius.sm, borderWidth: 1, borderColor: Colors.border },
  statusBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  statusBtnText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  statusBtnTextActive: { color: '#FFF', fontWeight: '600' },
});
