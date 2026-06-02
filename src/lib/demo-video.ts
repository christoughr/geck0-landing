/** Normalize YouTube, Vimeo, Loom, or self-hosted video URLs for the /demo page. */

export type DemoVideoSource =
  | { kind: "embed"; src: string }
  | { kind: "native"; src: string };

const NATIVE_VIDEO_RE = /\.(mp4|webm|ogg)(\?.*)?$/i;

export const DEFAULT_DEMO_VIDEO_PATH = "/demo/geck0-product-demo.mp4";

/** Normalize YouTube, Vimeo, or Loom URLs to embeddable iframe src. */
export function resolveDemoEmbedUrl(raw?: string): string | null {
  const input = raw?.trim();
  if (!input) return null;

  try {
    const url = new URL(input);

    // YouTube
    if (url.hostname.includes("youtube.com")) {
      const id = url.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (url.hostname === "youtu.be") {
      const id = url.pathname.slice(1);
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (url.hostname.includes("youtube.com") && url.pathname.startsWith("/embed/")) {
      return input;
    }

    // Vimeo
    if (url.hostname.includes("vimeo.com")) {
      const id = url.pathname.split("/").filter(Boolean).pop();
      if (id) return `https://player.vimeo.com/video/${id}`;
    }

    // Loom
    if (url.hostname.includes("loom.com")) {
      const id = url.pathname.split("/").filter(Boolean).pop();
      if (id) return `https://www.loom.com/embed/${id}`;
    }

    // Already an embed URL
    if (input.includes("/embed/")) return input;
  } catch {
    return null;
  }

  return null;
}

function isNativeVideoPath(path: string): boolean {
  return NATIVE_VIDEO_RE.test(path);
}

export function resolveDemoVideoSource(raw?: string): DemoVideoSource | null {
  const input = raw?.trim();

  if (!input) {
    return { kind: "native", src: DEFAULT_DEMO_VIDEO_PATH };
  }

  if (input.startsWith("/") && isNativeVideoPath(input)) {
    return { kind: "native", src: input };
  }

  if (isNativeVideoPath(input)) {
    return { kind: "native", src: input };
  }

  try {
    const url = new URL(input);
    if (isNativeVideoPath(url.pathname)) {
      return { kind: "native", src: input };
    }
  } catch {
    // not an absolute URL — fall through to embed resolver
  }

  const embed = resolveDemoEmbedUrl(input);
  if (embed) return { kind: "embed", src: embed };

  return null;
}

export function getDemoVideoSource(): DemoVideoSource | null {
  return resolveDemoVideoSource(process.env.NEXT_PUBLIC_DEMO_VIDEO_URL);
}

/** @deprecated Use getDemoVideoSource — embed URL only */
export function getDemoVideoEmbedUrl(): string | null {
  const source = getDemoVideoSource();
  return source?.kind === "embed" ? source.src : null;
}
