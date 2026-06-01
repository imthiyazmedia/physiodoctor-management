import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../../constants/colors';

const menuItems = [
  { section: 'Clinical', items: [
    { icon: 'clipboard-outline', label: 'SOAP Notes', route: 'SOAPNotes', color: Colors.chartBlue },
    { icon: 'analytics-outline', label: 'Reports & Analytics', route: 'Reports', color: Colors.chartPurple },
    { icon: 'fitness-outline', label: 'Exercise Prescriptions', route: 'ExercisesList', color: Colors.chartGreen },
  ]},
  { section: 'Business', items: [
    { icon: 'trending-up-outline', label: 'Daily Summary', route: 'DailySummary', color: Colors.chartOrange },
    { icon: 'people-outline', label: 'Referral Tracking', route: 'Referrals', color: Colors.info },
    { icon: 'document-text-outline', label: 'Insurance Claims', route: 'Insurance', color: Colors.danger },
    { icon: 'settings-outline', label: 'Settings', route: 'Settings', color: Colors.textSecondary },
  ]},
  { section: 'Support', items: [
    { icon: 'help-circle-outline', label: 'Help & Support', route: 'Help', color: Colors.info },
    { icon: 'information-circle-outline', label: 'About', route: 'About', color: Colors.textSecondary },
    { icon: 'share-outline', label: 'Share App', action: 'share', color: Colors.chartGreen },
  ]},
];

export default function MoreScreen({ navigation }: any) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Card */}
      <TouchableOpacity style={styles.profileCard} onPress={() => navigation.navigate('ClinicProfile')}>
        <View style={styles.profileAvatar}>
          <Ionicons name="medical-outline" size={32} color="#FFF" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.clinicName}>Physiodoctor Clinic</Text>
          <Text style={styles.clinicMeta}>Toronto, Canada 🇨🇦</Text>
          <Text style={styles.clinicMeta}>+1 (647) 123-4567</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
      </TouchableOpacity>

      {/* Stats Recap */}
      <View style={styles.statsRecap}>
        <View style={styles.recapItem}>
          <Ionicons name="people" size={20} color={Colors.chartBlue} />
          <Text style={styles.recapValue}>0</Text>
          <Text style={styles.recapLabel}>Patients</Text>
        </View>
        <View style={styles.recapDivider} />
        <View style={styles.recapItem}>
          <Ionicons name="calendar" size={20} color={Colors.chartOrange} />
          <Text style={styles.recapValue}>0</Text>
          <Text style={styles.recapLabel}>Today</Text>
        </View>
        <View style={styles.recapDivider} />
        <View style={styles.recapItem}>
          <Ionicons name="cash" size={20} color={Colors.chartGreen} />
          <Text style={styles.recapValue}>₹0</Text>
          <Text style={styles.recapLabel}>Revenue</Text>
        </View>
        <View style={styles.recapDivider} />
        <View style={styles.recapItem}>
          <Ionicons name="fitness" size={20} color={Colors.chartPurple} />
          <Text style={styles.recapValue}>0</Text>
          <Text style={styles.recapLabel}>Exercises</Text>
        </View>
      </View>

      {/* Menu Sections */}
      {menuItems.map((section) => (
        <View key={section.section} style={styles.menuSection}>
          <Text style={styles.sectionTitle}>{section.section}</Text>
          <View style={styles.menuCard}>
            {section.items.map((item, idx) => (
              <TouchableOpacity
                key={item.label}
                style={[styles.menuItem, idx < section.items.length - 1 && styles.menuItemBorder]}
                onPress={() => {
                  if (item.action === 'share') {
                    Alert.alert('Share', 'Share Physiodoctor Management with your colleagues!');
                  } else {
                    navigation.navigate(item.route);
                  }
                }}
              >
                <View style={[styles.menuIcon, { backgroundColor: item.color + '15' }]}>
                  <Ionicons name={item.icon as any} size={20} color={item.color} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {/* Version */}
      <Text style={styles.version}>Physiodoctor Management v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: Spacing.xxxl },
  profileCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primary,
    marginHorizontal: Spacing.xl, marginTop: Spacing.lg, padding: Spacing.xl,
    borderRadius: BorderRadius.lg, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  profileAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  profileInfo: { flex: 1, marginLeft: Spacing.lg },
  clinicName: { fontSize: FontSize.xl, fontWeight: '700', color: '#FFF' },
  clinicMeta: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  statsRecap: { flexDirection: 'row', backgroundColor: Colors.surface, marginHorizontal: Spacing.xl, marginTop: Spacing.lg, borderRadius: BorderRadius.md, padding: Spacing.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  recapItem: { flex: 1, alignItems: 'center' },
  recapValue: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text, marginTop: 4 },
  recapLabel: { fontSize: FontSize.xs, color: Colors.textLight },
  recapDivider: { width: 1, backgroundColor: Colors.divider },
  menuSection: { paddingHorizontal: Spacing.xl, marginTop: Spacing.xl },
  sectionTitle: { fontSize: FontSize.sm, color: Colors.textLight, marginBottom: Spacing.sm, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  menuCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.divider },
  menuIcon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  menuLabel: { flex: 1, fontSize: FontSize.md, color: Colors.text, marginLeft: Spacing.md, fontWeight: '500' },
  version: { textAlign: 'center', fontSize: FontSize.sm, color: Colors.textLight, marginTop: Spacing.xxl },
});
