import { fetchAllPages } from '@/lib/api-client';
import { jsonError, jsonOk } from '@/lib/api-helpers';
import { ENDPOINTS } from '@/lib/endpoints';
import { buildLookup, mapFeeRecord, mapFeeStructure, mapStudent } from '@/lib/mappers';

export async function GET() {
  try {
    const [recordsRaw, structuresRaw, studentsRaw] = await Promise.all([
      fetchAllPages(ENDPOINTS.fees.records),
      fetchAllPages(ENDPOINTS.fees.structures),
      fetchAllPages(ENDPOINTS.students.list).catch(() => []),
    ]);

    const studentLookup = buildLookup(studentsRaw.map(mapStudent));

    return jsonOk({
      records: recordsRaw.map((item) => mapFeeRecord(item, studentLookup)),
      structures: structuresRaw.map(mapFeeStructure),
    });
  } catch (error) {
    return jsonError(error, error.status || 500);
  }
}
