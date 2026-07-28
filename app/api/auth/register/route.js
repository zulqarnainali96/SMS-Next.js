import { NextResponse } from "next/server";
import { BASE_URL } from "@/lib/config";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      username,
      email,
      password,
      first_name,
      last_name,
      role,
      school,
      phone,
    } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { ok: false, error: "Username, email, and password are required." },
        { status: 400 },
      );
    }

    const payload = {
      username,
      email,
      password,
      first_name: first_name || "",
      last_name: last_name || "",
      role: role || "student",
      school: school || null,
      phone: phone || "",
    };

    const response = await fetch(`${BASE_URL}/api/auth/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg =
        data.detail ||
        (data.username ? data.username.join(" ") : "") ||
        (data.email ? data.email.join(" ") : "") ||
        "Registration failed.";
      return NextResponse.json(
        { ok: false, error: errorMsg },
        { status: response.status },
      );
    }

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 },
    );
  }
}
