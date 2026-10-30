import { NextResponse } from "next/server";

const API_BASE = "https://xiyu-safelinku-api.vercel.app";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const inputUrl = String(body?.url || "").trim();

    if (!inputUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "URL wajib diisi.",
        },
        {
          status: 400,
        }
      );
    }

    const apiUrl = new URL("/bypass", API_BASE);

    apiUrl.searchParams.set("url", inputUrl);

    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    const text = await response.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "API mengembalikan response yang tidak valid.",
        },
        {
          status: 502,
        }
      );
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("XIYU SAFELINKU API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Gagal menghubungi XIYU API. Silakan coba lagi.",
      },
      {
        status: 502,
      }
    );
  }
}
