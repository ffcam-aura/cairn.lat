import { ImageResponse } from "next/og";

export const alt = "Cairn — Débriefer nos sorties en montagne";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#F4EFE4",
          display: "flex",
          flexDirection: "column",
          padding: "80px",
          justifyContent: "space-between",
          color: "#23272B",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "36px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "24px",
                border: "3px solid #A84912",
                borderRadius: "50%",
              }}
            />
            <div
              style={{
                width: "72px",
                height: "28px",
                border: "3px solid #2E4A3A",
                borderRadius: "50%",
              }}
            />
            <div
              style={{
                width: "108px",
                height: "34px",
                border: "3px solid #2E4A3A",
                borderRadius: "50%",
              }}
            />
            <div
              style={{
                width: "148px",
                height: "3px",
                background: "#2E4A3A",
                marginTop: "4px",
              }}
            />
          </div>
          <div
            style={{
              fontSize: "128px",
              fontWeight: 600,
              color: "#23272B",
              letterSpacing: "-0.03em",
              display: "flex",
            }}
          >
            Cairn
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div
            style={{
              fontSize: "56px",
              fontWeight: 500,
              color: "#2E4A3A",
              letterSpacing: "-0.02em",
              lineHeight: 1.08,
              maxWidth: "1000px",
              display: "flex",
            }}
          >
            Débriefer nos sorties en montagne, pour progresser ensemble.
          </div>
          <div
            style={{
              fontSize: "28px",
              color: "#4A4E53",
              maxWidth: "1000px",
              display: "flex",
            }}
          >
            Une application simple, collective et open source, pour capitaliser
            sur chaque sortie.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontSize: "18px",
            color: "#7A7468",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          <span>cairn.lat</span>
          <span>45°55′N · 006°52′E</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
