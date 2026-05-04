"use client";

import { ChangeEvent, useCallback, useMemo, useRef, useState } from "react";
import { painterPresets, painterPresetMap, type PainterId } from "../lib/painters";

type PainterCache = Partial<Record<PainterId, string>>;

interface UploadData {
  base64: string;
  mimeType: string;
}

export default function HomePage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadData, setUploadData] = useState<UploadData | null>(null);
  const [imageName, setImageName] = useState<string>("");
  const [activePainter, setActivePainter] = useState<PainterId | null>(null);
  const [cache, setCache] = useState<PainterCache>({});
  const [isRendering, setIsRendering] = useState(false);
  const [statusMessage, setStatusMessage] = useState("No image uploaded yet.");
  const [loadingMessage, setLoadingMessage] = useState("Rendering style…");

  const activePreset = useMemo(
    () => (activePainter ? painterPresetMap[activePainter] ?? null : null),
    [activePainter]
  );

  const currentRender = activePainter ? cache[activePainter] ?? null : null;
  const displayedImage = currentRender ?? (uploadData ? `data:${uploadData.mimeType};base64,${uploadData.base64}` : null);
  const placeholderMessage = !uploadData
    ? "Upload an image to begin your gallery."
    : !activePainter
    ? "Pick a painter to see the transformation."
    : "";

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setStatusMessage("Please upload a valid image file.");
      return;
    }

    setStatusMessage("Loading image…");
    try {
      const dataUrl = await readFileAsDataURL(file);
      const parsed = parseDataUrl(dataUrl);
      if (!parsed) {
        throw new Error("We couldn't read that image. Try another file.");
      }

      setUploadData({
        base64: parsed.base64,
        mimeType: parsed.mimeType
      });
      setImageName(file.name.replace(/\.[^.]+$/, ""));
      setCache({});
      setActivePainter(null);
      setStatusMessage("Image ready. Pick a painter to render.");
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : "Unable to load that image."
      );
    } finally {
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  const handleReset = () => {
    setUploadData(null);
    setImageName("");
    setCache({});
    setActivePainter(null);
    setIsRendering(false);
    setStatusMessage("Upload a new image to begin again.");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePainterSelect = useCallback(
    async (presetId: PainterId) => {
      if (!uploadData) {
        setStatusMessage("Upload an image before choosing a painter.");
        return;
      }

      const preset = painterPresetMap[presetId];
      if (!preset) {
        setStatusMessage("That painter isn't available right now.");
        return;
      }

      setActivePainter(presetId);

      if (cache[presetId]) {
        setStatusMessage(`Showing cached ${preset.label} rendering.`);
        return;
      }

      try {
        setIsRendering(true);
        setLoadingMessage(preset.loadingMessage);
        const rendering = await requestNanoBananaImage({
          painterId: presetId,
          base64: uploadData.base64,
          mimeType: uploadData.mimeType
        });
        setCache((previous) => ({ ...previous, [presetId]: rendering }));
        setStatusMessage(preset.successMessage);
      } catch (error) {
        setStatusMessage(
          error instanceof Error
            ? error.message
            : `Something went wrong while painting with ${preset.label}.`
        );
      } finally {
        setIsRendering(false);
      }
    },
    [cache, uploadData]
  );

  const handleDownload = async () => {
    if (!activePainter || !currentRender) {
      return;
    }
    
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    
    if (isIOS) {
      // For iOS, create a canvas and convert to blob for better Photos compatibility
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) {
              const blobUrl = URL.createObjectURL(blob);
              // Open image in new window - iOS will recognize it as an image
              // Users can long-press to save to Photos
              const newWindow = window.open(blobUrl, '_blank');
              if (newWindow) {
                setTimeout(() => {
                  URL.revokeObjectURL(blobUrl);
                }, 1000);
              }
            }
          }, 'image/png');
        }
      };
      img.src = currentRender;
    } else {
      // For desktop browsers, decode base64 directly (avoids fetch() on data URLs which fails in some browsers)
      const base64 = currentRender.split(",")[1];
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: "image/png" });
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      const preset = painterPresetMap[activePainter];
      const filenameLabel = preset?.label.replace(/\s+/g, "-").toLowerCase() ?? "painting";
      link.href = blobUrl;
      link.download = `${imageName || "painting"}-${filenameLabel}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 100);
    }
  };

  return (
    <main>
      <header className="app-header">
        <h1>Painter Style Studio</h1>
        <p>
          Upload a photo and see it reimagined through iconic painters&apos; eyes — powered by Gemini 2.5 Flash Image. Build v2, May 2026.
        </p>
      </header>

      <section className="controls">
        <label className="file-input">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <span>{uploadData ? "Upload a different image" : "Upload an image"}</span>
        </label>
        <button
          type="button"
          className="secondary"
          onClick={handleReset}
          disabled={!uploadData}
        >
          Start over
        </button>
      </section>

      <section className="workspace">
        <aside className="painter-panel">
          <div className="panel-header">
            <h2>Pick a painter</h2>
            <p>Rendered styles stay cached until you upload a new image.</p>
          </div>
          <div className="painter-list">
            {painterPresets.map((preset) => {
              const isActive = preset.id === activePainter;
              const hasCached = Boolean(cache[preset.id]);
              return (
                <button
                  key={preset.id}
                  type="button"
                  className="painter-button"
                  data-active={isActive}
                  data-has-image={hasCached}
                  onClick={() => handlePainterSelect(preset.id)}
                  disabled={!uploadData || isRendering}
                  title={preset.description}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </aside>

        <article className="preview-panel">
          <div className="preview-frame">
            <img
              src={displayedImage ?? undefined}
              alt={activePreset ? `${activePreset.label} rendering` : uploadData ? "Uploaded image" : "Rendered artwork preview"}
              data-visible={Boolean(displayedImage)}
            />
            {!uploadData && (
              <div className="preview-placeholder">
                <p>Upload an image to begin your gallery.</p>
              </div>
            )}
            <div className="preview-loading" data-active={isRendering}>
              <div>
                <span className="spinner" aria-hidden="true" />
                <span>{loadingMessage}</span>
              </div>
            </div>
          </div>
          <p className="status-message">{statusMessage}</p>
          <button
            type="button"
            className="primary"
            onClick={handleDownload}
            disabled={!currentRender}
          >
            Download current style
          </button>
        </article>
      </section>
    </main>
  );
}

async function requestNanoBananaImage(params: {
  painterId: PainterId;
  base64: string;
  mimeType: string;
}): Promise<string> {
  const response = await fetch("/api/render", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      painterId: params.painterId,
      imageBase64: params.base64,
      mimeType: params.mimeType
    })
  });

  let data: unknown = null;
  try {
    data = await response.json();
  } catch (error) {
    if (response.ok) {
      throw new Error("The renderer did not return a valid response.");
    }
  }

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null && "error" in data
        ? String((data as { error: string }).error)
        : `Nano Banana request failed with status ${response.status}.`;
    throw new Error(message);
  }

  if (
    typeof data !== "object" ||
    data === null ||
    !("image" in data) ||
    typeof (data as { image: unknown }).image !== "string"
  ) {
    throw new Error("Nano Banana did not return any image data.");
  }

  return (data as { image: string }).image;
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Unable to read the selected file."));
      }
    };
    reader.onerror = () => reject(new Error("Could not read the selected file."));
    reader.readAsDataURL(file);
  });
}

function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(.+);base64,(.*)$/);
  if (!match) {
    return null;
  }
  const [, mimeType, base64] = match;
  return {
    mimeType,
    base64
  };
}
