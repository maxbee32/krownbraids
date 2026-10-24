// app/api/auth/supplier-subscription-plans/[id]/toggle-active/route.ts
import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_URL ||
  "https://899a-82-36-98-104.ngrok-free.app/aservice/api/v1/auth";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const authHeader = request.headers.get("authorization");

    const response = await fetch(
      `${BACKEND_URL}/admin/supplier-subscription-plans/${params.id}/toggle-active`,
      {
        method: "PATCH",
        headers: {
          Authorization: authHeader!,
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}