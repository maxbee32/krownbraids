// app/api/auth/add-admin/route.ts
import { NextResponse } from "next/server";

const BACKEND_URL =
  "https://899a-82-36-98-104.ngrok-free.app/aservice/api/v1/auth/super-admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("=== Create Admin API Route ===");
    console.log("Email:", body.email);

    // Validate request
    if (!body.email || !body.fullName) {
      return NextResponse.json(
        {
          message: "Full name and email are required",
        },
        { status: 400 }
      );
    }

    // Get authorization header
    const authorization = request.headers.get("authorization");

    if (!authorization) {
      return NextResponse.json(
        {
          message: "Authorization token is required",
        },
        { status: 401 }
      );
    }

    const backendResponse = await fetch(
      `${BACKEND_URL}/admins`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorization,
        },
        body: JSON.stringify(body),
      }
    );

    console.log(
      "Backend response status:",
      backendResponse.status
    );

    const rawResponse = await backendResponse.text();

    console.log(
      "Raw backend response:",
      rawResponse
    );

    let data;

    try {
      data = JSON.parse(rawResponse);
    } catch {
      data = {
        message: rawResponse,
      };
    }

    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          message:
            data.message ||
            data.error ||
            "Failed to create admin",
          ...data,
        },
        {
          status: backendResponse.status,
        }
      );
    }

    return NextResponse.json(data, {
      status: backendResponse.status,
    });

  } catch (error) {

    console.error(
      "Create admin API error:",
      error
    );

    return NextResponse.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}


export async function GET(request: Request) {

  try {

    console.log("=== Get Admins API Route ===");

    const authorization =
      request.headers.get("authorization");

    if (!authorization) {
      return NextResponse.json(
        {
          message: "Authorization token is required",
        },
        {
          status: 401,
        }
      );
    }

    const backendResponse = await fetch(
      `${BACKEND_URL}/get-admins`,
      {
        method: "GET",
        headers: {
          Authorization: authorization,
        },
      }
    );

    console.log(
      "Backend response status:",
      backendResponse.status
    );

    const rawResponse =
      await backendResponse.text();

    let data;

    try {
      data = JSON.parse(rawResponse);
    } catch {
      data = {
        message: rawResponse,
      };
    }

    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          message:
            data.message ||
            data.error ||
            "Failed to get admins",
          ...data,
        },
        {
          status: backendResponse.status,
        }
      );
    }

    return NextResponse.json(data, {
      status: backendResponse.status,
    });

  } catch (error) {

    console.error(
      "Get admins API error:",
      error
    );

    return NextResponse.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}