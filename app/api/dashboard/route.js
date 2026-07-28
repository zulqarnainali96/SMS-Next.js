import { apiGet, apiPost, fetchAllPages } from '@/lib/api-client';
import { jsonError, jsonOk, resolveSchoolId } from '@/lib/api-helpers';
import { ENDPOINTS } from '@/lib/endpoints';
import {
  buildLookup,
  mapAttendance,
  mapClass,
  mapStudent,
  mapTeacher,
} from '@/lib/mappers';

const today = () => new Date().toISOString().slice(0, 10);

async function loadReferenceData() {
  const [studentsRaw, teachersRaw, classesRaw, attendanceRaw, classSubjectsRaw] =
    await Promise.all([
      fetchAllPages(ENDPOINTS.students.list),
      fetchAllPages(ENDPOINTS.teachers.list),
      fetchAllPages(ENDPOINTS.academics.classes),
      fetchAllPages(ENDPOINTS.attendance.list, { date: today() }),
      fetchAllPages(ENDPOINTS.academics.classSubjects).catch(() => []),
    ]);

  const classes = classesRaw.map((item) => mapClass(item));
  const classLookup = buildLookup(classes);
  const students = studentsRaw.map((item) => mapStudent(item, classLookup));
  const studentLookup = buildLookup(students);
  const teachers = teachersRaw.map(mapTeacher);

  const teacherByClass = {};
  for (const link of classSubjectsRaw) {
    if (link.class_obj && link.teacher) {
      const teacher = teachers.find((item) => item.id === link.teacher);
      if (teacher) teacherByClass[link.class_obj] = teacher.name;
    }
  }

  const classesWithTeachers = classes.map((item) => ({
    ...item,
    teacher_name: teacherByClass[item.id] || item.teacher_name,
  }));

  const attendanceToday = attendanceRaw.map((item) =>
    mapAttendance(item, studentLookup, classLookup)
  );

  const attendance_today = { Present: 0, Absent: 0, Late: 0 };
  for (const record of attendanceToday) {
    if (attendance_today[record.status] !== undefined) {
      attendance_today[record.status] += 1;
    }
  }

  return {
    students,
    teachers,
    classes: classesWithTeachers,
    attendance_today,
  };
}

export async function GET() {
  try {
    const data = await loadReferenceData();

    return jsonOk({
      students: data.students.length,
      teachers: data.teachers.length,
      classes: data.classes.length,
      attendance_today: data.attendance_today,
      recent_students: data.students.slice(0, 5),
      recent_teachers: data.teachers.slice(0, 5),
      recent_classes: data.classes.slice(0, 5),
    });
  } catch (error) {
    return jsonError(error, error.status || 500);
  }
}
