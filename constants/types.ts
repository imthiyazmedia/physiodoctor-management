export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  emergencyContact: string;
  emergencyPhone: string;
  medicalHistory: string;
  medications: string;
  allergies: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  status: 'Active' | 'Inactive' | 'Discharged';
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  duration: number; // minutes
  type: 'Initial Assessment' | 'Follow-up' | 'Treatment' | 'Re-assessment' | 'Home Visit';
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled' | 'No Show';
  notes: string;
  created_at: string;
}

export interface SOAPNote {
  id: string;
  appointmentId: string;
  patientId: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  painLevel: number;
  rangeOfMotion: string;
  strength: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  patientId: string;
  patientName: string;
  appointmentId: string;
  amount: number;
  tax: number;
  total: number;
  status: 'Pending' | 'Paid' | 'Overdue' | 'Cancelled';
  paymentMethod: 'Cash' | 'Card' | 'Insurance' | 'UPI' | 'Bank Transfer';
  notes: string;
  date: string;
  dueDate: string;
  paidAt?: string;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: 'Stretching' | 'Strengthening' | 'Balance' | 'Posture' | 'Cardio' | 'Other';
  instructions: string[];
  duration: string;
  sets: number;
  reps: number;
  imageUrl?: string;
  videoUrl?: string;
  precautions: string;
}

export interface AssignedExercise {
  id: string;
  patientId: string;
  exerciseId: string;
  exerciseName: string;
  assignedDate: string;
  frequency: string; // e.g., "3 times daily"
  duration: string; // e.g., "2 weeks"
  notes: string;
  status: 'Active' | 'Completed' | 'Paused';
}

export interface DashboardStats {
  totalPatients: number;
  activePatients: number;
  todayAppointments: number;
  completedToday: number;
  monthlyRevenue: number;
  pendingPayments: number;
  newPatientsThisMonth: number;
}

export type TabName = 'dashboard' | 'patients' | 'appointments' | 'billing' | 'more';
