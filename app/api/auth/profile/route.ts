// app/api/admin/profile/route.ts
import { NextResponse } from "next/server";

const BACKEND_URL =
  "https://899a-82-36-98-104.ngrok-free.app/aservice/api/v1/auth/super-admin/profile";

// GET - Fetch admin profile
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    console.log("=== Get Profile API Route ===");
    console.log("Calling backend:", BACKEND_URL);

    const response = await fetch(BACKEND_URL, {
      method: "GET",
      headers: {
        Authorization: authHeader,
        Accept: "application/json",
      },
    });

    console.log("Backend profile status:", response.status);

    const rawResponse = await response.text();

    console.log("Raw backend response:", rawResponse);

    let data;

    try {
      data = JSON.parse(rawResponse);
    } catch {
      data = {
        message: rawResponse || "Failed to fetch profile",
      };
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          message:
            data.message ||
            data.error ||
            "Failed to fetch profile",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Get Profile API error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}


// PUT - Update admin profile
export async function PUT(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate request body
    if (!body.fullName && !body.phoneNumber) {
      return NextResponse.json(
        {
          message:
            "At least one field (fullName or phoneNumber) is required",
        },
        { status: 400 }
      );
    }

    console.log("=== Update Profile API Route ===");
    console.log("Calling backend:", BACKEND_URL);
    console.log("Request body:", body);

    const response = await fetch(BACKEND_URL, {
      method: "PUT",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: body.fullName,
        phoneNumber: body.phoneNumber,
      }),
    });

    console.log(
      "Backend update profile status:",
      response.status
    );

    const rawResponse = await response.text();

    console.log(
      "Raw backend response:",
      rawResponse
    );

    let data;

    try {
      data = JSON.parse(rawResponse);
    } catch {
      data = {
        message:
          rawResponse ||
          "Profile updated successfully",
        success: response.ok,
      };
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          message:
            data.message ||
            data.error ||
            "Failed to update profile",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error(
      "Update Profile API error:",
      error
    );

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}