"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updateSortie } from "@/app/actions";
import { GpxMap } from "@/app/components/GpxMap";
import { LocationMap } from "@/app/components/LocationMap";

type Props = {
  slug: string;
  outingName: string;
  massif: string;
  outingDate: string;
  participants: string;
  locationLink: string | null;
  gpxData: string | null;
};

function extractLatLon(url: string): [number, number] | null {
  // @lat,lon,zoom (Google Maps standard)
  const at = url.match(/@(-?\d+\.?\d+),(-?\d+\.?\d+)/);
  if (at) return [parseFloat(at[1]), parseFloat(at[2])];
  // q=lat,lon ou ll=lat,lon
  const q = url.match(/[?&](?:q|ll)=(-?\d+\.?\d+),(-?\d+\.?\d+)/);
  if (q) return [parseFloat(q[1]), parseFloat(q[2])];
  return null;
}

export function SortieForm({
  slug,
  outingName,
  massif,
  outingDate,
  participants,
  locationLink,
  gpxData,
}: Props) {
  const router = useRouter();
  const boundAction = updateSortie.bind(null, slug);
  const [state, formAction, pending] = useActionState(boundAction, null);
  const [showLocationMap, setShowLocationMap] = useState(false);
  const [locationValue, setLocationValue] = useState(locationLink ?? "");
  const [gpxFileName, setGpxFileName] = useState<string | null>(null);

  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state, router]);

  const locationCoords = locationValue ? extractLatLon(locationValue) : null;

  return (
    <section className="debrief-section debrief-section--done">
      <div className="section-head">
        <span className="section-num">§ 01</span>
        <h2 className="section-title-app">La sortie</h2>
        <span className="section-badge" aria-label="Section renseignée">✓</span>
      </div>
      <form action={formAction} className="section-form">
        <div className="field-group">
          <label htmlFor="sortie-name" className="field-label field-label--required">
            Sortie
          </label>
          <input
            id="sortie-name"
            name="outingName"
            type="text"
            required
            defaultValue={outingName}
            className="field-input"
          />
        </div>
        <div className="nouveau-row">
          <div className="field-group">
            <label htmlFor="sortie-massif" className="field-label">Massif</label>
            <input
              id="sortie-massif"
              name="massif"
              type="text"
              defaultValue={massif}
              className="field-input"
            />
          </div>
          <div className="field-group">
            <label htmlFor="sortie-date" className="field-label">Date</label>
            <input
              id="sortie-date"
              name="outingDate"
              type="date"
              defaultValue={outingDate}
              className="field-input"
            />
          </div>
        </div>
        <div className="field-group">
          <label htmlFor="sortie-participants" className="field-label">Participants</label>
          <input
            id="sortie-participants"
            name="participants"
            type="text"
            defaultValue={participants}
            className="field-input"
          />
        </div>

        <div className="field-group">
          <label htmlFor="sortie-location" className="field-label">
            Localisation
          </label>
          <div className="location-input-row">
            <input
              id="sortie-location"
              name="locationLink"
              type="url"
              value={locationValue}
              onChange={(e) => {
                setLocationValue(e.target.value);
                setShowLocationMap(false);
              }}
              className="field-input"
              placeholder="https://maps.google.com/… ou https://geoportail.gouv.fr/…"
            />
            {locationValue && (
              locationCoords ? (
                <button
                  type="button"
                  className="btn-location-preview"
                  onClick={() => setShowLocationMap((v) => !v)}
                  title={showLocationMap ? "Masquer la carte" : "Voir sur la carte"}
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
                  title="Ouvrir dans la carte"
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

        <div className="field-group">
          <label htmlFor="sortie-gpx" className="field-label">
            Trace GPX
          </label>
          <label
            className={`gpx-upload-label${gpxFileName ? " gpx-upload-label--done" : ""}`}
            htmlFor="sortie-gpx"
          >
            {gpxFileName ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            )}
            {gpxFileName ?? (gpxData ? "Remplacer la trace (.gpx)" : "Importer une trace (.gpx)")}
            <input
              id="sortie-gpx"
              name="gpxFile"
              type="file"
              accept=".gpx,application/gpx+xml"
              className="gpx-file-input"
              onChange={(e) => setGpxFileName(e.target.files?.[0]?.name ?? null)}
            />
          </label>
          {gpxFileName && (
            <p className="field-hint field-hint--ok">✓ Fichier sélectionné — sera enregistré</p>
          )}
          {!gpxFileName && gpxData && (
            <p className="field-hint gpx-hint--active">Trace chargée · visualisation ci-dessous</p>
          )}
        </div>

        <div className="section-footer">
          <button
            type="submit"
            disabled={pending}
            className={`btn-save${state?.ok ? " btn-save--done" : ""}`}
          >
            {pending ? "Enregistrement…" : state?.ok ? "Enregistré ✓" : "Enregistrer"}
          </button>
        </div>
      </form>

      {gpxData && (
        <div className="gpx-section">
          <GpxMap gpxData={gpxData} />
        </div>
      )}
    </section>
  );
}
