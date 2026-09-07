import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          background: "#383836",
          color: "#d8b18d",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 120,
            height: 120,
            borderRadius: 24,
            background: "#d8b18d",
            color: "#383836",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 64,
            fontWeight: 700,
            marginBottom: 40,
          }}
        >
          A
        </div>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 700 }}>devwork5600</div>
        <div style={{ display: "flex", fontSize: 32, opacity: 0.85, marginTop: 16 }}>
          Portfolio 3D interactif
        </div>
      </div>
    ),
    { ...size },
  );
}
