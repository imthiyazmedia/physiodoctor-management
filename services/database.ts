import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync('physiodoctor.db');
    await initDatabase(db);
  }
  return db;
}

async function initDatabase(database: SQLite.SQLiteDatabase): Promise<void> {
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    
    CREATE TABLE IF NOT EXISTS patients (
      id TEXT PRIMARY KEY,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      address TEXT,
      dateOfBirth TEXT,
      gender TEXT,
      emergencyContact TEXT,
      emergencyPhone TEXT,
      medicalHistory TEXT,
      medications TEXT,
      allergies TEXT,
      notes TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      status TEXT DEFAULT 'Active'
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      patientId TEXT NOT NULL,
      patientName TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      duration INTEGER DEFAULT 45,
      type TEXT DEFAULT 'Treatment',
      status TEXT DEFAULT 'Scheduled',
      notes TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (patientId) REFERENCES patients(id)
    );

    CREATE TABLE IF NOT EXISTS soap_notes (
      id TEXT PRIMARY KEY,
      appointmentId TEXT NOT NULL,
      patientId TEXT NOT NULL,
      subjective TEXT,
      objective TEXT,
      assessment TEXT,
      plan TEXT,
      painLevel INTEGER DEFAULT 0,
      rangeOfMotion TEXT,
      strength TEXT,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (appointmentId) REFERENCES appointments(id),
      FOREIGN KEY (patientId) REFERENCES patients(id)
    );

    CREATE TABLE IF NOT EXISTS invoices (
      id TEXT PRIMARY KEY,
      patientId TEXT NOT NULL,
      patientName TEXT NOT NULL,
      appointmentId TEXT,
      amount REAL DEFAULT 0,
      tax REAL DEFAULT 0,
      total REAL DEFAULT 0,
      status TEXT DEFAULT 'Pending',
      paymentMethod TEXT,
      notes TEXT,
      date TEXT NOT NULL,
      dueDate TEXT NOT NULL,
      paidAt TEXT,
      FOREIGN KEY (patientId) REFERENCES patients(id)
    );

    CREATE TABLE IF NOT EXISTS exercises (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT DEFAULT 'Other',
      instructions TEXT,
      duration TEXT,
      sets INTEGER DEFAULT 3,
      reps INTEGER DEFAULT 10,
      imageUrl TEXT,
      videoUrl TEXT,
      precautions TEXT
    );

    CREATE TABLE IF NOT EXISTS assigned_exercises (
      id TEXT PRIMARY KEY,
      patientId TEXT NOT NULL,
      exerciseId TEXT NOT NULL,
      exerciseName TEXT NOT NULL,
      assignedDate TEXT NOT NULL,
      frequency TEXT,
      duration TEXT,
      notes TEXT,
      status TEXT DEFAULT 'Active',
      FOREIGN KEY (patientId) REFERENCES patients(id),
      FOREIGN KEY (exerciseId) REFERENCES exercises(id)
    );
  `);
}

// --- PATIENT CRUD ---

export async function addPatient(patient: any): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    `INSERT INTO patients (id, firstName, lastName, phone, email, address, dateOfBirth, gender, 
     emergencyContact, emergencyPhone, medicalHistory, medications, allergies, notes, createdAt, updatedAt, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [patient.id, patient.firstName, patient.lastName, patient.phone, patient.email,
     patient.address, patient.dateOfBirth, patient.gender, patient.emergencyContact,
     patient.emergencyPhone, patient.medicalHistory, patient.medications, patient.allergies,
     patient.notes, patient.createdAt, patient.updatedAt, patient.status || 'Active']
  );
}

export async function getPatients(): Promise<any[]> {
  const database = await getDatabase();
  return await database.getAllAsync('SELECT * FROM patients ORDER BY createdAt DESC');
}

export async function getPatient(id: string): Promise<any> {
  const database = await getDatabase();
  return await database.getFirstAsync('SELECT * FROM patients WHERE id = ?', [id]);
}

export async function updatePatient(patient: any): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    `UPDATE patients SET firstName=?, lastName=?, phone=?, email=?, address=?, dateOfBirth=?, gender=?,
     emergencyContact=?, emergencyPhone=?, medicalHistory=?, medications=?, allergies=?, notes=?, updatedAt=?, status=?
     WHERE id=?`,
    [patient.firstName, patient.lastName, patient.phone, patient.email, patient.address,
     patient.dateOfBirth, patient.gender, patient.emergencyContact, patient.emergencyPhone,
     patient.medicalHistory, patient.medications, patient.allergies, patient.notes,
     patient.updatedAt, patient.status, patient.id]
  );
}

export async function deletePatient(id: string): Promise<void> {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM patients WHERE id = ?', [id]);
  await database.runAsync('DELETE FROM appointments WHERE patientId = ?', [id]);
  await database.runAsync('DELETE FROM invoices WHERE patientId = ?', [id]);
}

// --- APPOINTMENT CRUD ---

export async function addAppointment(appt: any): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    `INSERT INTO appointments (id, patientId, patientName, date, time, duration, type, status, notes, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [appt.id, appt.patientId, appt.patientName, appt.date, appt.time, appt.duration || 45,
     appt.type || 'Treatment', appt.status || 'Scheduled', appt.notes || '', appt.created_at]
  );
}

export async function getAppointments(): Promise<any[]> {
  const database = await getDatabase();
  return await database.getAllAsync('SELECT * FROM appointments ORDER BY date DESC, time DESC');
}

export async function getAppointmentsByDate(date: string): Promise<any[]> {
  const database = await getDatabase();
  return await database.getAllAsync(
    'SELECT * FROM appointments WHERE date = ? ORDER BY time ASC', [date]
  );
}

export async function getTodayAppointments(): Promise<any[]> {
  const today = new Date().toISOString().split('T')[0];
  const database = await getDatabase();
  return await database.getAllAsync(
    'SELECT * FROM appointments WHERE date = ? ORDER BY time ASC', [today]
  );
}

export async function updateAppointmentStatus(id: string, status: string): Promise<void> {
  const database = await getDatabase();
  await database.runAsync('UPDATE appointments SET status = ? WHERE id = ?', [status, id]);
}

// --- SOAP NOTES CRUD ---

export async function addSOAPNote(note: any): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    `INSERT INTO soap_notes (id, appointmentId, patientId, subjective, objective, assessment, plan, 
     painLevel, rangeOfMotion, strength, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [note.id, note.appointmentId, note.patientId, note.subjective, note.objective,
     note.assessment, note.plan, note.painLevel, note.rangeOfMotion, note.strength, note.createdAt]
  );
}

export async function getSOAPNotes(patientId: string): Promise<any[]> {
  const database = await getDatabase();
  return await database.getAllAsync(
    'SELECT * FROM soap_notes WHERE patientId = ? ORDER BY createdAt DESC', [patientId]
  );
}

// --- INVOICE CRUD ---

export async function addInvoice(invoice: any): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    `INSERT INTO invoices (id, patientId, patientName, appointmentId, amount, tax, total, status,
     paymentMethod, notes, date, dueDate, paidAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [invoice.id, invoice.patientId, invoice.patientName, invoice.appointmentId,
     invoice.amount, invoice.tax, invoice.total, invoice.status || 'Pending',
     invoice.paymentMethod || '', invoice.notes || '', invoice.date, invoice.dueDate, invoice.paidAt || '']
  );
}

export async function getInvoices(): Promise<any[]> {
  const database = await getDatabase();
  return await database.getAllAsync('SELECT * FROM invoices ORDER BY date DESC');
}

export async function updateInvoiceStatus(id: string, status: string, paidAt?: string): Promise<void> {
  const database = await getDatabase();
  if (paidAt) {
    await database.runAsync('UPDATE invoices SET status = ?, paidAt = ? WHERE id = ?', [status, paidAt, id]);
  } else {
    await database.runAsync('UPDATE invoices SET status = ? WHERE id = ?', [status, id]);
  }
}

// --- EXERCISE CRUD ---

export async function addExercise(exercise: any): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    `INSERT INTO exercises (id, name, description, category, instructions, duration, sets, reps, imageUrl, videoUrl, precautions)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [exercise.id, exercise.name, exercise.description, exercise.category,
     JSON.stringify(exercise.instructions || []), exercise.duration, exercise.sets, exercise.reps,
     exercise.imageUrl || '', exercise.videoUrl || '', exercise.precautions || '']
  );
}

export async function getExercises(): Promise<any[]> {
  const database = await getDatabase();
  return await database.getAllAsync('SELECT * FROM exercises ORDER BY category, name');
}

export async function assignExercise(assignment: any): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    `INSERT INTO assigned_exercises (id, patientId, exerciseId, exerciseName, assignedDate, frequency, duration, notes, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [assignment.id, assignment.patientId, assignment.exerciseId, assignment.exerciseName,
     assignment.assignedDate, assignment.frequency, assignment.duration, assignment.notes, 'Active']
  );
}

export async function getAssignedExercises(patientId: string): Promise<any[]> {
  const database = await getDatabase();
  return await database.getAllAsync(
    'SELECT * FROM assigned_exercises WHERE patientId = ? ORDER BY assignedDate DESC', [patientId]
  );
}

// --- STATS ---

export async function getDashboardStats(): Promise<any> {
  const database = await getDatabase();
  const today = new Date().toISOString().split('T')[0];
  const thisMonth = new Date().toISOString().slice(0, 7);

  const totalPatients = await database.getFirstAsync('SELECT COUNT(*) as count FROM patients');
  const activePatients = await database.getFirstAsync("SELECT COUNT(*) as count FROM patients WHERE status = 'Active'");
  const todayAppts = await database.getFirstAsync('SELECT COUNT(*) as count FROM appointments WHERE date = ?', [today]);
  const completedToday = await database.getFirstAsync("SELECT COUNT(*) as count FROM appointments WHERE date = ? AND status = 'Completed'", [today]);
  const newThisMonth = await database.getFirstAsync("SELECT COUNT(*) as count FROM patients WHERE createdAt LIKE ?", [`${thisMonth}%`]);
  const pendingPayments = await database.getFirstAsync("SELECT COUNT(*) as count FROM invoices WHERE status = 'Pending' OR status = 'Overdue'");
  const monthlyRevenue = await database.getFirstAsync("SELECT COALESCE(SUM(total), 0) as total FROM invoices WHERE status = 'Paid' AND date LIKE ?", [`${thisMonth}%`]);

  return {
    totalPatients: totalPatients?.count || 0,
    activePatients: activePatients?.count || 0,
    todayAppointments: todayAppts?.count || 0,
    completedToday: completedToday?.count || 0,
    newPatientsThisMonth: newThisMonth?.count || 0,
    pendingPayments: pendingPayments?.count || 0,
    monthlyRevenue: monthlyRevenue?.total || 0,
  };
}
