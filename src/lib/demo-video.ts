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

export function getDemoVideoEmbedUrl(): string | null {
  return resolveDemoEmbedUrl(process.env.NEXT_PUBLIC_DEMO_VIDEO_URL);
}
