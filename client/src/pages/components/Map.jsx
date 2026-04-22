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

/* FIX LEAFLET ICON PROBLEM */
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

  /* GET DESTINATION COORDINATES */
  useEffect(() => {
    const fetchDestinationLatLng = async () => {
      try {
        const coordinates = await getLatLng(destinationName);
        if (coordinates) {
          setLatLng(coordinates);
        }
      } catch (error) {
        console.error("Failed to fetch destination coordinates:", error);
      }
    };

    if (destinationName && destinationName.trim() !== "") {
      fetchDestinationLatLng();
    }
  }, [destinationName]);

  /* GET USER LOCATION */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        alert(t("mapPage.errors.locationError", { message: error.message }));
      }
    );
  }, [t]);

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
      {latLng && userLocation ? (
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
            <Marker position={[latLng.lat, latLng.lng]}>
              <Popup>
                <b>{destinationName}</b>
              </Popup>
            </Marker>

            {/* USER LOCATION MARKER */}
           <Marker position={[userLocation.lat, userLocation.lng]} icon={customIcon}>
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
        <p>{t("mapPage.loading")}</p>
      )}
    </div>
  );
};

export default Map;