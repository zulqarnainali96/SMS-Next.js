import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    return NextResponse.json({
      ok: true,
      data: db.dashboard(),
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
