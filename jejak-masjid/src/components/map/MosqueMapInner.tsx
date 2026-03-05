"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Mosque } from "@/lib/db/schema";

// Fix Leaflet default marker icon issue in Next.js
const defaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

// Category-specific colors
const categoryColors: Record<string, string> = {
    iconic: "#1b6b4a",
    historic: "#d4a853",
    campus: "#3b82f6",
    general: "#6b7280",
};

const categoryLabels: Record<string, string> = {
    iconic: "Ikonik",
    historic: "Bersejarah",
    campus: "Kampus",
    general: "Umum",
};

// Indonesia center coordinates
const INDONESIA_CENTER: [number, number] = [-2.5, 118.0];
const INDONESIA_ZOOM = 5;

export default function MosqueMapInner() {
    const [mosques, setMosques] = useState<Mosque[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [checkingIn, setCheckingIn] = useState<string | null>(null);
    const { data: session } = useSession();
    const router = useRouter();

    const handleCheckIn = async (mosqueId: string, mosqueName: string) => {
        if (!session) {
            router.push("/login?callbackUrl=/map");
            return;
        }

        setCheckingIn(mosqueId);
        try {
            const res = await fetch("/api/checkin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mosqueId }),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Gagal check-in");

            setToast({ message: `✅ Berhasil check-in di ${mosqueName}`, type: "success" });
            setTimeout(() => setToast(null), 3000);
        } catch (err: any) {
            setToast({ message: `❌ ${err.message}`, type: "error" });
            setTimeout(() => setToast(null), 3000);
        } finally {
            setCheckingIn(null);
        }
    };

    useEffect(() => {
        async function fetchMosques() {
            try {
                const res = await fetch("/api/mosques");
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                setMosques(data);
            } catch {
                setError("Gagal memuat data masjid");
            } finally {
                setLoading(false);
            }
        }
        fetchMosques();
    }, []);

    if (error) {
        return (
            <div className="map-error">
                <p>❌ {error}</p>
                <p className="map-error-hint">Pastikan database terhubung dan data masjid sudah di-seed.</p>
            </div>
        );
    }

    return (
        <div className="map-wrapper">
            {loading && (
                <div className="map-overlay">
                    <div className="map-loading-spinner"></div>
                    <p>Memuat {mosques.length > 0 ? mosques.length : ""} masjid...</p>
                </div>
            )}

            <MapContainer
                center={INDONESIA_CENTER}
                zoom={INDONESIA_ZOOM}
                className="map-container"
                scrollWheelZoom={true}
                zoomControl={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MarkerClusterGroup chunkedLoading>
                    {mosques.map((mosque) => (
                        <Marker
                            key={mosque.id}
                            position={[mosque.latitude, mosque.longitude]}
                            icon={defaultIcon}
                        >
                            <Popup>
                                <div className="mosque-popup">
                                    <div className="mosque-popup-header">
                                        <span
                                            className="mosque-category-badge"
                                            style={{ background: categoryColors[mosque.category] || categoryColors.general }}
                                        >
                                            {categoryLabels[mosque.category] || mosque.category}
                                        </span>
                                    </div>
                                    <h3 className="mosque-popup-name">{mosque.name}</h3>
                                    <p className="mosque-popup-location">
                                        📍 {mosque.city}, {mosque.province}
                                    </p>
                                    <button
                                        className="btn btn-primary mosque-checkin-btn"
                                        onClick={() => handleCheckIn(mosque.id, mosque.name)}
                                        disabled={checkingIn === mosque.id}
                                    >
                                        {checkingIn === mosque.id ? "Memproses..." : "✅ Check-in"}
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MarkerClusterGroup>
            </MapContainer>

            {/* Mosque count badge */}
            {!loading && mosques.length > 0 && (
                <div className="map-count-badge">
                    🕌 {mosques.length} masjid
                </div>
            )}

            {/* Toast Notification */}
            {toast && (
                <div className="toast" style={toast.type === "error" ? { backgroundColor: "#dc2626" } : {}}>
                    {toast.message}
                </div>
            )}
        </div>
    );
}
