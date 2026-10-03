import { NextResponse } from "next/server";

const API_URL = "https://safebypass.vercel.app/api/bypass";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body?.url) {
      return NextResponse.json(
        {
          ok: false,
          code: "INVALID",
          message: "URL wajib diisi.",
        },
        { status: 400 }
      );
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: String(body.url).trim(),
        apiKey: "",
      }),
      cache: "no-store",
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Bypass proxy error:", error);

    return NextResponse.json(
      {
        ok: false,
        code: "NETWORK",
        message: "Gagal menghubungi API.",
      },
      { status: 500 }
    );
  }
}
