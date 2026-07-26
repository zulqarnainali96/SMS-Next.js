import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const className = searchParams.get('class_name');

    return NextResponse.json({ ok: true, data: db.listStudents(className) });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, roll_number, class_name, section, phone, guardian, status } = body;

    if (!name || !roll_number || !class_name || !phone) {
      return NextResponse.json(
        { ok: false, error: 'Name, roll number, class, and phone are required.' },
        { status: 400 }
      );
    }

    const updatedStudents = db.addStudent({
      name: name.trim(),
      roll_number: roll_number.trim(),
      class_name: class_name.trim(),
      section: section ? section.trim() : 'None',
      phone: phone.trim(),
      guardian: guardian ? guardian.trim() : 'Not provided',
      status: status || 'Active',
    });
    return NextResponse.json({ ok: true, data: updatedStudents });
  } catch (error) {
    if (error.message.includes('roll number')) {
      return NextResponse.json(
        { ok: false, error: 'A student with this roll number already exists.' },
        { status: 400 }
      );
    }
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
