import { addPatient, addAppointment, addExercise, addInvoice } from './database';

const samplePatients = [
  { firstName: 'Rajesh', lastName: 'Kumar', phone: '+91-9876543210', email: 'rajesh.k@email.com', address: '42, MG Road, Mumbai - 400001', gender: 'Male', medicalHistory: 'Hypertension', createdAt: '2026-05-15T10:00:00Z', updatedAt: '2026-05-15T10:00:00Z' },
  { firstName: 'Priya', lastName: 'Sharma', phone: '+91-9876543211', email: 'priya.s@email.com', address: '15, Lajpat Nagar, Delhi - 110024', gender: 'Female', medicalHistory: 'Asthma', createdAt: '2026-05-16T11:00:00Z', updatedAt: '2026-05-16T11:00:00Z' },
  { firstName: 'Amit', lastName: 'Singh', phone: '+91-9876543212', email: 'amit.singh@email.com', address: '8, BTM Layout, Bangalore - 560076', gender: 'Male', medicalHistory: 'Diabetes Type 2', createdAt: '2026-05-17T12:00:00Z', updatedAt: '2026-05-17T12:00:00Z' },
  { firstName: 'Sunita', lastName: 'Patel', phone: '+91-9876543213', email: 'sunita.p@email.com', address: '22, Civil Lines, Ahmedabad - 380006', gender: 'Female', medicalHistory: 'Cervical Spondylitis', createdAt: '2026-05-18T09:00:00Z', updatedAt: '2026-05-18T09:00:00Z' },
  { firstName: 'Vikram', lastName: 'Joshi', phone: '+91-9876543214', email: 'vikram.j@email.com', address: '5, FC Road, Pune - 411004', gender: 'Male', medicalHistory: 'Knee Arthritis, Lumbar Spondylosis', createdAt: '2026-05-19T14:00:00Z', updatedAt: '2026-05-19T14:00:00Z' },
  { firstName: 'Sneha', lastName: 'Reddy', phone: '+91-9876543215', email: 'sneha.r@email.com', address: '7, Jubilee Hills, Hyderabad - 500033', gender: 'Female', medicalHistory: 'Post-Surgery Rehab (ACL)', createdAt: '2026-05-10T08:00:00Z', updatedAt: '2026-05-10T08:00:00Z' },
];

const sampleExercises = [
  { name: 'Hamstring Stretch', description: 'Gentle stretching of the hamstring muscles', category: 'Stretching', instructions: ['Lie on your back', 'Lift one leg up', 'Hold for 30 seconds', 'Repeat 3 times per leg'], duration: '15 min', sets: 3, reps: 30, precautions: 'Do not bounce - stop if sharp pain' },
  { name: 'Shoulder Blade Squeeze', description: 'Strengthen rhomboids and improve posture', category: 'Strengthening', instructions: ['Sit up straight', 'Pull shoulders back and down', 'Squeeze shoulder blades together', 'Hold for 5 seconds'], duration: '10 min', sets: 3, reps: 12, precautions: 'Keep neck relaxed' },
  { name: 'Single Leg Stand', description: 'Improve balance and proprioception', category: 'Balance', instructions: ['Stand near a wall for support', 'Lift one foot off the ground', 'Balance for 30 seconds', 'Switch legs'], duration: '10 min', sets: 3, reps: 30, precautions: 'Use wall support if needed' },
  { name: 'Cat-Cow Stretch', description: 'Spine mobility exercise for back pain relief', category: 'Stretching', instructions: ['Start on hands and knees', 'Arch back (Cow)', 'Round back (Cat)', 'Flow between positions'], duration: '10 min', sets: 3, reps: 15, precautions: 'Move slowly - stop if dizzy' },
  { name: 'Wall Push-ups', description: 'Modified push-ups for upper body strength', category: 'Strengthening', instructions: ['Stand arm\'s length from wall', 'Place palms on wall', 'Slowly bend elbows', 'Push back to start'], duration: '10 min', sets: 3, reps: 12, precautions: 'Keep core engaged' },
  { name: 'Neck Retraction (Chin Tuck)', description: 'Correct forward head posture', category: 'Posture', instructions: ['Sit up straight', 'Pull chin straight back', 'Hold for 5 seconds', 'Release slowly'], duration: '5 min', sets: 5, reps: 10, precautions: 'Do not tilt head up or down' },
];

export async function seedSampleData() {
  try {
    console.log('Seeding sample data...');
    
    // Add exercises
    for (const ex of sampleExercises) {
      await addExercise({ id: `ex_seed_${Date.now()}_${Math.random().toString(36).slice(2,6)}`, ...ex });
    }

    // Add patients with appointments
    for (const p of samplePatients) {
      const patientId = `pt_seed_${Date.now()}_${Math.random().toString(36).slice(2,6)}`;
      const createdAt = p.createdAt;
      await addPatient({ ...p, id: patientId, emergencyContact: '', emergencyPhone: '', medications: '', allergies: '', notes: '', status: 'Active', createdAt, updatedAt: createdAt });

      // Add appointments for each patient
      const apptDate = new Date();
      apptDate.setDate(apptDate.getDate() + Math.floor(Math.random() * 7));
      const dateStr = apptDate.toISOString().split('T')[0];
      const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
      
      await addAppointment({
        id: `apt_seed_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
        patientId,
        patientName: `${p.firstName} ${p.lastName}`,
        date: dateStr,
        time: times[Math.floor(Math.random() * times.length)],
        duration: 45,
        type: ['Initial Assessment', 'Follow-up', 'Treatment', 'Re-assessment'][Math.floor(Math.random() * 4)],
        status: ['Scheduled', 'Completed', 'Completed', 'Scheduled'][Math.floor(Math.random() * 4)],
        notes: `Regular follow-up for ${p.firstName}`,
        created_at: createdAt,
      });
    }

    console.log('✅ Sample data seeded successfully!');
    return { patients: samplePatients.length, exercises: sampleExercises.length };
  } catch (e) {
    console.error('Seeding error:', e);
    throw e;
  }
}
