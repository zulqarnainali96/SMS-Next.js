import { apiGet } from '@/lib/api-client';
import { ENDPOINTS } from '@/lib/endpoints';
import { jsonError, jsonOk } from '@/lib/api-helpers';

export async function GET() {
  try {
    const profile = await apiGet(ENDPOINTS.auth.profile);
    return jsonOk(profile);
  } catch (error) {
    return jsonError(error, error.status || 401);
  }
}
