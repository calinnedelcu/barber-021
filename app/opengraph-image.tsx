import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "BARBER 021 — Frizerie urbană contemporană în București";
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
          justifyContent: "space-between",
          padding: 80,
          background: "#0A0807",
          color: "#F5EFE6",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 18,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#8A8276",
          }}
        >
          <span>BARBER 021</span>
          <span style={{ color: "#D9764D" }}>SECTOR 3 · BUCUREȘTI</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              fontSize: 18,
              letterSpacing: 6,
              color: "#D9764D",
              textTransform: "uppercase",
            }}
          >
            <span style={{ width: 60, height: 1, background: "#D9764D" }} />
            <span>Frizerie urbană · cu intenție</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 200,
              lineHeight: 0.85,
              fontWeight: 800,
              letterSpacing: -6,
              marginTop: 30,
            }}
          >
            BARBER
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 200,
              lineHeight: 0.85,
              fontWeight: 800,
              letterSpacing: -6,
              color: "#D9764D",
            }}
          >
            021
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 18,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#8A8276",
            borderTop: "1px solid #2A2520",
            paddingTop: 20,
          }}
        >
          <span>N° 021 / 2026</span>
          <span>Calea Călărașilor 27</span>
        </div>
      </div>
    ),
    size,
  );
}
