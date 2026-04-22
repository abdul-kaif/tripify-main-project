import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { getLatLng } from "../../utils/geoCode";
import { calculateDistance } from "../../utils/distanceCalc";
import { useTranslation } from "react-i18next";

delete L.Icon.Default.prototype._getIconUrl;

const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

/* USE CDN MARKER ICONS TO AVOID BROKEN IMAGES */
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const Map = ({ destinationName }) => {
  const { t } = useTranslation();

  const [latLng, setLatLng] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);

  /* GET DESTINATION COORDINATES */
  useEffect(() => {
    const fetchDestinationLatLng = async () => {
      try {
        const coordinates = await getLatLng(destinationName);
        if (coordinates) setLatLng(coordinates);
      } catch (error) {
        console.error("Failed to fetch destination coordinates:", error);
      }
    };

    if (destinationName && destinationName.trim() !== "") {
      fetchDestinationLatLng();
    }
  }, [destinationName]);

  /* GET USER LOCATION (PRODUCTION SAFE + FALLBACK) */
useEffect(() => {
  const fallbackLocation = { lat: 28.6139, lng: 77.2090 }; // Delhi fallback

  if (!navigator.geolocation) {
    console.log("Geolocation not supported");

    setUserLocation(fallbackLocation);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      console.log("REAL GPS LOCATION:", latitude, longitude);

      setUserLocation({
        lat: latitude,
        lng: longitude,
      });
    },
    async (error) => {
      console.log("GEOLOCATION ERROR:", error.message);

      // 🔥 STEP 1: Try IP-based location (works on Render)
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();

        console.log("IP LOCATION:", data);

        setUserLocation({
          lat: data.latitude,
          lng: data.longitude,
        });
      } catch (err) {
        console.log("IP fallback failed");

        // 🔥 STEP 2: Final fallback (never breaks UI)
        setUserLocation(fallbackLocation);
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
}, []);

  /* CALCULATE DISTANCE */
  useEffect(() => {
    if (latLng && userLocation) {
      const dist = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        latLng.lat,
        latLng.lng
      );
      setDistance(dist);
    }
  }, [latLng, userLocation]);

  return (
    <div className="w-full h-[400px]">
      {latLng && userLocation?.lat && userLocation?.lng ? (
        <>
          <MapContainer
            center={[latLng.lat, latLng.lng]}
            zoom={10}
            scrollWheelZoom={false}
            className="h-full"
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution="© OpenStreetMap contributors © CARTO"
            />

            {/* DESTINATION MARKER */}
            <Marker position={[latLng.lat, latLng.lng]} icon={markerIcon}>
              <Popup>
                <b>{destinationName}</b>
              </Popup>
            </Marker>

            {/* USER LOCATION MARKER */}
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={markerIcon}
            >
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
        <p>📍 Detecting your location...</p>
      )}
    </div>
  );
};

export default Map;