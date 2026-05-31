"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ background: "#1A1A2E", color: "#fff", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
          <h1 style={{ fontSize: 24, marginBottom: 12 }}>geck0 — Error</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 24, maxWidth: 400 }}>
            Something went wrong. Please refresh or try again later.
          </p>
          <button
            onClick={reset}
            style={{ background: "#7F77DD", color: "#fff", border: "none", padding: "12px 24px", borderRadius: 12, cursor: "pointer", fontWeight: 600 }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
