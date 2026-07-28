import { fetchAllPages } from '@/lib/api-client';
import { jsonError, jsonOk } from '@/lib/api-helpers';
import { ENDPOINTS } from '@/lib/endpoints';
import { buildLookup, mapExam, mapClass } from '@/lib/mappers';

export async function GET() {
  try {
    const [examsRaw, subjectsRaw, classesRaw] = await Promise.all([
      fetchAllPages(ENDPOINTS.exams.list),
      fetchAllPages(ENDPOINTS.academics.subjects).catch(() => []),
      fetchAllPages(ENDPOINTS.academics.classes).catch(() => []),
    ]);

    const subjectLookup = buildLookup(subjectsRaw);
    const classLookup = buildLookup(classesRaw.map((item) => mapClass(item)));

    const exams = examsRaw.map((item) => mapExam(item, subjectLookup, classLookup));
    return jsonOk(exams);
  } catch (error) {
    return jsonError(error, error.status || 500);
  }
}
