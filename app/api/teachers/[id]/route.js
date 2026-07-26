import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const teacher = db.getTeacher(id);

    if (!teacher) {
      return NextResponse.json({ ok: false, error: 'Teacher not found.' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data: teacher });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
