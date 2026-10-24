// app/api/auth/change-password/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Get the Authorization header from the incoming request
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Validate request body - backend expects oldPassword and newPassword
    if (!body.oldPassword || !body.newPassword) {
      return NextResponse.json(
        { message: "Old password and new password are required" },
        { status: 400 }
      );
    }

    console.log("Sending change password request to backend...");

    const response = await fetch(
      "https://899a-82-36-98-104.ngrok-free.app/aservice/api/v1/auth/super-admin/change-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: body.oldPassword,
          newPassword: body.newPassword,
        }),
      }
    );

    // Get the response as text (backend returns plain text)
    const rawResponse = await response.text();
    console.log("Backend response status:", response.status);
    console.log("Backend response:", rawResponse);

    // Check if the response is successful
    if (response.ok) {
      // Backend returns plain text success message
      return NextResponse.json(
        { 
          success: true,
          message: rawResponse || "Password updated successfully" 
        },
        { status: 200 }
      );
    } else {
      // If error, try to parse as JSON, or use the raw text
      let errorMessage = rawResponse;
      try {
        const jsonError = JSON.parse(rawResponse);
        errorMessage = jsonError.message || jsonError.error || rawResponse;
      } catch (e) {
        // If not JSON, use the raw text
        errorMessage = rawResponse || "Failed to change password";
      }
      
      return NextResponse.json(
        { message: errorMessage },
        { status: response.status }
      );
    }

  } catch (error) {
    console.error("Change password API error:", error);
    
    return NextResponse.json(
      { message: "Unable to connect to authentication service" },
      { status: 500 }
    );
  }
}