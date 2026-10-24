import { NextResponse } from "next/server";

const BACKEND_URL =
  "https://899a-82-36-98-104.ngrok-free.app/aservice/api/v1/auth/admin/subscription-plans";


// ==========================================
// GET PLAN BY ID
// GET /api/auth/subscription-plans/{id}
// ==========================================

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log("=== Get Subscription Plan ===");
    console.log("Plan ID:", id);

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
      `${BACKEND_URL}/${id}`,
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

    let data: any;

    try {
      data = rawResponse
        ? JSON.parse(rawResponse)
        : {};
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
            "Failed to get subscription plan",
          ...(
            typeof data === "object"
              ? data
              : {}
          ),
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
      "Get subscription plan API error:",
      error
    );

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}


// ==========================================
// UPDATE PLAN
// PUT /api/auth/subscription-plans/{id}
// ==========================================


export async function PUT(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    console.log("=================================");
    console.log("UPDATE SUBSCRIPTION PLAN");
    console.log("Plan ID:", id);
    console.log("=================================");

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

    console.log("Request body:", body);

    const url = `${BACKEND_URL}/${id}`;

    console.log("Calling Spring Boot:", url);

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
      body: JSON.stringify(body),
    });

    console.log(
      "Spring Boot status:",
      response.status
    );

    const text = await response.text();

    console.log(
      "Spring Boot response:",
      text
    );

    let data;

    try {
      data = text
        ? JSON.parse(text)
        : {
            message:
              "Subscription plan updated successfully",
          };
    } catch {
      data = {
        message: text,
      };
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          message:
            data?.message ||
            data?.error ||
            "Failed to update subscription plan",
          ...(
            typeof data === "object"
              ? data
              : {}
          ),
        },
        {
          status: response.status,
        }
      );
    }

    return NextResponse.json(
      data,
      {
        status: response.status,
      }
    );

  } catch (error) {

    console.error(
      "UPDATE SUBSCRIPTION PLAN ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}

// ==========================================
// ACTIVATE PLAN
// PATCH /api/auth/subscription-plans/{id}
// ==========================================

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log("=== Activate Subscription Plan ===");
    console.log("Plan ID:", id);

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

    /*
     * IMPORTANT:
     *
     * Spring Boot expects:
     *
     * PATCH /{id}/activate
     *
     * NOT:
     *
     * PATCH /{id}
     */

    const backendResponse = await fetch(
      `${BACKEND_URL}/${id}/activate`,
      {
        method: "PATCH",

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

    console.log(
      "Backend response:",
      rawResponse
    );

    let data: any;

    try {
      data = rawResponse
        ? JSON.parse(rawResponse)
        : {
            message:
              "Subscription plan activated successfully",
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
            "Failed to activate subscription plan",
          ...(
            typeof data === "object"
              ? data
              : {}
          ),
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
      "Activate subscription plan API error:",
      error
    );

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}


// ==========================================
// DELETE PLAN
// DELETE /api/auth/subscription-plans/{id}
// ==========================================

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log("=== Delete Subscription Plan ===");
    console.log("Plan ID:", id);

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
      `${BACKEND_URL}/${id}`,
      {
        method: "DELETE",

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

    console.log(
      "Backend response:",
      rawResponse
    );

    /*
     * Spring Boot returns 204 No Content.
     */

    if (backendResponse.status === 204) {
      return new NextResponse(null, {
        status: 204,
      });
    }

    let data: any;

    try {
      data = rawResponse
        ? JSON.parse(rawResponse)
        : {
            message:
              "Subscription plan deleted successfully",
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
            "Failed to delete subscription plan",
          ...(
            typeof data === "object"
              ? data
              : {}
          ),
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
      "Delete subscription plan API error:",
      error
    );

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}