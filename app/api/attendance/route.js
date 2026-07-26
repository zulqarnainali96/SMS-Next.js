import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');

    return NextResponse.json({ ok: true, data: db.listAttendance(dateParam) });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { student_id, attendance_date, status, note } = body;

    if (!student_id || !attendance_date || !status) {
      return NextResponse.json(
        { ok: false, error: 'Student, date, and status are required.' },
        { status: 400 }
      );
    }

    const updatedAttendance = db.markAttendance({
      student_id: Number(student_id),
      attendance_date,
      status,
      note: note ? note.trim() : '',
    });
    return NextResponse.json({ ok: true, data: updatedAttendance });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
