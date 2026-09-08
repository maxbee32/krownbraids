import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ AWAIT the params (Next.js 15+ requirement)
    const params = await context.params;
    const id = params.id;
    
    console.log("=== GET Salon by ID API Route ===");
    console.log("Salon ID received:", id);

    if (!id) {
      console.error("No ID provided");
      return NextResponse.json(
        { message: "Salon ID is required" },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No authorization header found");
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    console.log("Token provided:", token.substring(0, 20) + "...");

    const backendUrl = `https://f6f8-82-36-98-104.ngrok-free.app/aservice/api/v1/auth/super-admin/salons/${id}`;
    console.log("Calling backend:", backendUrl);

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Backend response status:", response.status);

    const rawResponse = await response.text();
    console.log("Raw response length:", rawResponse.length);

    let data;
    try {
      data = JSON.parse(rawResponse);
    } catch (e) {
      console.error("Failed to parse JSON:", e);
      return NextResponse.json(
        { message: "Invalid response from backend" },
        { status: 500 }
      );
    }

    if (!response.ok) {
      console.error("Backend error:", data);
      return NextResponse.json(
        { message: data.message || "Failed to fetch salon" },
        { status: response.status }
      );
    }

    console.log("Salon fetched successfully");
    return NextResponse.json(data);
  } catch (error) {
    console.error("Get salon error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}