import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../../constants/colors';

export default function SettingsScreen() {
  const [notifications, setNotifications] = React.useState(true);
  const [smsReminders, setSmsReminders] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(false);

  const settingsSections = [
    { section: 'General', items: [
      { icon: 'business-outline', label: 'Clinic Profile', value: 'Physiodoctor Clinic' },
      { icon: 'people-outline', label: 'Staff Management', value: '' },
      { icon: 'notifications-outline', label: 'Notifications', value: '', toggle: notifications, onToggle: setNotifications },
    ]},
    { section: 'Appointments', items: [
      { icon: 'timer-outline', label: 'Default Session Duration', value: '45 min' },
      { icon: 'alarm-outline', label: 'Reminder Timing', value: '24h before' },
      { icon: 'chatbubble-outline', label: 'SMS Reminders', value: '', toggle: smsReminders, onToggle: setSmsReminders },
    ]},
    { section: 'Billing', items: [
      { icon: 'cash-outline', label: 'Default Tax Rate', value: '18%' },
      { icon: 'receipt-outline', label: 'Invoice Prefix', value: 'INV-' },
      { icon: 'card-outline', label: 'Payment Methods', value: 'Cash, Card, UPI' },
    ]},
    { section: 'Appearance', items: [
      { icon: 'moon-outline', label: 'Dark Mode', value: '', toggle: darkMode, onToggle: setDarkMode },
      { icon: 'language-outline', label: 'Language', value: 'English' },
    ]},
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {settingsSections.map((section) => (
        <View key={section.section} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.section}</Text>
          <View style={styles.sectionCard}>
            {section.items.map((item, idx) => (
              <View key={item.label} style={[styles.settingItem, idx < section.items.length - 1 && styles.settingBorder]}>
                <Ionicons name={item.icon as any} size={20} color={Colors.textSecondary} />
                <Text style={styles.settingLabel}>{item.label}</Text>
                {item.toggle !== undefined ? (
                  <Switch value={item.toggle} onValueChange={item.onToggle} trackColor={{ false: Colors.border, true: Colors.primary + '60' }} thumbColor={item.toggle ? Colors.primary : Colors.textLight} />
                ) : (
                  <>
                    {item.value ? <Text style={styles.settingValue}>{item.value}</Text> : null}
                    <Ionicons name="chevron-forward" size={16} color={Colors.textLight} />
                  </>
                )}
              </View>
            ))}
          </View>
        </View>
      ))}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Physiodoctor Management v1.0.0</Text>
        <Text style={styles.footerSubtext}>Built with ❤️ for physiotherapy professionals</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.xl, paddingBottom: 60 },
  section: { marginBottom: Spacing.xl },
  sectionTitle: { fontSize: FontSize.sm, color: Colors.textLight, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: Spacing.sm },
  sectionCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  settingItem: { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg },
  settingBorder: { borderBottomWidth: 1, borderBottomColor: Colors.divider },
  settingLabel: { flex: 1, fontSize: FontSize.md, color: Colors.text, marginLeft: Spacing.md },
  settingValue: { fontSize: FontSize.sm, color: Colors.textLight, marginRight: Spacing.sm },
  footer: { alignItems: 'center', paddingTop: Spacing.xl },
  footerText: { fontSize: FontSize.sm, color: Colors.textLight },
  footerSubtext: { fontSize: FontSize.xs, color: Colors.textLight, marginTop: 4 },
});
