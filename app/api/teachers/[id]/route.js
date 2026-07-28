import { apiGet } from '@/lib/api-client';
import { jsonError, jsonOk } from '@/lib/api-helpers';
import { ENDPOINTS } from '@/lib/endpoints';
import { mapTeacher } from '@/lib/mappers';

export async function GET(_request, { params }) {
  try {
    const teacher = await apiGet(ENDPOINTS.teachers.detail(params.id));
    return jsonOk(mapTeacher(teacher));
  } catch (error) {
    return jsonError(error, error.status || 500);
  }
}
