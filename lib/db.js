const today = () => new Date().toISOString().slice(0, 10);
const createdAt = '2026-07-24 10:00:00';

let students = [
  ['Ayesha Khan', 'SMS-001', 'Class 1', 'Nadia Khan', '0300-1111111', 'Active', 'A'],
  ['Hamza Ali', 'SMS-002', 'Class 3', 'Usman Ali', '0300-2222222', 'Active', 'B'],
  ['Mina Shah', 'SMS-003', 'Class 1', 'Sara Shah', '0300-3333333', 'Active', 'A'],
  ['Zara Iqbal', 'SMS-004', 'Class 4', 'Farah Iqbal', '0300-4444444', 'Active', 'B'],
  ['Ali Hassan', 'SMS-005', 'Class 3', 'Bilal Hassan', '0300-5555555', 'Active', 'A'],
  ['Fatima Noor', 'SMS-006', 'Class 6', 'Shabana Noor', '0300-6666666', 'Active', 'A'],
  ['Omar Siddiqui', 'SMS-007', 'Class 8', 'Sadia Siddiqui', '0300-7777777', 'Active', 'B'],
  ['Sara Khan', 'SMS-008', 'Class 7', 'Ayesha Khan', '0300-8888888', 'Active', 'A'],
  ['Hassan Shah', 'SMS-009', 'Class 6', 'Rashid Shah', '0300-9999999', 'Active', 'A'],
  ['Amina Rizvi', 'SMS-010', 'Class 8', 'Sana Rizvi', '0310-1111111', 'Active', 'B'],
  ['Bilal Qureshi', 'SMS-011', 'Class 10', 'Naveed Qureshi', '0310-2222222', 'Active', 'A'],
  ['Laila Aslam', 'SMS-012', 'Class 7', 'Hina Aslam', '0310-3333333', 'Active', 'A'],
  ['Kiran Patel', 'SMS-013', 'Class 9', 'Pooja Patel', '0310-4444444', 'Active', 'A'],
  ['Yousuf Sheikh', 'SMS-014', 'Class 9', 'Amjad Sheikh', '0310-5555555', 'Active', 'B'],
  ['Sadia Javed', 'SMS-015', 'Class 10', 'Javed Khan', '0310-6666666', 'Active', 'B'],
  ['Bilal Ahmed', 'SMS-016', 'Class 4', 'Sara Ahmed', '0310-7777777', 'Active', 'A'],
].map(([name, roll_number, class_name, guardian, phone, status, section], index) => ({
  id: index + 1,
  name,
  roll_number,
  class_name,
  guardian,
  phone,
  status,
  section,
  created_at: createdAt,
}));

let teachers = [
  ['TCH-001', 'Mr. Ahmed Raza', 'Mathematics', '0311-4444444', 'ahmed.raza@school.local', 'House 21, Model Town, Lahore', 'MSc Mathematics', 8, '0300-8888888', '2020-08-10', 'Active'],
  ['TCH-002', 'Ms. Sana Malik', 'Science', '0311-5555555', 'sana.malik@school.local', 'Street 8, Gulshan Block, Karachi', 'MPhil Biology', 6, '0300-9999999', '2021-03-15', 'Active'],
  ['TCH-003', 'Mr. Usman Farooq', 'English', '0311-6666666', 'usman.farooq@school.local', 'House 5, Johar Town, Lahore', 'MA English', 5, '0300-2222222', '2022-01-12', 'Active'],
  ['TCH-004', 'Ms. Ayesha Bilal', 'History', '0311-7777777', 'ayesha.bilal@school.local', 'Park View, Islamabad', 'MA History', 7, '0300-3333333', '2019-09-01', 'Active'],
  ['TCH-005', 'Mr. Kamran Ahmed', 'Computer Science', '0311-8888888', 'kamran.ahmed@school.local', 'F-8 Markaz, Islamabad', 'BS Computer Science', 4, '0300-4444444', '2023-02-28', 'Active'],
].map((
  [employee_id, name, subject, phone, email, address, qualification, experience_years, emergency_contact, joined_date, status],
  index
) => ({
  id: index + 1,
  employee_id,
  name,
  subject,
  phone,
  email,
  address,
  qualification,
  experience_years,
  emergency_contact,
  joined_date,
  status,
  created_at: createdAt,
}));

let classes = [
  ['Class 1', 'A', 'Room 101', 1],
  ['Class 2', 'A', 'Room 102', null],
  ['Class 3', 'B', 'Room 103', 2],
  ['Class 4', 'A', 'Room 104', 3],
  ['Class 5', 'B', 'Room 105', null],
  ['Class 6', 'A', 'Room 106', 1],
  ['Class 7', 'A', 'Room 107', 2],
  ['Class 8', 'B', 'Room 108', 3],
  ['Class 9', 'B', 'Room 109', 4],
  ['Class 10', 'A', 'Room 110', 5],
].map(([name, section, room, teacher_id], index) => ({
  id: index + 1,
  name,
  section,
  room,
  teacher_id,
  created_at: createdAt,
}));

let attendance = [];
let nextStudentId = students.length + 1;
let nextTeacherId = teachers.length + 1;
let nextClassId = classes.length + 1;
let nextAttendanceId = 1;

const statuses = ['Present', 'Present', 'Present', 'Absent', 'Late'];
const notes = {
  Present: '',
  Absent: 'Absent - please notify guardian',
  Late: 'Late arrival',
};

for (const student of students) {
  for (let dayOffset = 0; dayOffset < 5; dayOffset += 1) {
    const date = new Date();
    date.setDate(date.getDate() - dayOffset);
    const status = statuses[(student.id + dayOffset) % statuses.length];
    attendance.push({
      id: nextAttendanceId,
      student_id: student.id,
      attendance_date: date.toISOString().slice(0, 10),
      status,
      note: notes[status],
      created_at: createdAt,
    });
    nextAttendanceId += 1;
  }
}

const byNewest = (a, b) => b.id - a.id;
const byClassName = (a, b) => a.name.localeCompare(b.name, undefined, { numeric: true });

function attachTeacherName(classroom) {
  const teacher = teachers.find((item) => item.id === classroom.teacher_id);
  return { ...classroom, teacher_name: teacher?.name || null };
}

function attachStudentInfo(record) {
  const student = students.find((item) => item.id === record.student_id);
  return {
    ...record,
    student_name: student?.name || 'Unknown Student',
    class_name: student?.class_name || 'Unknown Class',
    roll_number: student?.roll_number || '',
  };
}

const schoolStore = {
  listStudents(className) {
    const rows = className
      ? students.filter((student) => student.class_name === className)
      : students;
    return [...rows].sort(byNewest);
  },

  addStudent(payload) {
    if (students.some((student) => student.roll_number === payload.roll_number)) {
      throw new Error('A student with this roll number already exists.');
    }

    students = [
      {
        id: nextStudentId,
        name: payload.name,
        roll_number: payload.roll_number,
        class_name: payload.class_name,
        section: payload.section || 'None',
        phone: payload.phone,
        guardian: payload.guardian || 'Not provided',
        status: payload.status || 'Active',
        created_at: createdAt,
      },
      ...students,
    ];
    nextStudentId += 1;
    return this.listStudents();
  },

  listTeachers() {
    return [...teachers].sort(byNewest);
  },

  getTeacher(id) {
    return teachers.find((teacher) => teacher.id === Number(id));
  },

  addTeacher(payload) {
    teachers = [
      {
        id: nextTeacherId,
        ...payload,
        qualification: payload.qualification || '',
        experience_years: Number(payload.experience_years) || 0,
        emergency_contact: payload.emergency_contact || '',
        status: payload.status || 'Active',
        created_at: createdAt,
      },
      ...teachers,
    ];
    nextTeacherId += 1;
    return this.listTeachers();
  },

  listClasses() {
    return [...classes].sort(byClassName).map(attachTeacherName);
  },

  addClass(payload) {
    if (classes.some((classroom) => classroom.name === payload.name)) {
      throw new Error('A class with this name already exists.');
    }

    classes = [
      ...classes,
      {
        id: nextClassId,
        name: payload.name,
        section: payload.section,
        room: payload.room,
        teacher_id: payload.teacher_id ? Number(payload.teacher_id) : null,
        created_at: createdAt,
      },
    ];
    nextClassId += 1;
    return this.listClasses();
  },

  listAttendance(date) {
    const rows = date
      ? attendance.filter((record) => record.attendance_date === date)
      : attendance;
    return [...rows]
      .sort((a, b) => b.attendance_date.localeCompare(a.attendance_date) || b.id - a.id)
      .map(attachStudentInfo);
  },

  markAttendance(payload) {
    const existing = attendance.find(
      (record) =>
        record.student_id === Number(payload.student_id) &&
        record.attendance_date === payload.attendance_date
    );

    if (existing) {
      existing.status = payload.status;
      existing.note = payload.note || '';
    } else {
      attendance.push({
        id: nextAttendanceId,
        student_id: Number(payload.student_id),
        attendance_date: payload.attendance_date || today(),
        status: payload.status,
        note: payload.note || '',
        created_at: createdAt,
      });
      nextAttendanceId += 1;
    }

    return this.listAttendance();
  },

  dashboard() {
    const todayRecords = attendance.filter((record) => record.attendance_date === today());
    const attendance_today = { Present: 0, Absent: 0, Late: 0 };
    for (const record of todayRecords) {
      attendance_today[record.status] += 1;
    }

    return {
      students: students.length,
      teachers: teachers.length,
      classes: classes.length,
      attendance_today,
      recent_students: this.listStudents().slice(0, 5),
      recent_teachers: this.listTeachers().slice(0, 5),
      recent_classes: [...classes].sort(byNewest).slice(0, 5).map(attachTeacherName),
    };
  },
};

export default schoolStore;
