"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const defaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

export default function VisitedMapInner({ checkins }: { checkins: any[] }) {
    // Deduplicate mosques for the map
    const seen = new Set();
    const uniqueMosques = checkins.map(c => c.mosque).filter(m => {
        if (seen.has(m.id)) return false;
        seen.add(m.id);
        return true;
    });

    // Default to Indonesia center if no checkins
    const center: [number, number] = uniqueMosques.length > 0
        ? [uniqueMosques[0].latitude, uniqueMosques[0].longitude]
        : [-2.5, 118.0];
    const zoom = uniqueMosques.length > 0 ? 9 : 4;

    return (
        <div style={{ height: '300px', width: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
            <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }} zoomControl={false} scrollWheelZoom={false}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {uniqueMosques.map((mosque) => (
                    <Marker key={mosque.id} position={[mosque.latitude, mosque.longitude]} icon={defaultIcon}>
                        <Popup>{mosque.name}</Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
