// app/api/auth/supplier-subscription-plans/[id]/route.ts
import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_URL ||
  "https://899a-82-36-98-104.ngrok-free.app/aservice/api/v1/auth";

// PUT update plan
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const authHeader = request.headers.get("authorization");
    const body = await request.json();

    const response = await fetch(
      `${BACKEND_URL}/admin/supplier-subscription-plans/${params.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader!,
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// DELETE plan
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const authHeader = request.headers.get("authorization");

    const response = await fetch(
      `${BACKEND_URL}/admin/supplier-subscription-plans/${params.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: authHeader!,
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

    if (response.status === 204 || response.ok) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}