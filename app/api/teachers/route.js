import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    return NextResponse.json({ ok: true, data: db.listTeachers() });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      employee_id,
      name,
      subject,
      phone,
      email,
      address,
      qualification,
      experience_years,
      emergency_contact,
      joined_date,
      status,
    } = body;

    if (!employee_id || !name || !subject || !phone || !email || !address || !joined_date) {
      return NextResponse.json(
        { ok: false, error: 'Employee ID, name, subject, phone, email, address, and joined date are required.' },
        { status: 400 }
      );
    }

    const updatedTeachers = db.addTeacher({
      employee_id: employee_id.trim(),
      name: name.trim(),
      subject: subject.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      qualification: qualification ? qualification.trim() : '',
      experience_years: Number(experience_years) || 0,
      emergency_contact: emergency_contact ? emergency_contact.trim() : '',
      joined_date,
      status: status || 'Active',
    });
    return NextResponse.json({ ok: true, data: updatedTeachers });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
