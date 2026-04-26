// src/components/appointments/lagos-map-panel.tsx
"use client";

import * as React from "react";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from "react-leaflet";
import { MapPin, Navigation } from "lucide-react";

type LagosLocation = {
  id: string;
  title: string;
  description: string;
  position: [number, number];
  active?: boolean;
};

const lagosLocations: LagosLocation[] = [
  {
    id: "samalia-private-studio",
    title: "Sam’Alia Private Studio",
    description:
      "Lagos, Nigeria. Exact studio details are shared after appointment confirmation.",
    position: [6.4281, 3.4219],
    active: true,
  },
  {
    id: "ikoyi",
    title: "Ikoyi",
    description: "Private fittings and client-facing appointments can be coordinated within Lagos.",
    position: [6.4541, 3.4246],
  },
  {
    id: "ikeja",
    title: "Ikeja",
    description: "Lagos appointment coverage begins with key city districts.",
    position: [6.6018, 3.3515],
  },
  {
    id: "lekki",
    title: "Lekki",
    description: "Private appointment coordination can extend across Lagos by confirmation.",
    position: [6.4698, 3.5852],
  },
];

const lagosCenter: [number, number] = [6.5244, 3.3792];

function createMarkerIcon(active = false) {
  return L.divIcon({
    className: "samalia-leaflet-marker",
    iconSize: active ? [48, 48] : [42, 42],
    iconAnchor: active ? [24, 48] : [21, 42],
    popupAnchor: [0, -40],
    html: renderToStaticMarkup(
      <div
        className={[
          "flex items-center justify-center text-black",
          active ? "size-12" : "size-10",
        ].join(" ")}
      >
        <MapPin
          className={active ? "size-12" : "size-10"}
          strokeWidth={2.7}
          fill="black"
        />
      </div>
    ),
  });
}

export default function LagosMapPanel() {
  const activeIcon = React.useMemo(() => createMarkerIcon(true), []);
  const idleIcon = React.useMemo(() => createMarkerIcon(false), []);

  return (
    <section className="relative min-h-[54svh] overflow-hidden bg-[#d7d7d7] text-black lg:min-h-[calc(100svh-var(--nav-h))]">
      <MapContainer
        center={lagosCenter}
        zoom={11}
        minZoom={10}
        maxZoom={16}
        scrollWheelZoom={false}
        zoomControl={false}
        className="samalia-map h-full min-h-[54svh] w-full lg:min-h-[calc(100svh-var(--nav-h))]"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ZoomControl position="bottomleft" />

        {lagosLocations.map((location) => (
          <Marker
            key={location.id}
            position={location.position}
            icon={location.active ? activeIcon : idleIcon}
          >
            <Popup closeButton={false}>
              <div className="max-w-56">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-black">
                  {location.title}
                </p>
                <p className="mt-2 text-xs leading-5 text-black/60">
                  {location.description}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="pointer-events-none absolute inset-0 bg-white/10" />
      <div className="pointer-events-none absolute left-0 top-0 h-28 w-2 bg-black lg:h-40" />

      <div className="pointer-events-none absolute bottom-5 left-5 right-5 z-401 sm:bottom-8 sm:left-8 sm:right-auto lg:bottom-10 lg:left-10">
        <div className="max-w-110 border border-black/10 bg-white/86 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.10)] backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center bg-black text-white">
              <Navigation className="size-4.5" />
            </div>

            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.24em]">
                Lagos, Nigeria
              </p>
              <p className="mt-3 text-sm leading-7 text-black/62">
                Exact appointment details are shared privately after your request
                is confirmed.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .samalia-map {
          filter: grayscale(1) contrast(1.08) brightness(0.94);
          background: #d7d7d7;
        }

        .samalia-map .leaflet-tile {
          filter: grayscale(1) contrast(1.05) brightness(0.96);
        }

        .samalia-map .leaflet-control-zoom {
          border: 1px solid rgba(0, 0, 0, 0.12);
          box-shadow: none;
        }

        .samalia-map .leaflet-control-zoom a {
          width: 38px;
          height: 38px;
          border: 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.12);
          background: rgba(255, 255, 255, 0.88);
          color: #000;
          font:
            400 18px/38px var(--font-body),
            Arial,
            sans-serif;
          backdrop-filter: blur(8px);
        }

        .samalia-map .leaflet-control-zoom a:last-child {
          border-bottom: 0;
        }

        .samalia-map .leaflet-control-attribution {
          background: rgba(255, 255, 255, 0.72);
          color: rgba(0, 0, 0, 0.42);
          font-size: 10px;
        }

        .samalia-map .leaflet-popup-content-wrapper {
          border-radius: 0;
          border: 1px solid rgba(0, 0, 0, 0.12);
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.16);
        }

        .samalia-map .leaflet-popup-content {
          margin: 14px;
        }

        .samalia-map .leaflet-popup-tip {
          border-radius: 0;
        }

        .samalia-leaflet-marker {
          background: transparent;
          border: 0;
        }
      `}</style>
    </section>
  );
}