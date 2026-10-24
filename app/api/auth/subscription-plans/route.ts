// api/auth/subscription-plans/route.ts

import { NextResponse } from "next/server";

const BACKEND_URL =
  "https://899a-82-36-98-104.ngrok-free.app/aservice/api/v1/auth/admin/subscription-plans";


// ==========================================
// CREATE SUBSCRIPTION PLAN
// ==========================================

export async function POST(request: Request) {
  try {

    console.log("=== Create Subscription Plan API Route ===");

    const body = await request.json();

    console.log("Request body:", body);

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
      BACKEND_URL,
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
            "Failed to create subscription plan",

          ...data,
        },
        {
          status: backendResponse.status,
        }
      );
    }

    return NextResponse.json(
      data,
      {
        status: backendResponse.status,
      }
    );

  } catch (error) {

    console.error(
      "Create subscription plan API error:",
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


// ==========================================
// GET ALL SUBSCRIPTION PLANS
// ==========================================

export async function GET(request: Request) {
  try {

    console.log(
      "=== Get All Subscription Plans API Route ==="
    );

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
      BACKEND_URL,
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
            "Failed to get subscription plans",

          ...data,
        },
        {
          status: backendResponse.status,
        }
      );
    }

    return NextResponse.json(
      data,
      {
        status: backendResponse.status,
      }
    );

  } catch (error) {

    console.error(
      "Get subscription plans API error:",
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