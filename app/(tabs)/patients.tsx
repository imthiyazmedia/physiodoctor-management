import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, TextInput } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../constants/colors';
import { getPatients } from '../../services/database';
import PatientCard from '../../components/PatientCard';

export default function PatientsScreen({ navigation }: any) {
  const [patients, setPatients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPatients = useCallback(async () => {
    try {
      const data = await getPatients();
      setPatients(data);
    } catch (e) {
      console.error('Load patients error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { loadPatients(); }, [loadPatients]));

  const filtered = patients.filter(p => 
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    (p.phone && p.phone.includes(search)) ||
    (p.email && p.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={Colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search patients by name, phone or email..."
            placeholderTextColor={Colors.textLight}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={20} color={Colors.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {['All', 'Active', 'Inactive'].map((f) => (
          <TouchableOpacity key={f} style={styles.filterChip}>
            <Text style={styles.filterText}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Patient List */}
      <ScrollView 
        style={styles.list}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadPatients(); }} colors={[Colors.primary]} />}
      >
        {loading ? (
          <Text style={styles.loadingText}>Loading patients...</Text>
        ) : filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={64} color={Colors.textLight} />
            <Text style={styles.emptyTitle}>No Patients Found</Text>
            <Text style={styles.emptySubtitle}>{search ? 'Try a different search' : 'Add your first patient to get started'}</Text>
            {!search && (
              <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('NewPatient')}>
                <Ionicons name="add" size={20} color="#FFF" />
                <Text style={styles.addBtnText}>Add Patient</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filtered.map((patient) => (
            <PatientCard 
              key={patient.id} 
              patient={patient} 
              onPress={() => navigation.navigate('PatientDetail', { patientId: patient.id })}
            />
          ))
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('NewPatient')}>
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  searchContainer: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.sm },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 44,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: { flex: 1, fontSize: FontSize.md, color: Colors.text, marginLeft: Spacing.sm },
  filterRow: { flexDirection: 'row', paddingHorizontal: Spacing.xl, marginBottom: Spacing.sm, gap: Spacing.sm },
  filterChip: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.xs, backgroundColor: Colors.surface, borderRadius: BorderRadius.full, borderWidth: 1, borderColor: Colors.border },
  filterText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  list: { flex: 1 },
  listContent: { paddingHorizontal: Spacing.xl, paddingBottom: 100 },
  loadingText: { textAlign: 'center', color: Colors.textLight, marginTop: 40 },
  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: '600', color: Colors.text, marginTop: Spacing.lg },
  emptySubtitle: { fontSize: FontSize.sm, color: Colors.textLight, marginTop: Spacing.xs, marginBottom: Spacing.xl },
  addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primary, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: BorderRadius.md },
  addBtnText: { color: '#FFF', fontWeight: '600', marginLeft: Spacing.sm },
  fab: {
    position: 'absolute', bottom: 24, right: 24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
});
