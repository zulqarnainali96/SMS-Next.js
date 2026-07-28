import { apiGet, apiPost, fetchAllPages } from '@/lib/api-client';
import { jsonError, jsonOk, resolveSchoolId } from '@/lib/api-helpers';
import { ENDPOINTS } from '@/lib/endpoints';
import { buildLookup, mapStudent, mapStudentCreate } from '@/lib/mappers';

async function listStudents(searchParams) {
  const params = {};
  if (searchParams.get('search')) params.search = searchParams.get('search');
  if (searchParams.get('class_name')) params.search = searchParams.get('class_name');

  const rawStudents = await fetchAllPages(ENDPOINTS.students.list, params);
  const classesRaw = await fetchAllPages(ENDPOINTS.academics.classes).catch(() => []);
  const classLookup = buildLookup(
    classesRaw.map((item) => ({
      id: item.id,
      name: item.name,
      section: `Grade ${item.grade_level}`,
    }))
  );

  return rawStudents.map((item) => mapStudent(item, classLookup));
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const students = await listStudents(searchParams);
    return jsonOk(students);
  } catch (error) {
    return jsonError(error, error.status || 500);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, roll_number, class_name, phone, guardian } = body;

    if (!name || !roll_number || !phone) {
      return jsonError(
        { message: 'Name, roll number, and phone are required.', status: 400 },
        400
      );
    }

    const schoolId = await resolveSchoolId(apiGet, ENDPOINTS);
    if (!schoolId) {
      return jsonError(
        { message: 'School ID is required. Set DEFAULT_SCHOOL_ID in lib/config.js.', status: 400 },
        400
      );
    }

    await apiPost(ENDPOINTS.students.list, mapStudentCreate(body, schoolId));
    const students = await listStudents(new URLSearchParams());
    return jsonOk(students, 201);
  } catch (error) {
    return jsonError(error, error.status || 500);
  }
}
