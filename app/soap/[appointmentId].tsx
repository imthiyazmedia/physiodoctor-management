import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../constants/colors';
import { addSOAPNote } from '../../services/database';

const uuid = () => 'soap_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);

export default function SOAPNotesScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    patientId: '',
    appointmentId: '',
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
    painLevel: 0,
    rangeOfMotion: '',
    strength: '',
  });

  const updateField = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (!form.subjective.trim()) { Alert.alert('Required', 'Subjective is required'); return; }
    try {
      await addSOAPNote({
        id: uuid(),
        ...form,
        createdAt: new Date().toISOString(),
      });
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      {/* Pain Level */}
      <Text style={styles.sectionLabel}>Pain Level (0-10)</Text>
      <View style={styles.painRow}>
        {[0,1,2,3,4,5,6,7,8,9,10].map((n) => (
          <TouchableOpacity
            key={n}
            style={[styles.painBtn, form.painLevel === n && styles.painBtnActive, form.painLevel === n && n >= 7 && styles.painHigh, form.painLevel === n && n >= 4 && n <= 6 && styles.painMid]}
            onPress={() => updateField('painLevel', n)}
          >
            <Text style={[styles.painText, form.painLevel === n && styles.painTextActive]}>{n}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* S - Subjective */}
      <Text style={styles.sectionLabel}>S - Subjective</Text>
      <Text style={styles.helperText}>Patient's description of symptoms, pain, complaints</Text>
      <TextInput style={[styles.input, styles.textArea]} placeholder="What does the patient say? (symptoms, pain description, aggravating factors...)" placeholderTextColor={Colors.textLight} multiline value={form.subjective} onChangeText={(v) => updateField('subjective', v)} />

      {/* O - Objective */}
      <Text style={styles.sectionLabel}>O - Objective</Text>
      <Text style={styles.helperText}>Observable measurements, tests, range of motion</Text>
      <TextInput style={[styles.input, styles.textArea]} placeholder="Range of motion, strength tests, posture assessment, palpation findings..." placeholderTextColor={Colors.textLight} multiline value={form.objective} onChangeText={(v) => updateField('objective', v)} />
      <TextInput style={styles.input} placeholder="Range of Motion (e.g., Flexion 90°, Extension 20°)" placeholderTextColor={Colors.textLight} value={form.rangeOfMotion} onChangeText={(v) => updateField('rangeOfMotion', v)} />
      <TextInput style={styles.input} placeholder="Strength (e.g., 4/5 Hip Flexion)" placeholderTextColor={Colors.textLight} value={form.strength} onChangeText={(v) => updateField('strength', v)} />

      {/* A - Assessment */}
      <Text style={styles.sectionLabel}>A - Assessment</Text>
      <Text style={styles.helperText}>Clinical judgment, diagnosis, progress evaluation</Text>
      <TextInput style={[styles.input, styles.textArea]} placeholder="Clinical impression, diagnosis, progress notes..." placeholderTextColor={Colors.textLight} multiline value={form.assessment} onChangeText={(v) => updateField('assessment', v)} />

      {/* P - Plan */}
      <Text style={styles.sectionLabel}>P - Plan</Text>
      <Text style={styles.helperText}>Treatment plan, exercises, follow-up schedule</Text>
      <TextInput style={[styles.input, styles.textArea]} placeholder="Treatment goals, exercise prescription, follow-up plan, referrals..." placeholderTextColor={Colors.textLight} multiline value={form.plan} onChangeText={(v) => updateField('plan', v)} />

      {/* Save */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Ionicons name="document-text-outline" size={20} color="#FFF" />
        <Text style={styles.saveBtnText}>Save SOAP Notes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.xl, paddingBottom: 60 },
  sectionLabel: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.text, marginTop: Spacing.xl, marginBottom: Spacing.xs },
  helperText: { fontSize: FontSize.sm, color: Colors.textLight, marginBottom: Spacing.sm, fontStyle: 'italic' },
  input: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md, fontSize: FontSize.md, color: Colors.text, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.sm },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  painRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: Spacing.lg },
  painBtn: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  painBtnActive: { backgroundColor: Colors.chartGreen, borderColor: Colors.chartGreen },
  painHigh: { backgroundColor: Colors.danger, borderColor: Colors.danger },
  painMid: { backgroundColor: Colors.warning, borderColor: Colors.warning },
  painText: { fontSize: FontSize.xs, color: Colors.textSecondary, fontWeight: '600' },
  painTextActive: { color: '#FFF' },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary, borderRadius: BorderRadius.md, padding: Spacing.lg, marginTop: Spacing.xxl },
  saveBtnText: { color: '#FFF', fontWeight: '600', fontSize: FontSize.lg, marginLeft: Spacing.sm },
});
