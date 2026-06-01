import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../../constants/colors';

export default function AssignedExercisesScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.empty}>
        <Ionicons name="list-outline" size={48} color={Colors.textLight} />
        <Text style={styles.emptyText}>Assigned exercise plans will appear here</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.xl, paddingTop: 60 },
  empty: { alignItems: 'center' },
  emptyText: { color: Colors.textLight, marginTop: Spacing.md, fontSize: FontSize.md },
});
