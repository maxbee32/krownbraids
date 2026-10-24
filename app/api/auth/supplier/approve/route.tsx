// app/api/auth/suppliers/approve/route.ts
import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_URL ||
  "https://899a-82-36-98-104.ngrok-free.app/aservice/api/v1/auth";

// PUT approve a supplier
// Frontend calls:  PUT /api/auth/suppliers/approve?id=<businessId>
export async function PUT(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Read businessId from query string
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("id");

    if (!businessId) {
      return NextResponse.json(
        { message: "Missing supplier id (businessId) in query string" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${BACKEND_URL}/admin/${businessId}/approve`,
      {
        method: "PUT",
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
    console.error("❌ PUT /api/auth/suppliers/approve error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}