
import { NextResponse } from "next/server";

const BACKEND_URL =
  "https://f6f8-82-36-98-104.ngrok-free.app/aservice/api/v1/auth/categories";


// ==========================================
// GET ALL CATEGORIES
// GET /api/auth/categories
// ==========================================

export async function GET(request: Request) {
  try {
    console.log("=== Get All Categories ===");

    const authorization =
      request.headers.get("authorization");

    if (!authorization) {
      return NextResponse.json(
        {
          message: "Authorization token is required",
        },
        { status: 401 }
      );
    }

    const backendResponse = await fetch(
      `${BACKEND_URL}/get-category`,
      {
        method: "GET",
        headers: {
          Authorization: authorization,
        },
        cache: "no-store",
      }
    );

    console.log(
      "Spring Boot response status:",
      backendResponse.status
    );

    const rawResponse =
      await backendResponse.text();

    console.log(
      "Spring Boot response:",
      rawResponse
    );

    let data: any;

    try {
      data = rawResponse
        ? JSON.parse(rawResponse)
        : [];
    } catch {
      data = {
        message: rawResponse,
      };
    }

    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          message:
            data?.message ||
            data?.error ||
            "Failed to get categories",
          ...(typeof data === "object"
            ? data
            : {}),
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
      "Get categories API error:",
      error
    );

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Internal server error",
      },
      { status: 500 }
    );
  }
}


// ==========================================
// CREATE CATEGORY
// POST /api/auth/categories
// ==========================================

export async function POST(request: Request) {
  try {
    console.log("=== Create Category ===");

    const authorization =
      request.headers.get("authorization");

    if (!authorization) {
      return NextResponse.json(
        {
          message: "Authorization token is required",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    console.log(
      "Category request body:",
      body
    );

    const backendResponse = await fetch(
      `${BACKEND_URL}/add-category`,
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
      "Spring Boot response status:",
      backendResponse.status
    );

    const rawResponse =
      await backendResponse.text();

    console.log(
      "Spring Boot response:",
      rawResponse
    );

    let data: any;

    try {
      data = rawResponse
        ? JSON.parse(rawResponse)
        : {
            message:
              "Category created successfully",
          };
    } catch {
      data = {
        message: rawResponse,
      };
    }

    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          message:
            data?.message ||
            data?.error ||
            "Failed to create category",
          ...(typeof data === "object"
            ? data
            : {}),
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
      "Create category API error:",
      error
    );

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Internal server error",
      },
      { status: 500 }
    );
  }
}
