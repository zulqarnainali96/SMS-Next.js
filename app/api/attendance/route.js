import { apiGet, apiPost, apiPatch, fetchAllPages } from '@/lib/api-client';
import { jsonError, jsonOk } from '@/lib/api-helpers';
import { ENDPOINTS } from '@/lib/endpoints';
import {
  buildLookup,
  mapAttendance,
  mapAttendanceCreate,
  mapClass,
  mapStudent,
} from '@/lib/mappers';

async function loadAttendance(date) {
  const params = date ? { date } : {};
  const [attendanceRaw, studentsRaw, classesRaw] = await Promise.all([
    fetchAllPages(ENDPOINTS.attendance.list, params),
    fetchAllPages(ENDPOINTS.students.list).catch(() => []),
    fetchAllPages(ENDPOINTS.academics.classes).catch(() => []),
  ]);

  const classLookup = buildLookup(
    classesRaw.map((item) => mapClass(item)),
    'id'
  );
  const studentLookup = buildLookup(
    studentsRaw.map((item) => mapStudent(item)),
    'id'
  );

  return attendanceRaw.map((item) => mapAttendance(item, studentLookup, classLookup));
}

async function resolveClassIdForStudent(studentId, classesRaw) {
  const student = await apiGet(ENDPOINTS.students.detail(studentId)).catch(() => null);
  if (!student) return classesRaw[0]?.id || null;

  const gradeMatch = student.admission_number?.match(/\d+/);
  const gradeLevel = gradeMatch ? Number(gradeMatch[0]) : null;

  if (gradeLevel !== null) {
    const match = classesRaw.find((item) => item.grade_level === gradeLevel);
    if (match) return match.id;
  }

  return classesRaw[0]?.id || null;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    return jsonOk(await loadAttendance(dateParam));
  } catch (error) {
    return jsonError(error, error.status || 500);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { student_id, attendance_date, status } = body;

    if (!student_id || !attendance_date || !status) {
      return jsonError(
        { message: 'Student, date, and status are required.', status: 400 },
        400
      );
    }

    const classesRaw = await fetchAllPages(ENDPOINTS.academics.classes);
    const classId = body.class_obj || (await resolveClassIdForStudent(student_id, classesRaw));

    if (!classId) {
      return jsonError(
        { message: 'No class found to mark attendance against.', status: 400 },
        400
      );
    }

    const existingRecords = await fetchAllPages(ENDPOINTS.attendance.list, {
      date: attendance_date,
    });

    const existing = existingRecords.find(
      (record) => record.student === student_id && record.date === attendance_date
    );

    const payload = mapAttendanceCreate({ ...body, student_id, attendance_date, status }, classId);

    if (existing) {
      await apiPatch(ENDPOINTS.attendance.detail(existing.id), payload);
    } else {
      await apiPost(ENDPOINTS.attendance.list, payload);
    }

    return jsonOk(await loadAttendance(attendance_date));
  } catch (error) {
    return jsonError(error, error.status || 500);
  }
}
