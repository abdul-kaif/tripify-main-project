import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import { getLatLng } from "../../utils/geoCode";
import { calculateDistance } from "../../utils/distanceCalc";
import { useTranslation } from "react-i18next";

/* ✅ PERFECT FIX (VITE + RENDER SAFE) */
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const Map = ({ destinationName }) => {
  const { t } = useTranslation();

  const [latLng, setLatLng] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);

  /* DESTINATION LOCATION */
  useEffect(() => {
    const fetchDestinationLatLng = async () => {
      try {
        const coordinates = await getLatLng(destinationName);
        if (coordinates) setLatLng(coordinates);
      } catch (error) {
        console.error("Failed to fetch destination coordinates:", error);
      }
    };

    if (destinationName?.trim()) {
      fetchDestinationLatLng();
    }
  }, [destinationName]);

  /* USER LOCATION (PRODUCTION SAFE) */
  useEffect(() => {
    const fallback = { lat: 28.6139, lng: 77.2090 };

    if (!navigator.geolocation) {
      setUserLocation(fallback);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      async () => {
        try {
          const res = await fetch("https://ipapi.co/json/");
          const data = await res.json();

          setUserLocation({
            lat: data.latitude,
            lng: data.longitude,
          });
        } catch {
          setUserLocation(fallback);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  /* DISTANCE */
  useEffect(() => {
    if (latLng && userLocation) {
      setDistance(
        calculateDistance(
          userLocation.lat,
          userLocation.lng,
          latLng.lat,
          latLng.lng
        )
      );
    }
  }, [latLng, userLocation]);

  return (
    <div className="w-full h-[400px]">
      {latLng && userLocation?.lat ? (
        <>
          <MapContainer
            center={[latLng.lat, latLng.lng]}
            zoom={10}
            className="h-full"
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution="© OpenStreetMap contributors © CARTO"
            />

            {/* DESTINATION */}
            <Marker position={[latLng.lat, latLng.lng]}>
              <Popup>
                <b>{destinationName}</b>
              </Popup>
            </Marker>

            {/* USER */}
            <Marker position={[userLocation.lat, userLocation.lng]}>
              <Popup>
                <b>{t("mapPage.labels.yourLocation")}</b>
              </Popup>
            </Marker>
          </MapContainer>

          <div className="mt-2 text-sm text-gray-700">
            🧭 {t("mapPage.distanceText.part1")}{" "}
            <strong>{distance} km</strong>{" "}
            {t("mapPage.distanceText.part2")}{" "}
            <strong>{destinationName}</strong>
          </div>
        </>
      ) : (
        <p>kaif📍 Detecting your location...</p>
      )}
    </div>
  );
};

export default Map;