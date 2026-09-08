

import { NextResponse } from "next/server";



export async function POST(request: Request) {

  try {

    // Get token from request body

    const body = await request.json();



    const token = body.token;



    if (!token) {

      return NextResponse.json(

        { message: "Authentication token is required" },

        { status: 401 }

      );

    }



    const backendUrl =

      "https://f6f8-82-36-98-104.ngrok-free.app/aservice/api/v1/auth/super-admin/logout";



    console.log("=== Logout API Route ===");

    console.log("Calling backend:", backendUrl);



    const response = await fetch(backendUrl, {

      method: "POST",

      headers: {

        "Authorization": `Bearer ${token}`,

        "Content-Type": "application/json",

      },

    });



    console.log("Backend logout status:", response.status);



    const rawResponse = await response.text();



    console.log("Raw backend response:", rawResponse);



    let data;



    try {

      data = JSON.parse(rawResponse);

    } catch {

      // Backend currently returns a plain string:

      // "Logout successful"

      data = {

        message: rawResponse || "Logout successful",

      };

    }



    if (!response.ok) {

      return NextResponse.json(

        {

          message:

            data.message ||

            data.error ||

            "Logout failed",

        },

        {

          status: response.status,

        }

      );

    }



    return NextResponse.json(data, {

      status: response.status,

    });



  } catch (error) {

    console.error("Logout API error:", error);



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

 