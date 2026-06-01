import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../../constants/colors';

export default function InvoiceDetailScreen() {
  const { id } = useLocalSearchParams();
  const [invoice, setInvoice] = useState<any>(null);

  useEffect(() => {
    // Would load from DB in full app
    setInvoice({ id, patientName: 'Patient', amount: 0, total: 0, status: 'Pending' });
  }, [id]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text>Invoice Details - Coming Soon</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.xl },
});
