// app/api/auth/categories/[id]/activate/route.ts
import { NextResponse } from "next/server";

const BACKEND_URL =
  "https://f6f8-82-36-98-104.ngrok-free.app/aservice/api/v1/auth/categories";

// ==========================================
// ACTIVATE CATEGORY
// PATCH /api/auth/categories/{id}/activate
// ==========================================

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log("=== Activate Category ===");
    console.log("Category ID:", id);

    const authorization = request.headers.get("authorization");

    if (!authorization) {
      return NextResponse.json(
        {
          message: "Authorization token is required",
        },
        { status: 401 }
      );
    }

    const backendUrl = `${BACKEND_URL}/${id}/activate`;
    console.log("Calling backend:", backendUrl);

    const response = await fetch(backendUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
    });

    console.log("Spring Boot status:", response.status);

    const text = await response.text();
    console.log("Spring Boot response:", text);

    let data: any;

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = {
        message: text || "Category activated successfully",
      };
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          message: data?.message || data?.error || "Failed to activate category",
          ...(typeof data === "object" ? data : {}),
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Activate category API error:", error);

    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}