import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../constants/colors';
import { getExercises } from '../../services/database';

export default function ExercisesScreen({ navigation }: any) {
  const [exercises, setExercises] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadExercises = useCallback(async () => {
    try {
      const data = await getExercises();
      setExercises(data);
    } catch (e) {
      console.error('Load exercises error:', e);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { loadExercises(); }, [loadExercises]));

  const categories = [...new Set(exercises.map(e => e.category))];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadExercises(); }} colors={[Colors.primary]} />}
      >
        {/* Quick actions */}
        <View style={styles.quickRow}>
          <TouchableOpacity style={styles.quickCard} onPress={() => navigation.navigate('ExercisesList')}>
            <Ionicons name="fitness-outline" size={24} color={Colors.primary} />
            <Text style={styles.quickText}>Exercise Library</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickCard} onPress={() => navigation.navigate('AssignedExercises')}>
            <Ionicons name="list-outline" size={24} color={Colors.chartGreen} />
            <Text style={styles.quickText}>Assigned Plans</Text>
          </TouchableOpacity>
        </View>

        {/* Exercise Categories */}
        {categories.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="fitness-outline" size={64} color={Colors.textLight} />
            <Text style={styles.emptyTitle}>No Exercises Yet</Text>
            <Text style={styles.emptySubtitle}>Add exercises to build your library</Text>
            <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('NewExercise')}>
              <Text style={styles.addBtnText}>Add Exercise</Text>
            </TouchableOpacity>
          </View>
        ) : (
          categories.map((cat) => (
            <View key={cat} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>{cat}</Text>
              {exercises.filter(e => e.category === cat).map((ex) => (
                <TouchableOpacity key={ex.id} style={styles.exCard} onPress={() => navigation.navigate('ExerciseDetail', { exerciseId: ex.id })}>
                  <View style={styles.exIcon}>
                    <Ionicons name={ex.category === 'Stretching' ? 'resize-outline' : ex.category === 'Strengthening' ? 'barbell-outline' : 'body-outline'} size={22} color={Colors.primary} />
                  </View>
                  <View style={styles.exInfo}>
                    <Text style={styles.exName}>{ex.name}</Text>
                    <Text style={styles.exMeta}>{ex.sets} sets × {ex.reps} reps | {ex.duration}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
                </TouchableOpacity>
              ))}
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('NewExercise')}>
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  list: { flex: 1 },
  listContent: { paddingBottom: 100 },
  quickRow: { flexDirection: 'row', paddingHorizontal: Spacing.xl, gap: Spacing.md, marginTop: Spacing.lg, marginBottom: Spacing.md },
  quickCard: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, padding: Spacing.lg, borderRadius: BorderRadius.md, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  quickText: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text, marginLeft: Spacing.sm },
  categorySection: { paddingHorizontal: Spacing.xl, marginBottom: Spacing.lg },
  categoryTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text, marginBottom: Spacing.sm },
  exCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.sm, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  exIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primary + '12', justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  exInfo: { flex: 1 },
  exName: { fontSize: FontSize.md, fontWeight: '600', color: Colors.text },
  exMeta: { fontSize: FontSize.sm, color: Colors.textLight, marginTop: 2 },
  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: '600', color: Colors.text, marginTop: Spacing.lg },
  emptySubtitle: { fontSize: FontSize.sm, color: Colors.textLight, marginTop: Spacing.xs, marginBottom: Spacing.xl },
  addBtn: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: BorderRadius.md },
  addBtnText: { color: '#FFF', fontWeight: '600' },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
});
