import { apiGet, apiPost, fetchAllPages } from '@/lib/api-client';
import { jsonError, jsonOk, resolveSchoolId } from '@/lib/api-helpers';
import { ENDPOINTS } from '@/lib/endpoints';
import { mapClass, mapClassCreate, mapTeacher } from '@/lib/mappers';

async function listClasses() {
  const [classesRaw, classSubjectsRaw, teachersRaw] = await Promise.all([
    fetchAllPages(ENDPOINTS.academics.classes),
    fetchAllPages(ENDPOINTS.academics.classSubjects).catch(() => []),
    fetchAllPages(ENDPOINTS.teachers.list).catch(() => []),
  ]);

  const teachers = teachersRaw.map(mapTeacher);
  const teacherLookup = {};

  for (const link of classSubjectsRaw) {
    if (link.class_obj && link.teacher) {
      const teacher = teachers.find((item) => item.id === link.teacher);
      if (teacher) {
        teacherLookup[link.class_obj] = teacher;
      }
    }
  }

  return classesRaw.map((item) => mapClass(item, teacherLookup));
}

export async function GET() {
  try {
    return jsonOk(await listClasses());
  } catch (error) {
    return jsonError(error, error.status || 500);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return jsonError({ message: 'Class name is required.', status: 400 }, 400);
    }

    const schoolId = await resolveSchoolId(apiGet, ENDPOINTS);
    if (!schoolId) {
      return jsonError(
        { message: 'School ID is required. Set DEFAULT_SCHOOL_ID in lib/config.js.', status: 400 },
        400
      );
    }

    await apiPost(ENDPOINTS.academics.classes, mapClassCreate(body, schoolId));
    return jsonOk(await listClasses(), 201);
  } catch (error) {
    return jsonError(error, error.status || 500);
  }
}
