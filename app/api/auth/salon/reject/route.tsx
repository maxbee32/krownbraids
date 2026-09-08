import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const body = await request.json();
    const { salonId, rejectionReason } = body;

    if (!salonId) {
      return NextResponse.json(
        { message: "Salon ID is required" },
        { status: 400 }
      );
    }

    if (!rejectionReason || !rejectionReason.trim()) {
      return NextResponse.json(
        { message: "Rejection reason is required" },
        { status: 400 }
      );
    }

    const backendUrl = `https://f6f8-82-36-98-104.ngrok-free.app/aservice/api/v1/auth/super-admin/salons/${salonId}/reject`;

    const response = await fetch(backendUrl, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rejectionReason }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to reject salon" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Reject salon error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}