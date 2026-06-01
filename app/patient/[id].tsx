import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../constants/colors';
import { getPatient, getSOAPNotes, getAssignedExercises, deletePatient } from '../../services/database';

export default function PatientDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [patient, setPatient] = useState<any>(null);
  const [soapNotes, setSoapNotes] = useState<any[]>([]);
  const [exercises, setExercises] = useState<any[]>([]);

  useEffect(() => {
    loadPatient();
  }, [id]);

  const loadPatient = async () => {
    try {
      const p = await getPatient(id as string);
      setPatient(p);
      const notes = await getSOAPNotes(id as string);
      setSoapNotes(notes);
      const ex = await getAssignedExercises(id as string);
      setExercises(ex);
    } catch (e) {
      console.error('Load patient error:', e);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Patient', 'Are you sure? This will also remove all appointments and invoices.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await deletePatient(id as string);
        router.back();
      }},
    ]);
  };

  if (!patient) return <View style={styles.loading}><Text style={styles.loadingText}>Loading...</Text></View>;

  const infoRows = [
    { icon: 'call-outline', label: 'Phone', value: patient.phone || 'N/A' },
    { icon: 'mail-outline', label: 'Email', value: patient.email || 'N/A' },
    { icon: 'location-outline', label: 'Address', value: patient.address || 'N/A' },
    { icon: 'calendar-outline', label: 'DOB', value: patient.dateOfBirth || 'N/A' },
    { icon: 'man-outline', label: 'Gender', value: patient.gender || 'N/A' },
    { icon: 'alert-circle-outline', label: 'Emergency', value: patient.emergencyContact ? `${patient.emergencyContact} (${patient.emergencyPhone})` : 'N/A' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{(patient.firstName?.[0]||'')+(patient.lastName?.[0]||'')}</Text></View>
        <Text style={styles.name}>{patient.firstName} {patient.lastName}</Text>
        <View style={[styles.statusBadge, { backgroundColor: patient.status === 'Active' ? Colors.success + '20' : Colors.warning + '20' }]}>
          <Text style={[styles.statusText, { color: patient.status === 'Active' ? Colors.success : Colors.warning }]}>{patient.status}</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => router.push(`/appointment/new?patientId=${id}&patientName=${patient.firstName} ${patient.lastName}`)}>
          <Ionicons name="calendar-add-outline" size={22} color={Colors.primary} />
          <Text style={styles.actionLabel}>New Appt</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => router.push(`/soap/${id}`)}>
          <Ionicons name="clipboard-outline" size={22} color={Colors.chartGreen} />
          <Text style={styles.actionLabel}>SOAP Note</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => router.push(`/exercise/assign?id=${id}`)}>
          <Ionicons name="fitness-outline" size={22} color={Colors.chartPurple} />
          <Text style={styles.actionLabel}>Exercise</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => router.push(`/billing/invoice/new?patientId=${id}&patientName=${patient.firstName} ${patient.lastName}`)}>
          <Ionicons name="receipt-outline" size={22} color={Colors.chartOrange} />
          <Text style={styles.actionLabel}>Invoice</Text>
        </TouchableOpacity>
      </View>

      {/* Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <View style={styles.infoCard}>
          {infoRows.map((row, idx) => (
            <View key={idx} style={[styles.infoRow, idx < infoRows.length - 1 && styles.infoRowBorder]}>
              <Ionicons name={row.icon as any} size={16} color={Colors.textSecondary} />
              <Text style={styles.infoLabel}>{row.label}</Text>
              <Text style={styles.infoValue}>{row.value}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Medical History */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Medical History</Text>
        <View style={styles.infoCard}>
          <View style={styles.medSection}><Text style={styles.medLabel}>History</Text><Text style={styles.medValue}>{patient.medicalHistory || 'None recorded'}</Text></View>
          <View style={styles.divider} />
          <View style={styles.medSection}><Text style={styles.medLabel}>Medications</Text><Text style={styles.medValue}>{patient.medications || 'None recorded'}</Text></View>
          <View style={styles.divider} />
          <View style={styles.medSection}><Text style={styles.medLabel}>Allergies</Text><Text style={styles.medValue}>{patient.allergies || 'None recorded'}</Text></View>
        </View>
      </View>

      {/* SOAP Notes */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent SOAP Notes ({soapNotes.length})</Text>
        </View>
        {soapNotes.length === 0 ? (
          <Text style={styles.emptyText}>No SOAP notes yet</Text>
        ) : (
          soapNotes.slice(0, 3).map((note: any) => (
            <View key={note.id} style={styles.soapCard}>
              <Text style={styles.soapDate}>{new Date(note.createdAt).toLocaleDateString('en-IN')}</Text>
              <Text style={styles.soapText} numberOfLines={2}><Text style={styles.soapLabel}>S:</Text> {note.subjective}</Text>
              <Text style={styles.soapText} numberOfLines={1}><Text style={styles.soapLabel}>O:</Text> {note.objective}</Text>
              <Text style={styles.painLevel}>Pain: {'🔥'.repeat(note.painLevel || 0)}</Text>
            </View>
          ))
        )}
      </View>

      {/* Assigned Exercises */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Assigned Exercises ({exercises.length})</Text>
        </View>
        {exercises.length === 0 ? (
          <Text style={styles.emptyText}>No exercises assigned</Text>
        ) : (
          exercises.slice(0, 3).map((ex: any) => (
            <View key={ex.id} style={styles.exCard}>
              <Text style={styles.exName}>{ex.exerciseName}</Text>
              <Text style={styles.exMeta}>{ex.frequency} | {ex.duration}</Text>
            </View>
          ))
        )}
      </View>

      {/* Delete */}
      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
        <Ionicons name="trash-outline" size={18} color={Colors.danger} />
        <Text style={styles.deleteText}>Delete Patient</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: 60 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: Colors.textLight, fontSize: FontSize.md },
  header: { alignItems: 'center', paddingVertical: Spacing.xxl, backgroundColor: Colors.surface, marginHorizontal: Spacing.xl, borderRadius: BorderRadius.lg, marginTop: Spacing.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 4 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.md },
  avatarText: { color: '#FFF', fontSize: FontSize.xxxl, fontWeight: '700' },
  name: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.text },
  statusBadge: { paddingHorizontal: Spacing.lg, paddingVertical: 4, borderRadius: BorderRadius.full, marginTop: Spacing.sm },
  statusText: { fontSize: FontSize.sm, fontWeight: '600' },
  actionsRow: { flexDirection: 'row', marginHorizontal: Spacing.xl, marginTop: Spacing.lg, gap: Spacing.sm },
  actionBtn: { flex: 1, alignItems: 'center', backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  actionLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 4 },
  section: { paddingHorizontal: Spacing.xl, marginTop: Spacing.xl },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text, marginBottom: Spacing.sm },
  infoCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.lg },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm },
  infoRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.divider },
  infoLabel: { fontSize: FontSize.sm, color: Colors.textSecondary, marginLeft: Spacing.sm, width: 90 },
  infoValue: { flex: 1, fontSize: FontSize.sm, color: Colors.text, fontWeight: '500', textAlign: 'right' },
  medSection: { paddingVertical: Spacing.sm },
  medLabel: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textSecondary, marginBottom: 4 },
  medValue: { fontSize: FontSize.md, color: Colors.text },
  divider: { height: 1, backgroundColor: Colors.divider },
  emptyText: { fontSize: FontSize.sm, color: Colors.textLight, textAlign: 'center', paddingVertical: Spacing.lg },
  soapCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.sm },
  soapDate: { fontSize: FontSize.xs, color: Colors.textLight, marginBottom: 4 },
  soapText: { fontSize: FontSize.sm, color: Colors.text, marginBottom: 2 },
  soapLabel: { fontWeight: '700', color: Colors.primary },
  painLevel: { fontSize: FontSize.xs, marginTop: 4 },
  exCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.sm },
  exName: { fontSize: FontSize.md, fontWeight: '600', color: Colors.text },
  exMeta: { fontSize: FontSize.sm, color: Colors.textLight, marginTop: 2 },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: Spacing.xl, marginTop: Spacing.xxl, padding: Spacing.lg, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.danger + '40' },
  deleteText: { color: Colors.danger, fontWeight: '600', marginLeft: Spacing.sm },
});
