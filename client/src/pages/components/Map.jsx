import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { getLatLng } from "../../utils/geoCode";
import { calculateDistance } from "../../utils/distanceCalc";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useTranslation } from "react-i18next";

const Map = ({ destinationName }) => {
  const { t } = useTranslation();

  const [latLng, setLatLng] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);

  // Fetch destination coordinates
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

  // Get user geolocation
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

  // Calculate distance when both coordinates are available
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

  const customIcon = L.icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

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
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution={t("mapPage.attribution")}
            />

            <Marker position={[latLng.lat, latLng.lng]} icon={customIcon}>
              <Popup>
                <b>{destinationName}</b>
              </Popup>
            </Marker>

            <Marker position={[userLocation.lat, userLocation.lng]}>
              <Popup>
                <b>{t("mapPage.labels.yourLocation")}</b>
              </Popup>
            </Marker>
          </MapContainer>

          <div className="mt-2 text-sm text-gray-700">
            🧭 {t("mapPage.distanceText.part1")}{" "}
            <strong>{distance} km</strong> {t("mapPage.distanceText.part2")}{" "}
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
