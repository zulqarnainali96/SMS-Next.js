function fullName(user = {}) {
  const parts = [user.first_name, user.last_name].filter(Boolean);
  return parts.join(' ') || user.username || 'Unknown';
}

function capitalizeStatus(status = '') {
  if (!status) return status;
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

function lowercaseStatus(status = '') {
  return status.toLowerCase();
}

export function mapStudent(apiStudent, classLookup = {}) {
  const user = apiStudent.user || {};
  const classInfo = classLookup[apiStudent.id];

  return {
    id: apiStudent.id,
    name: fullName(user),
    roll_number: apiStudent.admission_number,
    class_name: classInfo?.name || 'Not assigned',
    section: classInfo?.section || '—',
    phone: user.phone || apiStudent.parent_phone || '',
    guardian: apiStudent.parent_name || 'Not provided',
    status: 'Active',
    address: apiStudent.address || '',
    date_of_birth: apiStudent.date_of_birth,
    school: apiStudent.school,
    created_at: apiStudent.created_at,
    _raw: apiStudent,
  };
}

export function mapStudentCreate(form, schoolId) {
  const nameParts = (form.name || '').trim().split(/\s+/);
  const firstName = nameParts[0] || form.name;
  const lastName = nameParts.slice(1).join(' ') || firstName;
  const admissionNumber = (form.roll_number || '').trim();

  return {
    username: admissionNumber.toLowerCase().replace(/[^a-z0-9@._+-]/gi, '_'),
    email: form.email || `${admissionNumber.toLowerCase()}@school.local`,
    password: form.password || 'default123',
    first_name: firstName,
    last_name: lastName,
    admission_number: admissionNumber,
    school_id: schoolId,
    parent_name: form.guardian || '',
    parent_phone: form.phone || '',
    address: form.address || '',
  };
}

export function mapTeacher(apiTeacher) {
  const user = apiTeacher.user || {};

  return {
    id: apiTeacher.id,
    employee_id: apiTeacher.employee_id,
    name: fullName(user),
    subject: apiTeacher.subject_specialization || '—',
    phone: user.phone || '',
    email: user.email || '',
    address: '',
    qualification: '',
    experience_years: 0,
    emergency_contact: '',
    joined_date: apiTeacher.date_joined || '',
    status: 'Active',
    school: apiTeacher.school,
    created_at: apiTeacher.created_at,
    _raw: apiTeacher,
  };
}

export function mapTeacherCreate(form, schoolId) {
  const nameParts = (form.name || '').trim().split(/\s+/);
  const firstName = nameParts[0] || form.name;
  const lastName = nameParts.slice(1).join(' ') || firstName;

  return {
    employee_id: form.employee_id.trim(),
    subject_specialization: form.subject.trim(),
    date_joined: form.joined_date,
    school: schoolId,
    user: {
      username: form.email.split('@')[0] || form.employee_id.toLowerCase(),
      email: form.email.trim(),
      first_name: firstName,
      last_name: lastName,
      phone: form.phone.trim(),
      role: 'teacher',
      school: schoolId,
    },
  };
}

export function mapClass(apiClass, teacherLookup = {}) {
  const teacher = teacherLookup[apiClass.id];

  return {
    id: apiClass.id,
    name: apiClass.name,
    section: `Grade ${apiClass.grade_level}`,
    room: '—',
    teacher_id: teacher?.id || null,
    teacher_name: teacher?.name || null,
    grade_level: apiClass.grade_level,
    school: apiClass.school,
    created_at: apiClass.created_at,
    _raw: apiClass,
  };
}

export function mapClassCreate(form, schoolId) {
  const gradeMatch = form.name.match(/\d+/);
  const gradeLevel = gradeMatch ? Number(gradeMatch[0]) : 1;

  return {
    name: form.name.trim(),
    grade_level: gradeLevel,
    school: schoolId,
  };
}

export function mapAttendance(apiRecord, studentLookup = {}, classLookup = {}) {
  const student = studentLookup[apiRecord.student];
  const classInfo = classLookup[apiRecord.class_obj];

  return {
    id: apiRecord.id,
    student_id: apiRecord.student,
    attendance_date: apiRecord.date,
    status: capitalizeStatus(apiRecord.status),
    note: '',
    student_name: student?.name || 'Unknown Student',
    class_name: classInfo?.name || student?.class_name || 'Unknown Class',
    roll_number: student?.roll_number || '',
    _raw: apiRecord,
  };
}

export function mapAttendanceCreate(form, classId) {
  return {
    student: form.student_id,
    class_obj: classId,
    date: form.attendance_date,
    status: lowercaseStatus(form.status),
  };
}

export function mapExam(apiExam, subjectLookup = {}, classLookup = {}) {
  return {
    id: apiExam.id,
    name: apiExam.name,
    date: apiExam.date,
    max_marks: apiExam.max_marks,
    subject: subjectLookup[apiExam.subject]?.name || apiExam.subject,
    class_name: classLookup[apiExam.class_obj]?.name || apiExam.class_obj,
    school: apiExam.school,
    created_at: apiExam.created_at,
    _raw: apiExam,
  };
}

export function mapFeeRecord(apiRecord, studentLookup = {}) {
  const student = studentLookup[apiRecord.student];

  return {
    id: apiRecord.id,
    student_name: student?.name || apiRecord.student,
    amount_paid: apiRecord.amount_paid,
    due_date: apiRecord.due_date,
    paid_date: apiRecord.paid_date,
    status: capitalizeStatus(apiRecord.status),
    student: apiRecord.student,
    fee_structure: apiRecord.fee_structure,
    created_at: apiRecord.created_at,
    _raw: apiRecord,
  };
}

export function mapFeeStructure(apiStructure) {
  return {
    id: apiStructure.id,
    name: apiStructure.name,
    amount: apiStructure.amount,
    school: apiStructure.school,
    created_at: apiStructure.created_at,
    _raw: apiStructure,
  };
}

export function paginatedResults(response) {
  if (Array.isArray(response)) return response;
  return response?.results || [];
}

export function buildLookup(items, key = 'id') {
  return Object.fromEntries(items.map((item) => [item[key], item]));
}
