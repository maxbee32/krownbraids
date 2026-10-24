// app/api/auth/suppliers/reject/route.ts
import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_URL ||
  "https://899a-82-36-98-104.ngrok-free.app/aservice/api/v1/auth";

// PUT reject a supplier
// Frontend calls:  PUT /api/auth/suppliers/reject?id=<businessId>
//   body: { rejectionReason: "..." }
export async function PUT(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("id");

    if (!businessId) {
      return NextResponse.json(
        { message: "Missing supplier id (businessId) in query string" },
        { status: 400 }
      );
    }

    // Parse body (optional — can also be sent empty)
    let body: { rejectionReason?: string } = {};
    try {
      body = await request.json();
    } catch {
      // no body provided — fine
    }

    const response = await fetch(
      `${BACKEND_URL}/admin/${businessId}/reject`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          rejectionReason: body.rejectionReason || "",
        }),
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("❌ PUT /api/auth/suppliers/reject error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}