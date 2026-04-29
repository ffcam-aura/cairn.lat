"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";

export function LocationMap({ lat, lon }: { lat: number; lon: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let destroyed = false;

    import("leaflet").then((mod) => {
      if (destroyed || !containerRef.current) return;
      const L = mod.default;

      if (mapRef.current) {
        (mapRef.current as { remove: () => void }).remove();
      }

      const map = L.map(containerRef.current, { zoomControl: true });
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OSM</a>',
        maxZoom: 18,
      }).addTo(map);

      L.circleMarker([lat, lon], {
        radius: 9,
        fillColor: "#A84912",
        color: "#fff",
        weight: 2.5,
        fillOpacity: 1,
      }).addTo(map);

      map.setView([lat, lon], 13);
    });

    return () => {
      destroyed = true;
      if (mapRef.current) {
        (mapRef.current as { remove: () => void }).remove();
        mapRef.current = null;
      }
    };
  }, [lat, lon]);

  return <div ref={containerRef} className="gpx-map" />;
}
