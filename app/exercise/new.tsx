import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../../constants/colors';
import { addExercise } from '../../../services/database';

const uuid = () => 'ex_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);

const categories = ['Stretching', 'Strengthening', 'Balance', 'Posture', 'Cardio', 'Other'];

export default function NewExerciseScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '', description: '', category: 'Strengthening',
    instructions: '', duration: '', sets: '3', reps: '10', precautions: '',
  });

  const handleSave = async () => {
    if (!form.name.trim()) { Alert.alert('Required', 'Exercise name is required'); return; }
    try {
      await addExercise({
        id: uuid(),
        ...form,
        sets: parseInt(form.sets) || 3,
        reps: parseInt(form.reps) || 10,
        instructions: form.instructions.split('\n').filter(Boolean),
      });
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TextInput style={styles.input} placeholder="Exercise Name *" placeholderTextColor={Colors.textLight} value={form.name} onChangeText={(v) => setForm(p => ({...p, name: v}))} />
      <TextInput style={[styles.input, styles.textArea]} placeholder="Description" placeholderTextColor={Colors.textLight} multiline value={form.description} onChangeText={(v) => setForm(p => ({...p, description: v}))} />

      <Text style={styles.fieldLabel}>Category</Text>
      <View style={styles.catGrid}>
        {categories.map((c) => (
          <TouchableOpacity key={c} style={[styles.catChip, form.category === c && styles.catChipActive]} onPress={() => setForm(p => ({...p, category: c}))}>
            <Text style={[styles.catText, form.category === c && styles.catTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.row}>
        <View style={styles.halfField}><Text style={styles.fieldLabel}>Sets</Text><TextInput style={styles.input} keyboardType="number-pad" value={form.sets} onChangeText={(v) => setForm(p => ({...p, sets: v}))} /></View>
        <View style={styles.halfField}><Text style={styles.fieldLabel}>Reps</Text><TextInput style={styles.input} keyboardType="number-pad" value={form.reps} onChangeText={(v) => setForm(p => ({...p, reps: v}))} /></View>
        <View style={styles.halfField}><Text style={styles.fieldLabel}>Duration</Text><TextInput style={styles.input} placeholder="e.g., 15 min" placeholderTextColor={Colors.textLight} value={form.duration} onChangeText={(v) => setForm(p => ({...p, duration: v}))} /></View>
      </View>

      <Text style={styles.fieldLabel}>Instructions (one per line)</Text>
      <TextInput style={[styles.input, styles.textArea]} placeholder="Step 1: Stand with feet shoulder-width apart&#10;Step 2: Slowly bend forward..." placeholderTextColor={Colors.textLight} multiline value={form.instructions} onChangeText={(v) => setForm(p => ({...p, instructions: v}))} />

      <Text style={styles.fieldLabel}>Precautions</Text>
      <TextInput style={[styles.input, styles.textArea]} placeholder="Safety precautions, contraindications..." placeholderTextColor={Colors.textLight} multiline value={form.precautions} onChangeText={(v) => setForm(p => ({...p, precautions: v}))} />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Ionicons name="save-outline" size={20} color="#FFF" />
        <Text style={styles.saveBtnText}>Save Exercise</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.xl, paddingBottom: 60 },
  input: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md, fontSize: FontSize.md, color: Colors.text, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.sm },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  fieldLabel: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textSecondary, marginBottom: Spacing.xs, marginTop: Spacing.sm },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.md },
  catChip: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.sm, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface },
  catChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  catText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  catTextActive: { color: '#FFF', fontWeight: '600' },
  row: { flexDirection: 'row', gap: Spacing.sm },
  halfField: { flex: 1 },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary, borderRadius: BorderRadius.md, padding: Spacing.lg, marginTop: Spacing.xxl },
  saveBtnText: { color: '#FFF', fontWeight: '600', fontSize: FontSize.lg, marginLeft: Spacing.sm },
});
