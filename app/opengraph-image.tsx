import { ImageResponse } from "next/og";
import { getActiveClient } from "@/lib/clients";

export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const config = getActiveClient();
const brandName = config.brand.shortName ?? config.brand.name;
const titleLines: [string, string] = config.hero?.titleLines ?? [config.brand.name, ""];
const regionLine = [
  config.geo?.region,
  config.geo?.localityCountry?.replace(/ · RO$/, ""),
]
  .filter(Boolean)
  .join(" · ");

export const alt = `${config.brand.name} — ${config.brand.tagline}`;

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
          <span>{brandName}</span>
          <span style={{ color: "#D9764D" }}>{regionLine}</span>
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
            <span>{config.seo?.ogEyebrow ?? config.brand.tagline}</span>
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
            {titleLines[0]}
          </div>
          {titleLines[1] ? (
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
              {titleLines[1]}
            </div>
          ) : null}
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
          <span>{config.brand.serial ?? brandName}</span>
          <span>{config.contact.address}</span>
        </div>
      </div>
    ),
    size,
  );
}
