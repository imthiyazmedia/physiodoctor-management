import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../constants/colors';

interface PatientCardProps {
  patient: any;
  onPress: () => void;
}

export default function PatientCard({ patient, onPress }: PatientCardProps) {
  const initials = (patient.firstName?.[0] || '') + (patient.lastName?.[0] || '');
  const statusColor = patient.status === 'Active' ? Colors.success : patient.status === 'Inactive' ? Colors.warning : Colors.danger;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.avatar, { backgroundColor: Colors.primary }]}>
        <Text style={styles.avatarText}>{initials.toUpperCase()}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{patient.firstName} {patient.lastName}</Text>
        <Text style={styles.phone}>{patient.phone || 'No phone'}</Text>
        <Text style={styles.email}>{patient.email || 'No email'}</Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
        <Text style={[styles.statusText, { color: statusColor }]}>{patient.status}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    color: '#FFF',
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  phone: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  email: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
  },
  statusText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
});
