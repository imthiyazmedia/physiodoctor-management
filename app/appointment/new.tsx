import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../constants/colors';
import { addAppointment } from '../../services/database';

const uuid = () => 'apt_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);

const appointmentTypes = ['Initial Assessment', 'Follow-up', 'Treatment', 'Re-assessment', 'Home Visit'];
const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];

export default function NewAppointmentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [form, setForm] = useState({
    patientId: (params.patientId as string) || '',
    patientName: (params.patientName as string) || '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    duration: '45',
    type: 'Treatment',
    notes: '',
  });
  const [step, setStep] = useState(params.patientId ? 2 : 1);

  const updateField = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (!form.patientName.trim()) { Alert.alert('Required', 'Patient name is required'); return; }
    if (!form.date) { Alert.alert('Required', 'Date is required'); return; }
    if (!form.time) { Alert.alert('Required', 'Time is required'); return; }

    try {
      await addAppointment({
        id: uuid(),
        ...form,
        duration: parseInt(form.duration),
        status: 'Scheduled',
        created_at: new Date().toISOString(),
      });
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      {/* Progress Steps */}
      <View style={styles.progressRow}>
        {[1, 2, 3].map((s) => (
          <View key={s} style={styles.progressItem}>
            <View style={[styles.progressDot, step >= s && styles.progressDotActive]}>
              <Text style={[styles.progressNum, step >= s && styles.progressNumActive]}>{s}</Text>
            </View>
            <Text style={[styles.progressLabel, step >= s && styles.progressLabelActive]}>
              {s === 1 ? 'Patient' : s === 2 ? 'Schedule' : 'Confirm'}
            </Text>
          </View>
        ))}
      </View>

      {/* Step 1: Patient */}
      {step === 1 && (
        <>
          <Text style={styles.sectionLabel}>Select Patient</Text>
          <TextInput style={styles.input} placeholder="Search patient name..." placeholderTextColor={Colors.textLight} value={form.patientName} onChangeText={(v) => updateField('patientName', v)} />
          <TouchableOpacity style={styles.nextBtn} onPress={() => setStep(2)} disabled={!form.patientName.trim()}>
            <Text style={styles.nextBtnText}>Next</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </TouchableOpacity>
        </>
      )}

      {/* Step 2: Schedule */}
      {step === 2 && (
        <>
          <Text style={styles.sectionLabel}>Appointment Details</Text>
          
          <Text style={styles.fieldLabel}>Patient</Text>
          <View style={styles.patientDisplay}>
            <Text style={styles.patientName}>{form.patientName}</Text>
            <TouchableOpacity onPress={() => setStep(1)}><Text style={styles.changeText}>Change</Text></TouchableOpacity>
          </View>

          <Text style={styles.fieldLabel}>Date</Text>
          <TextInput style={styles.input} placeholder="YYYY-MM-DD" placeholderTextColor={Colors.textLight} value={form.date} onChangeText={(v) => updateField('date', v)} />

          <Text style={styles.fieldLabel}>Time</Text>
          <View style={styles.timeGrid}>
            {timeSlots.map((t) => (
              <TouchableOpacity key={t} style={[styles.timeChip, form.time === t && styles.timeChipActive]} onPress={() => updateField('time', t)}>
                <Text style={[styles.timeText, form.time === t && styles.timeTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.fieldLabel}>Duration (minutes)</Text>
          <View style={styles.durationRow}>
            {['30', '45', '60'].map((d) => (
              <TouchableOpacity key={d} style={[styles.durationChip, form.duration === d && styles.durationChipActive]} onPress={() => updateField('duration', d)}>
                <Text style={[styles.durationText, form.duration === d && styles.durationTextActive]}>{d} min</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.fieldLabel}>Type</Text>
          <View style={styles.typeGrid}>
            {appointmentTypes.map((t) => (
              <TouchableOpacity key={t} style={[styles.typeChip, form.type === t && styles.typeChipActive]} onPress={() => updateField('type', t)}>
                <Text style={[styles.typeText, form.type === t && styles.typeTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.fieldLabel}>Notes</Text>
          <TextInput style={[styles.input, styles.notesInput]} placeholder="Appointment notes..." placeholderTextColor={Colors.textLight} multiline value={form.notes} onChangeText={(v) => updateField('notes', v)} />

          <TouchableOpacity style={styles.nextBtn} onPress={handleSave}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" />
            <Text style={styles.nextBtnText}>Schedule Appointment</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && (
        <View>
          <Text style={styles.confirmTitle}>Appointment Summary</Text>
          <View style={styles.confirmCard}>
            <View style={styles.confirmRow}><Text style={styles.confirmLabel}>Patient</Text><Text style={styles.confirmValue}>{form.patientName}</Text></View>
            <View style={styles.confirmRow}><Text style={styles.confirmLabel}>Date</Text><Text style={styles.confirmValue}>{form.date}</Text></View>
            <View style={styles.confirmRow}><Text style={styles.confirmLabel}>Time</Text><Text style={styles.confirmValue}>{form.time}</Text></View>
            <View style={styles.confirmRow}><Text style={styles.confirmLabel}>Duration</Text><Text style={styles.confirmValue}>{form.duration} min</Text></View>
            <View style={styles.confirmRow}><Text style={styles.confirmLabel}>Type</Text><Text style={styles.confirmValue}>{form.type}</Text></View>
          </View>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Ionicons name="checkmark-circle" size={22} color="#FFF" />
            <Text style={styles.saveBtnText}>Confirm & Schedule</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.xl, paddingBottom: 60 },
  progressRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: Spacing.xxl, gap: Spacing.xxl },
  progressItem: { alignItems: 'center' },
  progressDot: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.border, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  progressDotActive: { backgroundColor: Colors.primary },
  progressNum: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textLight },
  progressNumActive: { color: '#FFF' },
  progressLabel: { fontSize: FontSize.xs, color: Colors.textLight },
  progressLabelActive: { color: Colors.primary, fontWeight: '600' },
  sectionLabel: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.text, marginBottom: Spacing.lg },
  fieldLabel: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textSecondary, marginBottom: Spacing.sm, marginTop: Spacing.lg },
  input: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md, fontSize: FontSize.md, color: Colors.text, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.sm },
  notesInput: { minHeight: 80, textAlignVertical: 'top' },
  patientDisplay: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primary + '10', borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.sm },
  patientName: { flex: 1, fontSize: FontSize.md, fontWeight: '600', color: Colors.text },
  changeText: { fontSize: FontSize.sm, color: Colors.primary },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  timeChip: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.sm, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface },
  timeChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  timeText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  timeTextActive: { color: '#FFF', fontWeight: '600' },
  durationRow: { flexDirection: 'row', gap: Spacing.sm },
  durationChip: { flex: 1, padding: Spacing.md, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', backgroundColor: Colors.surface },
  durationChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  durationText: { fontSize: FontSize.md, color: Colors.textSecondary },
  durationTextActive: { color: '#FFF', fontWeight: '600' },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  typeChip: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: BorderRadius.sm, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface },
  typeChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  typeText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  typeTextActive: { color: '#FFF', fontWeight: '600' },
  nextBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary, borderRadius: BorderRadius.md, padding: Spacing.lg, marginTop: Spacing.xxl },
  nextBtnText: { color: '#FFF', fontWeight: '600', fontSize: FontSize.lg, marginLeft: Spacing.sm },
  confirmTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.text, marginBottom: Spacing.lg },
  confirmCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.lg },
  confirmRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.divider },
  confirmLabel: { fontSize: FontSize.md, color: Colors.textSecondary },
  confirmValue: { fontSize: FontSize.md, fontWeight: '600', color: Colors.text },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.success, borderRadius: BorderRadius.md, padding: Spacing.lg, marginTop: Spacing.xxl },
  saveBtnText: { color: '#FFF', fontWeight: '600', fontSize: FontSize.lg, marginLeft: Spacing.sm },
});
