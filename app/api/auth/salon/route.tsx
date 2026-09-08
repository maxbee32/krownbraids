import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    console.log("=== Get Salons API Route ===");

    // Get the authorization token from the request headers
    const authHeader = request.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix
    console.log("Token provided:", token.substring(0, 20) + "...");

    const backendUrl = "https://f6f8-82-36-98-104.ngrok-free.app/aservice/api/v1/auth/super-admin/salons/all";
    console.log("Calling backend:", backendUrl);

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Backend response status:", response.status);

    // Get raw response
    const rawResponse = await response.text();
    console.log("Raw backend response length:", rawResponse.length);

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
          message: data.message || data.error || "Failed to fetch salons",
          ...data 
        },
        { status: response.status }
      );
    }

    // Return the salon data
    return NextResponse.json(data, {
      status: response.status,
    });

  } catch (error) {
    console.error("Get Salons API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}