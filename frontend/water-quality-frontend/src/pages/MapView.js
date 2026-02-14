import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

/* ---------------- FIX LEAFLET MARKER ICON ISSUE ---------------- */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function MapView() {
  const [stations, setStations] = useState([]);

  /* ---------------- FETCH STATIONS FROM BACKEND ---------------- */
  useEffect(() => {
    fetch("http://127.0.0.1:8000/cpcb/stations")
      .then((res) => res.json())
      .then((data) => {
        console.log("STATIONS FROM BACKEND:", data);

        // CPCB returns an object → convert to array
        const stationArray = Object.values(data);
        setStations(stationArray);
      })
      .catch((err) => {
        console.error("Error fetching stations:", err);
      });
  }, []);

  return (
    <div style={{ height: "90vh", width: "100%" }}>
      <MapContainer
        center={[22.5726, 88.3639]} // India focus (Kolkata)
        zoom={5}
        style={{ height: "100%", width: "100%" }}
      >
        {/* ---------------- MAP TILES ---------------- */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />

        {/* ---------------- STATION MARKERS ---------------- */}
        {stations.map((station, index) => {
          const latitude = parseFloat(station.latitude);
          const longitude = parseFloat(station.longitude);

          // Skip invalid coordinates
          if (isNaN(latitude) || isNaN(longitude)) return null;

          return (
            <Marker
              key={index}
              position={[latitude, longitude]}
            >
              <Popup>
                <strong>{station.station_name || "Unknown Station"}</strong>
                <br />
                City: {station.city || "N/A"}
                <br />
                State: {station.state || "N/A"}
                <br />
                Station ID: {station.station_code || "N/A"}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default MapView;
