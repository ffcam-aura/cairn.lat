"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";

function parseGpxPoints(gpx: string): [number, number][] {
  const out: [number, number][] = [];
  for (const trkpt of gpx.matchAll(/<trkpt\b([^>]*)>/g)) {
    const attrs = trkpt[1];
    const latM = /\blat="([^"]+)"/.exec(attrs);
    const lonM = /\blon="([^"]+)"/.exec(attrs);
    if (latM && lonM) {
      const lat = parseFloat(latM[1]);
      const lon = parseFloat(lonM[1]);
      if (!isNaN(lat) && !isNaN(lon)) out.push([lat, lon]);
    }
  }
  return out;
}

export function GpxMap({ gpxData }: { gpxData: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const points = parseGpxPoints(gpxData);
    if (points.length === 0) return;

    let destroyed = false;

    import("leaflet").then((mod) => {
      if (destroyed || !containerRef.current) return;
      const L = mod.default;

      // Éviter la réinstanciation si le composant re-render
      if (mapRef.current) {
        (mapRef.current as { remove: () => void }).remove();
      }

      const map = L.map(containerRef.current, { zoomControl: true });
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OSM</a>',
        maxZoom: 18,
      }).addTo(map);

      const poly = L.polyline(points, {
        color: "#2E4A3A",
        weight: 3.5,
        opacity: 0.85,
      }).addTo(map);

      L.circleMarker(points[0], {
        radius: 7,
        fillColor: "#2E4A3A",
        color: "#fff",
        weight: 2,
        fillOpacity: 1,
      }).bindTooltip("Départ").addTo(map);

      L.circleMarker(points[points.length - 1], {
        radius: 7,
        fillColor: "#A84912",
        color: "#fff",
        weight: 2,
        fillOpacity: 1,
      }).bindTooltip("Arrivée").addTo(map);

      map.fitBounds(poly.getBounds(), { padding: [24, 24] });
    });

    return () => {
      destroyed = true;
      if (mapRef.current) {
        (mapRef.current as { remove: () => void }).remove();
        mapRef.current = null;
      }
    };
  }, [gpxData]);

  return <div ref={containerRef} className="gpx-map" />;
}
