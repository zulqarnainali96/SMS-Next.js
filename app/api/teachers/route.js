import { apiGet, apiPost, fetchAllPages } from '@/lib/api-client';
import { jsonError, jsonOk, resolveSchoolId } from '@/lib/api-helpers';
import { ENDPOINTS } from '@/lib/endpoints';
import { mapTeacher, mapTeacherCreate } from '@/lib/mappers';

async function listTeachers() {
  const rawTeachers = await fetchAllPages(ENDPOINTS.teachers.list);
  return rawTeachers.map(mapTeacher);
}

export async function GET() {
  try {
    return jsonOk(await listTeachers());
  } catch (error) {
    return jsonError(error, error.status || 500);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { employee_id, name, subject, phone, email, joined_date } = body;

    if (!employee_id || !name || !subject || !phone || !email || !joined_date) {
      return jsonError(
        {
          message:
            'Employee ID, name, subject, phone, email, and joined date are required.',
          status: 400,
        },
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

    await apiPost(ENDPOINTS.teachers.list, mapTeacherCreate(body, schoolId));
    return jsonOk(await listTeachers(), 201);
  } catch (error) {
    return jsonError(error, error.status || 500);
  }
}
