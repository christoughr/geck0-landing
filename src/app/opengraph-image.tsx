import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "geck0 — When knowledge connects, companies evolve";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1A1A2E 0%, #26215C 50%, #1A1A2E 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#7F77DD",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
          <span style={{ fontSize: 72, fontWeight: 700, color: "#ffffff" }}>geck0</span>
        </div>
        <p
          style={{
            fontSize: 36,
            color: "rgba(255,255,255,0.75)",
            textAlign: "center",
            maxWidth: 900,
            lineHeight: 1.4,
          }}
        >
          When knowledge connects, companies evolve
        </p>
        <p style={{ fontSize: 22, color: "#1D9E75", marginTop: 24 }}>
          B2B AI Knowledge Platform
        </p>
      </div>
    ),
    { ...size }
  );
}
