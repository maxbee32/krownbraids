// app/api/auth/categories/[id]/route.ts
import { NextResponse } from "next/server";

const BACKEND_URL =
  "https://178e-82-36-98-104.ngrok-free.app/aservice/api/v1/auth/categories";

// ==========================================
// GET CATEGORY BY ID
// GET /api/auth/categories/{id}
// ==========================================

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log("=== Get Category ===");
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

    const response = await fetch(`${BACKEND_URL}/${id}`, {
      method: "GET",
      headers: {
        Authorization: authorization,
      },
      cache: "no-store",
    });

    const text = await response.text();

    let data: any;

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = {
        message: text,
      };
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          message: data?.message || data?.error || "Failed to get category",
          ...(typeof data === "object" ? data : {}),
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Get category API error:", error);

    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

// ==========================================
// UPDATE CATEGORY
// PUT /api/auth/categories/{id}
// ==========================================

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log("=== Update Category ===");
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

    const body = await request.json();

    console.log("Update body:", body);

    const response = await fetch(`${BACKEND_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
      body: JSON.stringify(body),
    });

    console.log("Spring Boot status:", response.status);

    const text = await response.text();

    console.log("Spring Boot response:", text);

    let data: any;

    try {
      data = text
        ? JSON.parse(text)
        : {
            message: "Category updated successfully",
          };
    } catch {
      data = {
        message: text,
      };
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          message: data?.message || data?.error || "Failed to update category",
          ...(typeof data === "object" ? data : {}),
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Update category API error:", error);

    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

// ==========================================
// DELETE CATEGORY
// DELETE /api/auth/categories/{id}
// ==========================================

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log("=== Delete Category ===");
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

    const response = await fetch(`${BACKEND_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: authorization,
      },
    });

    console.log("Spring Boot status:", response.status);

    const text = await response.text();

    if (response.status === 204) {
      return new NextResponse(null, {
        status: 204,
      });
    }

    let data: any;

    try {
      data = text
        ? JSON.parse(text)
        : {
            message: "Category deleted successfully",
          };
    } catch {
      data = {
        message: text,
      };
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          message: data?.message || data?.error || "Failed to delete category",
          ...(typeof data === "object" ? data : {}),
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Delete category API error:", error);

    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}