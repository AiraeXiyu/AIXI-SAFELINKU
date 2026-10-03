import { NextResponse } from "next/server";

const API_URL =
  "https://api.ikyyxd.my.id/tools/skiplink/sfl";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const inputUrl = String(
      body?.url || ""
    ).trim();

    if (!inputUrl) {
      return NextResponse.json(
        {
          status: false,
          error: "URL wajib diisi.",
        },
        {
          status: 400,
        }
      );
    }

    const apiUrl = new URL(API_URL);

    apiUrl.searchParams.set(
      "url",
      inputUrl
    );

    const response = await fetch(
      apiUrl.toString(),
      {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      }
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.ok
        ? 200
        : response.status,
    });
  } catch (error) {
    console.error(
      "AIXI SAFELINKU API ERROR:",
      error
    );

    return NextResponse.json(
      {
        status: false,
        error:
          "Gagal menghubungi server. Silakan coba lagi.",
      },
      {
        status: 502,
      }
    );
  }
}
