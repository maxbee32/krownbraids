// app/api/auth/add-admin/[id]/route.ts

import { NextResponse } from "next/server";

const BACKEND_URL =
  "https://899a-82-36-98-104.ngrok-free.app/aservice/api/v1/auth/super-admin";


// =====================================================
// UPDATE ADMIN STATUS
// PATCH /api/auth/add-admin/{id}?status=ACTIVE
// PATCH /api/auth/add-admin/{id}?status=INACTIVE
// =====================================================

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log("=== Change Admin Status API Route ===");
    console.log("Admin ID:", id);

    if (!id) {
      return NextResponse.json(
        { message: "Admin ID is required" },
        { status: 400 }
      );
    }

    const authorization = request.headers.get("authorization");

    if (!authorization) {
      return NextResponse.json(
        { message: "Authorization token is required" },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const status = url.searchParams.get("status");

    if (!status) {
      return NextResponse.json(
        { message: "Status is required" },
        { status: 400 }
      );
    }

    if (status !== "ACTIVE" && status !== "INACTIVE") {
      return NextResponse.json(
        { message: "Status must be ACTIVE or INACTIVE" },
        { status: 400 }
      );
    }

    const backendUrl =
      `${BACKEND_URL}/${id}/status?status=${status}`;

    const backendResponse = await fetch(
      backendUrl,
      {
        method: "PATCH",
        headers: {
          Authorization: authorization,
        },
      }
    );

    const rawResponse = await backendResponse.text();

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
            "Failed to update admin status",
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
      "Change admin status API error:",
      error
    );

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}


// =====================================================
// DELETE ADMIN
// DELETE /api/auth/add-admin/{id}
// =====================================================

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log("=== Delete Admin API Route ===");
    console.log("Admin ID:", id);

    if (!id) {
      return NextResponse.json(
        { message: "Admin ID is required" },
        { status: 400 }
      );
    }

    const authorization = request.headers.get("authorization");

    if (!authorization) {
      return NextResponse.json(
        { message: "Authorization token is required" },
        { status: 401 }
      );
    }

    const backendUrl =
      `${BACKEND_URL}/admins/${id}`;

    const backendResponse = await fetch(
      backendUrl,
      {
        method: "DELETE",
        headers: {
          Authorization: authorization,
        },
      }
    );

    const rawResponse = await backendResponse.text();

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
            "Failed to delete admin",
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
      "Delete admin API error:",
      error
    );

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}


// =====================================================
// UPDATE ADMIN DETAILS
// PUT /api/auth/add-admin/{id}
// =====================================================

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log("=== Update Admin API Route ===");
    console.log("Admin ID:", id);

    if (!id) {
      return NextResponse.json(
        { message: "Admin ID is required" },
        { status: 400 }
      );
    }

    const authorization =
      request.headers.get("authorization");

    if (!authorization) {
      return NextResponse.json(
        { message: "Authorization token is required" },
        { status: 401 }
      );
    }

    const body = await request.json();

    console.log("Update admin data:", body);

    if (!body.fullName) {
      return NextResponse.json(
        { message: "Full name is required" },
        { status: 400 }
      );
    }

    if (!body.email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    if (!body.phoneNumber) {
      return NextResponse.json(
        { message: "Phone number is required" },
        { status: 400 }
      );
    }

    const backendUrl =
      `${BACKEND_URL}/admins/${id}`;

    console.log(
      "Calling backend:",
      backendUrl
    );

    const backendResponse = await fetch(
      backendUrl,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorization,
        },
        body: JSON.stringify({
          fullName: body.fullName,
          email: body.email,
          phoneNumber: body.phoneNumber,
        }),
      }
    );

    console.log(
      "Backend response status:",
      backendResponse.status
    );

    const rawResponse =
      await backendResponse.text();

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
            "Failed to update admin",
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
      "Update admin API error:",
      error
    );

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}