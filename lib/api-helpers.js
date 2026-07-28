import { NextResponse } from 'next/server';
import { ApiError } from '@/lib/api-client';

export function jsonOk(data, status = 200) {
  return NextResponse.json({ ok: true, data }, { status });
}

export function jsonError(error, status = 500) {
  const message = error instanceof ApiError ? error.message : error.message || 'Unexpected error';
  const code = error instanceof ApiError ? error.status : status;
  return NextResponse.json({ ok: false, error: message }, { status: code });
}

export async function resolveSchoolId(apiGet, endpoints) {
  const { DEFAULT_SCHOOL_ID } = await import('@/lib/config');

  if (DEFAULT_SCHOOL_ID) return DEFAULT_SCHOOL_ID;

  try {
    const profile = await apiGet(endpoints.auth.profile);
    if (profile?.school) return profile.school;
  } catch {
    // fall through to schools list
  }

  const schools = await apiGet(endpoints.schools.list, { page_size: 1 });
  const firstSchool = schools?.results?.[0] || schools?.[0];
  return firstSchool?.id || '';
}
