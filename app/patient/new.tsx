import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../constants/colors';
import { addPatient } from '../../services/database';

const uuid = () => 'pt_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);

export default function NewPatientScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '', email: '', address: '',
    dateOfBirth: '', gender: 'Male' as string, emergencyContact: '', emergencyPhone: '',
    medicalHistory: '', medications: '', allergies: '', notes: '',
  });
  const [saving, setSaving] = useState(false);

  const updateField = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      Alert.alert('Required', 'First name and last name are required');
      return;
    }
    setSaving(true);
    try {
      const now = new Date().toISOString();
      await addPatient({
        id: uuid(),
        ...form,
        createdAt: now,
        updatedAt: now,
        status: 'Active',
      });
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      {/* Name Row */}
      <Text style={styles.sectionLabel}>Patient Name *</Text>
      <View style={styles.nameRow}>
        <TextInput style={[styles.input, styles.halfInput]} placeholder="First Name *" placeholderTextColor={Colors.textLight} value={form.firstName} onChangeText={(v) => updateField('firstName', v)} />
        <TextInput style={[styles.input, styles.halfInput]} placeholder="Last Name *" placeholderTextColor={Colors.textLight} value={form.lastName} onChangeText={(v) => updateField('lastName', v)} />
      </View>

      {/* Contact */}
      <Text style={styles.sectionLabel}>Contact Information</Text>
      <TextInput style={styles.input} placeholder="Phone Number" placeholderTextColor={Colors.textLight} keyboardType="phone-pad" value={form.phone} onChangeText={(v) => updateField('phone', v)} />
      <TextInput style={styles.input} placeholder="Email Address" placeholderTextColor={Colors.textLight} keyboardType="email-address" autoCapitalize="none" value={form.email} onChangeText={(v) => updateField('email', v)} />
      <TextInput style={styles.input} placeholder="Address" placeholderTextColor={Colors.textLight} multiline numberOfLines={2} value={form.address} onChangeText={(v) => updateField('address', v)} />

      {/* Personal Info */}
      <Text style={styles.sectionLabel}>Personal Information</Text>
      <TextInput style={styles.input} placeholder="Date of Birth (YYYY-MM-DD)" placeholderTextColor={Colors.textLight} value={form.dateOfBirth} onChangeText={(v) => updateField('dateOfBirth', v)} />
      
      <View style={styles.genderRow}>
        {['Male', 'Female', 'Other'].map((g) => (
          <TouchableOpacity key={g} style={[styles.genderChip, form.gender === g && styles.genderChipActive]} onPress={() => updateField('gender', g)}>
            <Text style={[styles.genderText, form.gender === g && styles.genderTextActive]}>{g}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Emergency Contact */}
      <Text style={styles.sectionLabel}>Emergency Contact</Text>
      <TextInput style={styles.input} placeholder="Emergency Contact Name" placeholderTextColor={Colors.textLight} value={form.emergencyContact} onChangeText={(v) => updateField('emergencyContact', v)} />
      <TextInput style={styles.input} placeholder="Emergency Phone" placeholderTextColor={Colors.textLight} keyboardType="phone-pad" value={form.emergencyPhone} onChangeText={(v) => updateField('emergencyPhone', v)} />

      {/* Medical */}
      <Text style={styles.sectionLabel}>Medical History</Text>
      <TextInput style={styles.input} placeholder="Medical History / Conditions" placeholderTextColor={Colors.textLight} multiline numberOfLines={3} value={form.medicalHistory} onChangeText={(v) => updateField('medicalHistory', v)} />
      <TextInput style={styles.input} placeholder="Current Medications" placeholderTextColor={Colors.textLight} multiline numberOfLines={2} value={form.medications} onChangeText={(v) => updateField('medications', v)} />
      <TextInput style={styles.input} placeholder="Allergies" placeholderTextColor={Colors.textLight} multiline numberOfLines={2} value={form.allergies} onChangeText={(v) => updateField('allergies', v)} />

      {/* Notes */}
      <Text style={styles.sectionLabel}>Additional Notes</Text>
      <TextInput style={[styles.input, styles.notesInput]} placeholder="Any additional notes..." placeholderTextColor={Colors.textLight} multiline numberOfLines={4} value={form.notes} onChangeText={(v) => updateField('notes', v)} />

      {/* Save Button */}
      <TouchableOpacity style={[styles.saveBtn, saving && styles.saveBtnDisabled]} onPress={handleSave} disabled={saving}>
        <Ionicons name={saving ? 'hourglass-outline' : 'checkmark-circle-outline'} size={20} color="#FFF" />
        <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save Patient'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.xl, paddingBottom: 60 },
  sectionLabel: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textSecondary, marginBottom: Spacing.sm, marginTop: Spacing.lg, textTransform: 'uppercase', letterSpacing: 0.5 },
  nameRow: { flexDirection: 'row', gap: Spacing.sm },
  halfInput: { flex: 1 },
  input: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md, fontSize: FontSize.md, color: Colors.text, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.sm },
  notesInput: { minHeight: 80, textAlignVertical: 'top' },
  genderRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm },
  genderChip: { flex: 1, padding: Spacing.md, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', backgroundColor: Colors.surface },
  genderChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '10' },
  genderText: { fontSize: FontSize.md, color: Colors.textSecondary },
  genderTextActive: { color: Colors.primary, fontWeight: '600' },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary, borderRadius: BorderRadius.md, padding: Spacing.lg, marginTop: Spacing.xxl, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: '#FFF', fontWeight: '600', fontSize: FontSize.lg, marginLeft: Spacing.sm },
});
