import React from 'react';
import { Stack } from 'expo-router';
import { Colors } from '../constants/colors';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.surface },
        headerTintColor: Colors.text,
        headerTitleStyle: { fontWeight: '600' },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="patient/new" options={{ title: 'Add Patient', presentation: 'modal' }} />
      <Stack.Screen name="patient/[id]" options={{ title: 'Patient Details' }} />
      <Stack.Screen name="appointment/new" options={{ title: 'New Appointment', presentation: 'modal' }} />
      <Stack.Screen name="appointment/[id]" options={{ title: 'Appointment Details' }} />
      <Stack.Screen name="billing/invoice/new" options={{ title: 'New Invoice', presentation: 'modal' }} />
      <Stack.Screen name="billing/invoice/[id]" options={{ title: 'Invoice Details' }} />
      <Stack.Screen name="exercise/new" options={{ title: 'Add Exercise', presentation: 'modal' }} />
      <Stack.Screen name="exercise/[id]" options={{ title: 'Exercise Details' }} />
      <Stack.Screen name="exercise/assigned" options={{ title: 'Assigned Exercise Plans' }} />
      <Stack.Screen name="soap/[appointmentId]" options={{ title: 'SOAP Notes', presentation: 'modal' }} />
      <Stack.Screen name="reports/index" options={{ title: 'Reports & Analytics' }} />
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
    </Stack>
  );
}
