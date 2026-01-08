"use client";

import { useEffect, useRef, useState } from "react";

interface GeoFenceDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function GeoFenceDrawer({ open, onClose }: GeoFenceDrawerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false); // track if script loaded
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [circle, setCircle] = useState<google.maps.Circle | null>(null);
  const [radius, setRadius] = useState(100);
  const [loading, setLoading] = useState(true);

  console.log("Drawer open state:", open);

  // 1️⃣ Load Google Maps script once
  useEffect(() => {
    if (mapLoaded) {
      console.log("Google Maps script already loaded");
      return;
    }

    console.log("Loading Google Maps script...");
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com/maps/api/js"]'
    ) as HTMLScriptElement | null;

    if (!existingScript) {
      console.log("Creating Google Maps script element...");
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log("Google Maps script loaded successfully");
        setMapLoaded(true);
      };
      script.onerror = (e) => console.error("Google Maps script failed to load", e);
      document.body.appendChild(script);
    } else {
      console.log("Google Maps script already exists");
      if ((window as any).google && (window as any).google.maps) {
        setMapLoaded(true);
      } else {
        existingScript.addEventListener("load", () => setMapLoaded(true));
      }
    }
  }, []);

  // 2️⃣ Initialize map when drawer is open AND mapRef exists AND script is loaded
  useEffect(() => {
    console.log("Checking if we can initialize map...");
    if (!open) {
      console.log("Drawer is not open, skipping map initialization");
      return;
    }
    if (!mapLoaded) {
      console.log("Map script not loaded yet");
      return;
    }
    if (!mapRef.current) {
      console.log("mapRef not ready yet");
      return;
    }
    if (!window.google || !window.google.maps) {
      console.log("Google Maps API not available yet");
      return;
    }
    if (map) {
      console.log("Map already initialized");
      return;
    }

    console.log("Initializing map now...");
    const center = { lat: 12.9352, lng: 77.6245 };

    const mapInstance = new google.maps.Map(mapRef.current, {
      center,
      zoom: 15,
    });
    console.log("Map instance created:", mapInstance);
    setMap(mapInstance);

    const advMarker = new google.maps.Marker({
      map: mapInstance,
      position: center,
      draggable: true,
    });
    console.log("Marker created:", advMarker);
    setMarker(advMarker);

    const circleInstance = new google.maps.Circle({
      map: mapInstance,
      center,
      radius,
      strokeColor: "#4285F4",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#4285F4",
      fillOpacity: 0.15,
    });
    console.log("Circle created:", circleInstance);
    setCircle(circleInstance);

    advMarker.addListener("dragend", (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        console.log("Marker dragged to:", event.latLng.toJSON());
        circleInstance.setCenter(event.latLng);
      }
    });

    setLoading(false);
    console.log("Map initialized successfully");
  }, [open, mapLoaded, mapRef.current]);

  // Update circle radius dynamically
  useEffect(() => {
    if (circle) {
      console.log("Updating circle radius to:", radius);
      circle.setRadius(radius);
    }
  }, [radius, circle]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-end z-50 transition-opacity duration-300 opacity-100 visible">
      <div className="bg-white w-[550px] h-full shadow-xl transform transition-transform duration-300 translate-x-0">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-sm font-semibold">Choose Location</h2>
          <button onClick={onClose} className="text-xs text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="p-4 flex flex-col gap-3">
          <div>
            <label className="block text-xs text-gray-600">Search Location</label>
            <input
              type="text"
              placeholder="Search Location"
              className="w-full text-xs border rounded-md px-2 py-1 mt-1 focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600">Radius (meters)</label>
            <input
              type="number"
              min={100}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full text-xs border rounded-md px-2 py-1 mt-1 focus:outline-none focus:ring focus:ring-blue-200"
            />
            <p className="text-[10px] text-red-500 mt-1">Minimum radius should be 100.</p>
          </div>
        </div>

        <div className="flex-1">
          {loading ? (
            <div className="h-[400px] flex items-center justify-center text-xs text-gray-500">
              Loading map...
            </div>
          ) : (
            <div ref={mapRef} className="w-full h-[400px]" />
          )}
        </div>

        <div className="flex justify-end border-t p-3 gap-2">
          <button onClick={onClose} className="text-xs border rounded-md px-3 py-1 hover:bg-gray-50">
            Cancel
          </button>
          <button className="text-xs bg-blue-600 text-white rounded-md px-3 py-1 hover:bg-blue-700">
            Select
          </button>
        </div>
      </div>
    </div>
  );
}
