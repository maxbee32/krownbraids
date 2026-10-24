// app/api/auth/login/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("=== Login API Route ===");
    console.log("Email:", body.email);
    console.log("Password provided:", !!body.password);

    // Validate request body
    if (!body.email || !body.password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const backendUrl = "https://899a-82-36-98-104.ngrok-free.app/aservice/api/v1/auth/super-admin/login";
    console.log("Calling backend:", backendUrl);

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
      }),
    });

    console.log("Backend response status:", response.status);

    // Get raw response
    const rawResponse = await response.text();
    console.log("Raw backend response:", rawResponse);

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
      return NextResponse.json(
        { 
          message: data.message || data.error || "Authentication failed",
          ...data 
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, {
      status: response.status,
    });

  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}