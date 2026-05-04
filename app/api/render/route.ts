import { NextRequest, NextResponse } from "next/server";
import { painterPresetMap, type PainterId } from "../../../lib/painters";

const MODEL = "gemini-2.5-flash-image-preview";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as
      | {
          painterId?: PainterId;
          imageBase64?: string;
          mimeType?: string;
        }
      | null;

    if (!body || !body.painterId || !body.imageBase64) {
      return NextResponse.json(
        { error: "Missing painter id or image data." },
        { status: 400 }
      );
    }

    const preset = painterPresetMap[body.painterId];
    if (!preset) {
      return NextResponse.json({ error: "Unknown painter selected." }, { status: 400 });
    }

    const apiKey =
      process.env.GOOGLE_API_KEY ??
      process.env.NANO_BANANA_API_KEY ??
      process.env.NANOBANANA_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Nano Banana credentials are not configured. Set GOOGLE_API_KEY on the server."
        },
        { status: 500 }
      );
    }

    const mimeType = body.mimeType?.startsWith("image/") ? body.mimeType : "image/png";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;

    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            { text: preset.prompt },
            {
              inlineData: {
                mimeType,
                data: body.imageBase64
              }
            }
          ]
        }
      ],
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"]
      }
    };

    const result = await fetchWithBackoff(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const base64Data =
      result?.candidates?.[0]?.content?.parts?.find(
        (part: { inlineData?: { data?: string } }) => Boolean(part.inlineData?.data)
      )?.inlineData?.data ?? null;

    if (!base64Data) {
      const errorText =
        result?.candidates?.[0]?.content?.parts?.[0]?.text ??
        result?.error?.message ??
        "No image data returned. The model may have declined this image.";
      return NextResponse.json({ error: errorText }, { status: 502 });
    }

    return NextResponse.json({
      image: `data:image/png;base64,${base64Data}`
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error occurred.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function fetchWithBackoff(
  url: string,
  options: RequestInit,
  retries = 3,
  delay = 1000
): Promise<any> {
  for (let attempt = 0; attempt < retries; attempt += 1) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `API request failed with status ${response.status}: ${
            errorData?.error?.message ?? response.statusText
          }`
        );
      }
      return response.json();
    } catch (error) {
      if (attempt === retries - 1) throw error;
      await wait(delay);
      delay *= 2;
    }
  }
  throw new Error("API call failed after all retries.");
}

function wait(duration: number) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}
