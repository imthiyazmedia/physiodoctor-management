import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../../constants/colors';
import { addInvoice } from '../../../services/database';

const uuid = () => 'inv_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);

export default function NewInvoiceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [form, setForm] = useState({
    patientId: (params.patientId as string) || '',
    patientName: (params.patientName as string) || '',
    amount: '',
    tax: '18',
    discount: '0',
    notes: '',
    paymentMethod: 'Cash' as string,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
  });

  const amount = parseFloat(form.amount) || 0;
  const taxRate = parseFloat(form.tax) || 0;
  const discount = parseFloat(form.discount) || 0;
  const taxAmount = amount * (taxRate / 100);
  const total = amount + taxAmount - discount;

  const handleSave = async () => {
    if (!form.patientName.trim()) { Alert.alert('Required', 'Patient name is required'); return; }
    if (!form.amount || amount <= 0) { Alert.alert('Required', 'Valid amount is required'); return; }

    try {
      await addInvoice({
        id: uuid(),
        patientId: form.patientId,
        patientName: form.patientName,
        appointmentId: '',
        amount,
        tax: taxAmount,
        total,
        status: 'Pending',
        paymentMethod: form.paymentMethod,
        notes: form.notes,
        date: form.date,
        dueDate: form.dueDate,
        paidAt: '',
      });
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TextInput style={styles.input} placeholder="Patient Name *" placeholderTextColor={Colors.textLight} value={form.patientName} onChangeText={(v) => setForm(p => ({...p, patientName: v}))} />

      <View style={styles.amountRow}>
        <View style={styles.amountInput}>
          <Text style={styles.currency}>₹</Text>
          <TextInput style={styles.amountField} placeholder="0.00" placeholderTextColor={Colors.textLight} keyboardType="decimal-pad" value={form.amount} onChangeText={(v) => setForm(p => ({...p, amount: v}))} />
        </View>
      </View>

      <View style={styles.calcRow}>
        <View style={styles.calcItem}>
          <Text style={styles.calcLabel}>Tax (%)</Text>
          <TextInput style={styles.calcInput} keyboardType="decimal-pad" value={form.tax} onChangeText={(v) => setForm(p => ({...p, tax: v}))} />
        </View>
        <View style={styles.calcItem}>
          <Text style={styles.calcLabel}>Discount (₹)</Text>
          <TextInput style={styles.calcInput} keyboardType="decimal-pad" value={form.discount} onChangeText={(v) => setForm(p => ({...p, discount: v}))} />
        </View>
      </View>

      <View style={styles.breakdown}>
        <View style={styles.breakRow}><Text style={styles.breakLabel}>Subtotal</Text><Text style={styles.breakValue}>₹{amount.toFixed(2)}</Text></View>
        <View style={styles.breakRow}><Text style={styles.breakLabel}>Tax ({taxRate}%)</Text><Text style={styles.breakValue}>+ ₹{taxAmount.toFixed(2)}</Text></View>
        {discount > 0 && <View style={styles.breakRow}><Text style={styles.breakLabel}>Discount</Text><Text style={[styles.breakValue, {color: Colors.chartGreen}]}>- ₹{discount.toFixed(2)}</Text></View>}
        <View style={styles.totalRow}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalValue}>₹{total.toFixed(2)}</Text></View>
      </View>

      <Text style={styles.fieldLabel}>Payment Method</Text>
      <View style={styles.paymentRow}>
        {['Cash', 'Card', 'UPI', 'Insurance', 'Bank Transfer'].map((m) => (
          <TouchableOpacity key={m} style={[styles.paymentChip, form.paymentMethod === m && styles.paymentChipActive]} onPress={() => setForm(p => ({...p, paymentMethod: m}))}>
            <Text style={[styles.paymentText, form.paymentMethod === m && styles.paymentTextActive]}>{m}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput style={[styles.input, styles.notesInput]} placeholder="Invoice notes..." placeholderTextColor={Colors.textLight} multiline value={form.notes} onChangeText={(v) => setForm(p => ({...p, notes: v}))} />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Ionicons name="receipt-outline" size={20} color="#FFF" />
        <Text style={styles.saveBtnText}>Generate Invoice - ₹{total.toFixed(2)}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.xl, paddingBottom: 60 },
  input: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md, fontSize: FontSize.md, color: Colors.text, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.sm },
  notesInput: { minHeight: 80, textAlignVertical: 'top' },
  amountRow: { alignItems: 'center', marginVertical: Spacing.lg },
  amountInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: BorderRadius.md, paddingHorizontal: Spacing.lg, borderWidth: 1, borderColor: Colors.primary, width: '60%' },
  currency: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.text },
  amountField: { flex: 1, fontSize: FontSize.xxxl, fontWeight: '700', color: Colors.text, padding: Spacing.md, textAlign: 'center' },
  calcRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.md },
  calcItem: { flex: 1 },
  calcLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, marginBottom: 4 },
  calcInput: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.sm, fontSize: FontSize.md, color: Colors.text, borderWidth: 1, borderColor: Colors.border, textAlign: 'center' },
  breakdown: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.lg, marginBottom: Spacing.lg },
  breakRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  breakLabel: { fontSize: FontSize.sm, color: Colors.textSecondary },
  breakValue: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: Spacing.md, borderTopWidth: 2, borderTopColor: Colors.primary, marginTop: Spacing.sm },
  totalLabel: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text },
  totalValue: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.primary },
  fieldLabel: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textSecondary, marginBottom: Spacing.sm, marginTop: Spacing.md },
  paymentRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.lg },
  paymentChip: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.sm, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface },
  paymentChipActive: { backgroundColor: Colors.success, borderColor: Colors.success },
  paymentText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  paymentTextActive: { color: '#FFF', fontWeight: '600' },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.success, borderRadius: BorderRadius.md, padding: Spacing.lg, marginTop: Spacing.lg },
  saveBtnText: { color: '#FFF', fontWeight: '600', fontSize: FontSize.lg, marginLeft: Spacing.sm },
});
