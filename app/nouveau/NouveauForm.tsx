"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { createDebrief } from "@/app/actions";
import { LocationMap } from "@/app/components/LocationMap";

function extractLatLon(url: string): [number, number] | null {
  const at = url.match(/@(-?\d+\.?\d+),(-?\d+\.?\d+)/);
  if (at) return [parseFloat(at[1]), parseFloat(at[2])];
  const q = url.match(/[?&](?:q|ll)=(-?\d+\.?\d+),(-?\d+\.?\d+)/);
  if (q) return [parseFloat(q[1]), parseFloat(q[2])];
  return null;
}

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary">
      {pending ? "Création en cours…" : "Démarrer le débrief →"}
    </button>
  );
}

export function NouveauForm() {
  const [locationValue, setLocationValue] = useState("");
  const [gpxFileName, setGpxFileName] = useState<string | null>(null);
  const [showLocationMap, setShowLocationMap] = useState(false);

  const locationCoords = locationValue ? extractLatLon(locationValue) : null;

  return (
    <form action={createDebrief} className="nouveau-form">
      <div className="field-group">
        <label htmlFor="outingName" className="field-label field-label--required">
          Nom de la sortie
        </label>
        <input
          type="text"
          id="outingName"
          name="outingName"
          required
          className="field-input"
          placeholder="Mont-Blanc par les Grands Mulets"
          autoFocus
        />
      </div>

      <div className="nouveau-row">
        <div className="field-group">
          <label htmlFor="massif" className="field-label">Massif</label>
          <input
            type="text"
            id="massif"
            name="massif"
            className="field-input"
            placeholder="Mont-Blanc, Écrins…"
          />
        </div>
        <div className="field-group">
          <label htmlFor="outingDate" className="field-label">Date</label>
          <input type="date" id="outingDate" name="outingDate" className="field-input" />
        </div>
      </div>

      <div className="field-group">
        <label htmlFor="participants" className="field-label">Participants</label>
        <input
          type="text"
          id="participants"
          name="participants"
          className="field-input"
          placeholder="Jean, Marie, Paulo"
        />
        <p className="field-hint">Prénom ou pseudo — vous pourrez compléter ensuite.</p>
      </div>

      {/* Localisation */}
      <div className="field-group">
        <label htmlFor="locationLink" className="field-label">Localisation</label>
        <div className="location-input-row">
          <input
            id="locationLink"
            name="locationLink"
            type="text"
            className="field-input"
            placeholder="https://maps.google.com/…"
            value={locationValue}
            onChange={(e) => {
              setLocationValue(e.target.value);
              setShowLocationMap(false);
            }}
          />
          {locationValue && (
            locationCoords ? (
              <button
                type="button"
                className="btn-location-preview"
                onClick={() => setShowLocationMap((v) => !v)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                {showLocationMap ? "Masquer" : "Carte"}
              </button>
            ) : (
              <a
                href={locationValue.startsWith("http") ? locationValue : `https://${locationValue}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-location-preview"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                Ouvrir
              </a>
            )
          )}
        </div>
        {locationValue && locationCoords && (
          <p className="field-hint field-hint--ok">✓ Coordonnées détectées</p>
        )}
        {locationValue && !locationCoords && (
          <p className="field-hint">Lien Google Maps, Géoportail ou toute URL de carte.</p>
        )}
      </div>

      {showLocationMap && locationCoords && (
        <div className="location-map-inline">
          <LocationMap lat={locationCoords[0]} lon={locationCoords[1]} />
        </div>
      )}

      {/* Trace GPX */}
      <div className="field-group">
        <label htmlFor="gpxFile" className="field-label">Trace GPX</label>
        <label className={`gpx-upload-label${gpxFileName ? " gpx-upload-label--done" : ""}`} htmlFor="gpxFile">
          {gpxFileName ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          )}
          {gpxFileName ?? "Importer une trace (.gpx)"}
          <input
            id="gpxFile"
            name="gpxFile"
            type="file"
            accept=".gpx,application/gpx+xml"
            className="gpx-file-input"
            onChange={(e) => setGpxFileName(e.target.files?.[0]?.name ?? null)}
          />
        </label>
        {gpxFileName && (
          <p className="field-hint field-hint--ok">✓ Trace prête — sera enregistrée avec le débrief</p>
        )}
      </div>

      <SubmitBtn />
    </form>
  );
}
