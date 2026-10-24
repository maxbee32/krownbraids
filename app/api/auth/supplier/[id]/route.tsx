// app/api/auth/suppliers/[id]/route.ts
import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_URL ||
  "https://899a-82-36-98-104.ngrok-free.app/aservice/api/v1/auth";

// GET one supplier (by supplier ID, not business ID)
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const response = await fetch(
      `${BACKEND_URL}/admin/suppliers/${id}`,
      {
        headers: {
          Authorization: authHeader,
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("❌ GET /api/auth/suppliers/[id] error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}