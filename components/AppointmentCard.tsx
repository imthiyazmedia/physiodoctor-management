import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../constants/colors';

interface AppointmentCardProps {
  appointment: any;
  onPress: () => void;
}

const statusColors: Record<string, string> = {
  Scheduled: Colors.statusScheduled,
  'In Progress': Colors.statusPending,
  Completed: Colors.statusCompleted,
  Cancelled: Colors.statusCancelled,
  'No Show': Colors.danger,
};

const typeIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  'Initial Assessment': 'clipboard-outline',
  'Follow-up': 'refresh-outline',
  'Treatment': 'fitness-outline',
  'Re-assessment': 'analytics-outline',
  'Home Visit': 'home-outline',
};

export default function AppointmentCard({ appointment, onPress }: AppointmentCardProps) {
  const statusColor = statusColors[appointment.status] || Colors.textSecondary;
  const icon = typeIcons[appointment.type] || 'calendar-outline';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.timeColumn}>
        <Text style={styles.timeText}>{appointment.time}</Text>
        <Text style={styles.durationText}>{appointment.duration}min</Text>
      </View>
      <View style={[styles.iconContainer, { backgroundColor: Colors.primary + '15' }]}>
        <Ionicons name={icon} size={22} color={Colors.primary} />
      </View>
      <View style={styles.info}>
        <Text style={styles.patientName}>{appointment.patientName}</Text>
        <Text style={styles.typeText}>{appointment.type}</Text>
        {appointment.notes ? (
          <Text style={styles.notes} numberOfLines={1}>{appointment.notes}</Text>
        ) : null}
      </View>
      <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
        <Text style={[styles.statusText, { color: statusColor }]}>{appointment.status}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  timeColumn: {
    alignItems: 'center',
    marginRight: Spacing.md,
    minWidth: 55,
  },
  timeText: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  durationText: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
    marginTop: 2,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  info: {
    flex: 1,
  },
  patientName: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  typeText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  notes: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    marginLeft: Spacing.sm,
  },
  statusText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
});
