import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    return NextResponse.json({ ok: true, data: db.listClasses() });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, section, room, teacher_id } = body;

    if (!name || !section || !room) {
      return NextResponse.json(
        { ok: false, error: 'Class name, section, and room are required.' },
        { status: 400 }
      );
    }

    const updatedClasses = db.addClass({
      name: name.trim(),
      section: section.trim(),
      room: room.trim(),
      teacher_id: teacher_id ? Number(teacher_id) : null,
    });
    return NextResponse.json({ ok: true, data: updatedClasses });
  } catch (error) {
    if (error.message.includes('class with this name')) {
      return NextResponse.json(
        { ok: false, error: 'A class with this name already exists.' },
        { status: 400 }
      );
    }
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
