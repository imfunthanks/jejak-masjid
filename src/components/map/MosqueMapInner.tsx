"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MapContainer, TileLayer, Marker, Polyline, Rectangle, Tooltip as LeafletTooltip, Circle, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Mosque } from "@/lib/db/schema";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X as XIcon, ImageIcon, Plus } from "lucide-react";

// Dynamic Numbered Icon Factory
const createNumberedIcon = (number: number) => L.divIcon({
    className: "custom-leaflet-marker",
    html: `<div class="numbered-marker">${number}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
});

const createMosqueIcon = (status: 'unvisited' | 'planned' | 'visited') => {
    // Option B: Crescent and Star Teardrop
    let bgColor = 'white';
    let iconColor = '#9ca3af'; // outline for unvisited
    let strokeColor = '#9ca3af';

    if (status === 'planned') {
        bgColor = 'white';
        iconColor = '#f59e0b'; // gold
        strokeColor = '#f59e0b';
    } else if (status === 'visited') {
        bgColor = '#10b981'; // emerald green
        iconColor = 'white';
        strokeColor = 'white';
    }

    const svg = `
        <svg width="36" height="48" viewBox="0 0 36 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 0C8.059 0 0 8.059 0 18C0 31.5 18 48 18 48C18 48 36 31.5 36 18C36 8.059 27.941 0 18 0Z" fill="${bgColor}" stroke="${strokeColor}" stroke-width="2" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.3))"/>
            <path d="M22 17C22 20.3137 19.3137 23 16 23C15.1105 23 14.2658 22.8068 13.5136 22.4646C14.7397 24.5985 17.1856 26 20 26C24.4183 26 28 22.4183 28 18C28 15.1856 26.5985 12.7397 24.4646 11.5136C24.8068 12.2658 25 13.1105 25 14C25 14 22 14.5 22 17Z" fill="${iconColor}"/>
            <path d="M14.5 11L15.3536 12.6464L17 13L15.75 14.1568L16.2 16L14.5 15.2071L12.8 16L13.25 14.1568L12 13L13.6464 12.6464L14.5 11Z" fill="${iconColor}"/>
        </svg>
    `;

    return L.divIcon({
        className: 'custom-mosque-marker',
        html: svg,
        iconSize: [36, 48],
        iconAnchor: [18, 48],
        popupAnchor: [0, -48],
    });
};

const userIcon = L.divIcon({
    className: "custom-leaflet-marker",
    html: `
        <div style="background-color: #3b82f6; border: 3px solid white; width: 18px; height: 18px; border-radius: 50%; box-shadow: 0 0 10px rgba(59,130,246,0.8); position: relative;">
            <div style="position: absolute; top: -3px; left: -3px; right: -3px; bottom: -3px; border-radius: 50%; border: 2px solid #3b82f6; animation: my-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        </div>
        <style>
        @keyframes my-ping {
            75%, 100% { transform: scale(2); opacity: 0; }
        }
        </style>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
});

function LocateControl({ getUserLocation, setUserLocation }: { getUserLocation: () => Promise<{ lat: number, lng: number }>, setUserLocation: (loc: { lat: number, lng: number }) => void }) {
    const map = useMap();
    const [loading, setLoading] = useState(false);

    const handleLocate = async () => {
        setLoading(true);
        try {
            const loc = await getUserLocation();
            setUserLocation(loc);
            map.flyTo([loc.lat, loc.lng], 16, { animate: true, duration: 1.5 });
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="leaflet-bottom leaflet-right" style={{ marginBottom: "30px", marginRight: "16px", zIndex: 1000, position: "absolute", bottom: 0, right: 0 }}>
            <div className="leaflet-control leaflet-bar border-none shadow-none">
                <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleLocate(); }}
                    className="flex text-[var(--color-primary)] items-center justify-center w-12 h-12 shadow-[var(--shadow-md)] rounded-full border border-[var(--border-light)] transition-transform hover:scale-105"
                    style={{ backgroundColor: "white", cursor: "pointer" }}
                    title="Temukan Lokasi Saya"
                >
                    {loading ? (
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" /></svg>
                    )}
                </button>
            </div>
        </div>
    );
}

// Category-specific colors

// Bandung center coordinates
const BANDUNG_CENTER: [number, number] = [-6.9147, 107.6098];
const BANDUNG_ZOOM = 13;
const BANDUNG_BOUNDS: [[number, number], [number, number]] = [[-6.98, 107.50], [-6.82, 107.78]];
const CHECKIN_RADIUS_METERS = 200;

// Haversine distance in meters
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3;
    const toRad = (d: number) => (d * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Mosque image URLs by category (Unsplash)
const MOSQUE_IMAGES: Record<string, string> = {
    iconic: "https://images.unsplash.com/photo-1585036156171-384164a8c159?w=600&h=400&fit=crop",
    historic: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=600&h=400&fit=crop",
    campus: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=600&h=400&fit=crop",
    general: "https://images.unsplash.com/photo-1519817650390-64a93db51571?w=600&h=400&fit=crop",
};

// All Bandung area mosques (25+)
const MOCK_MOSQUES = [
    { id: "m1", name: "Masjid Raya Bandung", city: "Bandung", province: "Jawa Barat", latitude: -6.9218, longitude: 107.6093, category: "iconic", imageUrl: "https://images.unsplash.com/photo-1585036156171-384164a8c159?w=600&h=400&fit=crop", createdAt: new Date() },
    { id: "m2", name: "Masjid Salman ITB", city: "Bandung", province: "Jawa Barat", latitude: -6.8905, longitude: 107.6106, category: "campus", imageUrl: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=600&h=400&fit=crop", createdAt: new Date() },
    { id: "m3", name: "Masjid Pusdai", city: "Bandung", province: "Jawa Barat", latitude: -6.9048, longitude: 107.6183, category: "iconic", imageUrl: "https://images.unsplash.com/photo-1585036156171-384164a8c159?w=600&h=400&fit=crop", createdAt: new Date() },
    { id: "m4", name: "Masjid Agung Trans Studio", city: "Bandung", province: "Jawa Barat", latitude: -6.9263, longitude: 107.6358, category: "iconic", imageUrl: "https://images.unsplash.com/photo-1585036156171-384164a8c159?w=600&h=400&fit=crop", createdAt: new Date() },
    { id: "m5", name: "Masjid Al-Ukhuwwah", city: "Bandung", province: "Jawa Barat", latitude: -6.9200, longitude: 107.5989, category: "general", imageUrl: "https://images.unsplash.com/photo-1519817650390-64a93db51571?w=600&h=400&fit=crop", createdAt: new Date() },
    { id: "m6", name: "Masjid Cipaganti", city: "Bandung", province: "Jawa Barat", latitude: -6.8946, longitude: 107.6012, category: "historic", imageUrl: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=600&h=400&fit=crop", createdAt: new Date() },
    { id: "m7", name: "Masjid Lautze 2", city: "Bandung", province: "Jawa Barat", latitude: -6.9189, longitude: 107.6186, category: "historic", imageUrl: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=600&h=400&fit=crop", createdAt: new Date() },
    { id: "m8", name: "Masjid Al-Lathiif", city: "Bandung", province: "Jawa Barat", latitude: -6.8944, longitude: 107.6167, category: "general", imageUrl: "https://images.unsplash.com/photo-1519817650390-64a93db51571?w=600&h=400&fit=crop", createdAt: new Date() },
    { id: "m9", name: "Masjid Al-Imtizaj", city: "Bandung", province: "Jawa Barat", latitude: -6.9185, longitude: 107.6054, category: "historic", imageUrl: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=600&h=400&fit=crop", createdAt: new Date() },
    { id: "m10", name: "Masjid Istiqomah", city: "Bandung", province: "Jawa Barat", latitude: -6.9100, longitude: 107.6158, category: "general", imageUrl: "https://images.unsplash.com/photo-1519817650390-64a93db51571?w=600&h=400&fit=crop", createdAt: new Date() },
    { id: "m11", name: "Masjid Daarut Tauhiid", city: "Bandung", province: "Jawa Barat", latitude: -6.8654, longitude: 107.5898, category: "iconic", imageUrl: "https://images.unsplash.com/photo-1585036156171-384164a8c159?w=600&h=400&fit=crop", createdAt: new Date() },
    { id: "m12", name: "Masjid Al-Furqon UPI", city: "Bandung", province: "Jawa Barat", latitude: -6.8601, longitude: 107.5902, category: "campus", imageUrl: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=600&h=400&fit=crop", createdAt: new Date() },
    { id: "m13", name: "Masjid Al-Multazam", city: "Bandung", province: "Jawa Barat", latitude: -6.8837, longitude: 107.5954, category: "general", imageUrl: "https://images.unsplash.com/photo-1519817650390-64a93db51571?w=600&h=400&fit=crop", createdAt: new Date() },
    { id: "m14", name: "Masjid At-Taqwa Cimahi", city: "Bandung", province: "Jawa Barat", latitude: -6.9103, longitude: 107.6369, category: "general", imageUrl: "https://images.unsplash.com/photo-1519817650390-64a93db51571?w=600&h=400&fit=crop", createdAt: new Date() },
    { id: "m15", name: "Masjid Agung Cimahi", city: "Cimahi", province: "Jawa Barat", latitude: -6.8847, longitude: 107.5428, category: "iconic", imageUrl: "https://images.unsplash.com/photo-1585036156171-384164a8c159?w=600&h=400&fit=crop", createdAt: new Date() },
    { id: "m16", name: "Masjid Al-Safar", city: "Bandung", province: "Jawa Barat", latitude: -6.9305, longitude: 107.6170, category: "general", imageUrl: "https://images.unsplash.com/photo-1519817650390-64a93db51571?w=600&h=400&fit=crop", createdAt: new Date() },
    { id: "m17", name: "Masjid Miftahul Jannah", city: "Bandung", province: "Jawa Barat", latitude: -6.9350, longitude: 107.6250, category: "general", imageUrl: "https://images.unsplash.com/photo-1519817650390-64a93db51571?w=600&h=400&fit=crop", createdAt: new Date() },
    { id: "m18", name: "Masjid Al-Muhajirin Antapani", city: "Bandung", province: "Jawa Barat", latitude: -6.9140, longitude: 107.6510, category: "general", imageUrl: "https://images.unsplash.com/photo-1519817650390-64a93db51571?w=600&h=400&fit=crop", createdAt: new Date() },
    { id: "m19", name: "Masjid Al-Hidayah Arcamanik", city: "Bandung", province: "Jawa Barat", latitude: -6.9220, longitude: 107.6680, category: "general", imageUrl: "https://images.unsplash.com/photo-1519817650390-64a93db51571?w=600&h=400&fit=crop", createdAt: new Date() },
    { id: "m20", name: "Masjid Raya Al-Jabbar", city: "Bandung", province: "Jawa Barat", latitude: -6.9458, longitude: 107.7027, category: "iconic", imageUrl: "https://images.unsplash.com/photo-1585036156171-384164a8c159?w=600&h=400&fit=crop", createdAt: new Date() },
    { id: "m21", name: "Masjid Al-Ikhlas Buah Batu", city: "Bandung", province: "Jawa Barat", latitude: -6.9410, longitude: 107.6340, category: "general", imageUrl: "https://images.unsplash.com/photo-1519817650390-64a93db51571?w=600&h=400&fit=crop", createdAt: new Date() },
    { id: "m22", name: "Masjid At-Tin Turangga", city: "Bandung", province: "Jawa Barat", latitude: -6.9280, longitude: 107.6210, category: "general", imageUrl: "https://images.unsplash.com/photo-1519817650390-64a93db51571?w=600&h=400&fit=crop", createdAt: new Date() },
    { id: "m23", name: "Masjid Agung Ujung Berung", city: "Bandung", province: "Jawa Barat", latitude: -6.9100, longitude: 107.7100, category: "iconic", imageUrl: "https://images.unsplash.com/photo-1585036156171-384164a8c159?w=600&h=400&fit=crop", createdAt: new Date() },
    { id: "m24", name: "Masjid Nurul Falah Dago", city: "Bandung", province: "Jawa Barat", latitude: -6.8750, longitude: 107.6180, category: "general", imageUrl: "https://images.unsplash.com/photo-1519817650390-64a93db51571?w=600&h=400&fit=crop", createdAt: new Date() },
    { id: "m25", name: "Masjid Al-Irsyad Kota Baru", city: "Bandung Barat", province: "Jawa Barat", latitude: -6.8477, longitude: 107.5500, category: "iconic", imageUrl: "https://images.unsplash.com/photo-1585036156171-384164a8c159?w=600&h=400&fit=crop", createdAt: new Date() },
    { id: "m26", name: "Masjid Telkom University", city: "Bandung", province: "Jawa Barat", latitude: -6.9733, longitude: 107.6310, category: "campus", imageUrl: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=600&h=400&fit=crop", createdAt: new Date() },
];

type CheckinData = {
    checkinId: string;
    visitedAt: string;
    mosque: Mosque;
};

export type PlannedVisit = {
    mosqueId: string;
    date: string;
    reminder: boolean;
};

// Heatmap configuration
const LAT_MIN = -6.96;
const LAT_MAX = -6.84;
const LNG_MIN = 107.57;
const LNG_MAX = 107.72;
const GRID_ROWS = 6;
const GRID_COLS = 6;

export default function MosqueMapInner() {
    const [mosques, setMosques] = useState<Mosque[]>([]);
    const [checkins, setCheckins] = useState<CheckinData[]>([]);
    const [, setLoading] = useState(true);
    const [plannedVisits, setPlannedVisits] = useState<PlannedVisit[]>([]);

    // UI states
    const [selectedMosque, setSelectedMosque] = useState<Mosque | null>(null);
    const [showPlanner, setShowPlanner] = useState(false);
    const [planDate, setPlanDate] = useState("");
    const [planReminder, setPlanReminder] = useState(false);
    const [checkinError, setCheckinError] = useState<string | null>(null);

    // Check-in form states
    const [showCheckinForm, setShowCheckinForm] = useState(false);
    const [checkinCaption, setCheckinCaption] = useState("");
    const [checkinPhoto, setCheckinPhoto] = useState<File | null>(null);
    const [checkinPhotoPreview, setCheckinPhotoPreview] = useState<string | null>(null);
    const [checkinUploading, setCheckinUploading] = useState(false);
    const photoInputRef = useRef<HTMLInputElement>(null);

    // Add Mosque States
    const [showAddMosqueForm, setShowAddMosqueForm] = useState(false);
    const [newMosqueName, setNewMosqueName] = useState("");
    const [addMosqueLoading, setAddMosqueLoading] = useState(false);

    // View modes
    const [activeFilter, setActiveFilter] = useState<string>("all");
    const [viewMode, setViewMode] = useState<"journey" | "heatmap">("journey");
    const [showChecklistPopup, setShowChecklistPopup] = useState(false);
    const [newlyVisitedMosque, setNewlyVisitedMosque] = useState<Mosque | null>(null);

    // User location
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [locationLoading, setLocationLoading] = useState(false);

    const { data: session } = useSession();
    const router = useRouter();

    // Watch user location
    useEffect(() => {
        if (!navigator.geolocation) return;
        const watchId = navigator.geolocation.watchPosition(
            (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            () => { }, // silently fail — we'll prompt when they try to check in
            { enableHighAccuracy: true, maximumAge: 10000 }
        );
        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    useEffect(() => {
        const stored = localStorage.getItem("plannedVisits");
        if (stored) {
            try { setPlannedVisits(JSON.parse(stored)); } catch { }
        }
    }, []);

    const fetchJourney = async () => {
        if (!session) return;
        try {
            const res = await fetch("/api/checkin/journey");
            if (res.ok) {
                const data = await res.json();
                setCheckins(data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        async function fetchMosques() {
            try {
                const res = await fetch("/api/mosques");
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                if (data.length > 0) {
                    setMosques(data);
                } else throw new Error("Empty");
            } catch {
                setMosques(MOCK_MOSQUES as Mosque[]);
            } finally {
                setLoading(false);
            }
        }
        fetchMosques();
    }, []);

    useEffect(() => {
        fetchJourney();
    }, [session]);

    const getUserLocation = useCallback((): Promise<{ lat: number; lng: number }> => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error("Geolocation tidak didukung oleh browser Anda."));
                return;
            }
            navigator.geolocation.getCurrentPosition(
                (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                (err) => {
                    if (err.code === 1) reject(new Error("Izin lokasi ditolak. Aktifkan GPS untuk check-in."));
                    else reject(new Error("Gagal mendapatkan lokasi. Pastikan GPS aktif."));
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
            );
        });
    }, []);

    const resetCheckinForm = useCallback(() => {
        setShowCheckinForm(false);
        setCheckinCaption("");
        if (checkinPhotoPreview) URL.revokeObjectURL(checkinPhotoPreview);
        setCheckinPhoto(null);
        setCheckinPhotoPreview(null);
        setCheckinUploading(false);
    }, [checkinPhotoPreview]);

    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        // Validate type & size client-side
        const allowed = ["image/jpeg", "image/png", "image/webp"];
        if (!allowed.includes(file.type)) {
            setCheckinError("Format file tidak didukung. Gunakan JPEG, PNG, atau WebP.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setCheckinError("Ukuran file terlalu besar. Maksimal 5MB.");
            return;
        }
        if (checkinPhotoPreview) URL.revokeObjectURL(checkinPhotoPreview);
        setCheckinPhoto(file);
        setCheckinPhotoPreview(URL.createObjectURL(file));
        setCheckinError(null);
    };

    const removePhoto = () => {
        if (checkinPhotoPreview) URL.revokeObjectURL(checkinPhotoPreview);
        setCheckinPhoto(null);
        setCheckinPhotoPreview(null);
        if (photoInputRef.current) photoInputRef.current.value = "";
    };

    const handleAddMosque = async () => {
        if (!session) {
            router.push("/login?callbackUrl=/map");
            return;
        }
        if (!newMosqueName.trim()) {
            setCheckinError("Nama masjid tidak boleh kosong.");
            return;
        }

        setAddMosqueLoading(true);
        setCheckinError(null);

        try {
            const loc = await getUserLocation();
            setUserLocation(loc);

            const res = await fetch("/api/mosques/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: newMosqueName.trim(),
                    latitude: loc.lat,
                    longitude: loc.lng,
                    category: "general"
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Gagal menambahkan masjid");
            }

            const newMosque = await res.json();

            setMosques(prev => [...prev, newMosque]);
            setShowAddMosqueForm(false);
            setNewMosqueName("");

            // Wait for state updates then check in
            setTimeout(() => {
                handleCheckIn(newMosque.id);
            }, 500);

        } catch (error) {
            if (error instanceof Error) {
                setCheckinError(error.message);
            }
            console.error(error);
        } finally {
            setAddMosqueLoading(false);
        }
    };

    const handleCheckIn = async (mosqueId: string) => {
        if (!session) {
            router.push("/login?callbackUrl=/map");
            return;
        }

        setCheckinError(null);
        setLocationLoading(true);
        setCheckinUploading(true);

        try {
            // Get user's current location
            const loc = await getUserLocation();
            setUserLocation(loc);

            // Find the mosque and check distance
            const mosque = mosques.find(m => m.id === mosqueId);
            if (!mosque) throw new Error("Masjid tidak ditemukan");

            const distance = haversineDistance(loc.lat, loc.lng, mosque.latitude, mosque.longitude);
            if (distance > CHECKIN_RADIUS_METERS) {
                const distStr = distance > 1000 ? `${(distance / 1000).toFixed(1)} km` : `${Math.round(distance)} m`;
                setCheckinError(`Kamu harus berada di dekat masjid untuk check-in (maks ${CHECKIN_RADIUS_METERS}m). Jarakmu saat ini: ${distStr}`);
                setLocationLoading(false);
                setCheckinUploading(false);
                return;
            }

            // Upload photo if present
            let photoUrl: string | null = null;
            if (checkinPhoto) {
                const formData = new FormData();
                formData.append("file", checkinPhoto);
                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });
                if (!uploadRes.ok) {
                    const err = await uploadRes.json();
                    throw new Error(err.error || "Gagal mengunggah foto");
                }
                const uploadData = await uploadRes.json();
                photoUrl = uploadData.url;
            }

            const res = await fetch("/api/checkin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mosqueId,
                    userLat: loc.lat,
                    userLng: loc.lng,
                    photoUrl,
                    caption: checkinCaption.trim() || null,
                }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Gagal check-in");
            }

            // Successful checkin interaction
            if (mosque) {
                setNewlyVisitedMosque(mosque);
            }
            setShowChecklistPopup(true);
            resetCheckinForm();

            // Remove from planned if it was planned
            const updatedPlans = plannedVisits.filter(p => p.mosqueId !== mosqueId);
            setPlannedVisits(updatedPlans);
            localStorage.setItem("plannedVisits", JSON.stringify(updatedPlans));

            await fetchJourney();
        } catch (error) {
            if (error instanceof Error) {
                setCheckinError(error.message);
            }
            console.error(error);
        } finally {
            setLocationLoading(false);
            setCheckinUploading(false);
        }
    };

    const handleSavePlan = () => {
        if (!selectedMosque || !planDate) return;
        const newPlan = { mosqueId: selectedMosque.id, date: planDate, reminder: planReminder };
        const updated = [...plannedVisits.filter(p => p.mosqueId !== selectedMosque.id), newPlan];
        setPlannedVisits(updated);
        localStorage.setItem("plannedVisits", JSON.stringify(updated));
        setShowPlanner(false);
        setSelectedMosque(null);
    };

    // Calculate Visit Order
    const visitOrderMap = useMemo(() => {
        const map = new Map<string, number>();
        const chronological = [...checkins].sort((a, b) => new Date(a.visitedAt).getTime() - new Date(b.visitedAt).getTime());

        let counter = 1;
        chronological.forEach(c => {
            if (!map.has(c.mosque.id)) {
                map.set(c.mosque.id, counter++);
            }
        });
        return map;
    }, [checkins]);

    const journeyPolyline = useMemo(() => {
        if (!checkins.length) return [];
        const chronological = [...checkins].sort((a, b) => new Date(a.visitedAt).getTime() - new Date(b.visitedAt).getTime());
        // Filter distinct to avoid drawing lines to the same place consecutively
        const uniquePath: [number, number][] = [];
        let lastId = "";
        for (const c of chronological) {
            if (c.mosque.id !== lastId) {
                uniquePath.push([c.mosque.latitude, c.mosque.longitude]);
                lastId = c.mosque.id;
            }
        }
        return uniquePath;
    }, [checkins]);

    const visitedMosqueIds = useMemo(() => new Set(checkins.map(c => c.mosque.id)), [checkins]);
    const plannedMosqueIds = useMemo(() => new Set(plannedVisits.map(p => p.mosqueId)), [plannedVisits]);

    const filteredMosques = useMemo(() => {
        if (activeFilter === "all") return mosques;
        if (activeFilter === "visited") return mosques.filter(m => visitedMosqueIds.has(m.id));
        if (activeFilter === "unvisited") return mosques.filter(m => !visitedMosqueIds.has(m.id));
        return mosques.filter(m => m.category === activeFilter);
    }, [mosques, activeFilter, visitedMosqueIds]);

    // Heatmap Grid Generation
    const heatmapGrid = useMemo(() => {
        if (viewMode !== "heatmap") return [];
        const grid = [];
        const latStep = (LAT_MAX - LAT_MIN) / GRID_ROWS;
        const lngStep = (LNG_MAX - LNG_MIN) / GRID_COLS;

        for (let r = 0; r < GRID_ROWS; r++) {
            for (let c = 0; c < GRID_COLS; c++) {
                const sLat = LAT_MIN + r * latStep;
                const eLat = sLat + latStep;
                const sLng = LNG_MIN + c * lngStep;
                const eLng = sLng + lngStep;

                // Count visited mosques in this cell
                let visitedCount = 0;
                checkins.forEach(ci => {
                    const m = ci.mosque;
                    if (m.latitude >= sLat && m.latitude < eLat && m.longitude >= sLng && m.longitude < eLng) {
                        visitedCount++;
                    }
                });

                if (visitedCount > 0) {
                    let color = "rgba(182, 222, 203, 0.4)"; // light emerald
                    if (visitedCount > 1) color = "rgba(42, 143, 99, 0.5)"; // medium emerald
                    if (visitedCount > 3) color = "rgba(22, 78, 54, 0.6)"; // deep emerald

                    grid.push({
                        bounds: [[sLat, sLng], [eLat, eLng]] as [[number, number], [number, number]],
                        color,
                        count: visitedCount
                    });
                }
            }
        }
        return grid;
    }, [viewMode, checkins]);

    const upcomingVisitDetails = useMemo(() => {
        return plannedVisits
            .map(p => ({
                ...p,
                mosque: mosques.find(m => m.id === p.mosqueId)
            }))
            .filter(p => p.mosque !== undefined)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 2);
    }, [plannedVisits, mosques]);

    return (
        <div className="map-wrapper relative">
            {/* View Mode Toggle */}
            <div className="absolute top-20 left-4 z-[1000] bg-white rounded-full p-1 shadow-[var(--shadow-md)] flex gap-1 border border-[var(--border-light)]">
                <button
                    onClick={() => setViewMode("journey")}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${viewMode === "journey" ? "bg-[var(--color-primary)] text-white" : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]"}`}
                >Jejak Journey</button>
                <button
                    onClick={() => setViewMode("heatmap")}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${viewMode === "heatmap" ? "bg-[var(--color-primary)] text-white" : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]"}`}
                >Heatmap</button>
            </div>

            {/* Filter Bar */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="absolute top-20 right-4 z-[1000] flex justify-center"
            >
                <div className="bg-white/90 backdrop-blur-md px-2 py-2 rounded-full border border-[var(--border-light)] shadow-md flex gap-1 overflow-x-auto max-w-[80vw]">
                    {[
                        { id: 'all', label: 'Semua' },
                        { id: 'visited', label: 'Dikunjungi' },
                        { id: 'unvisited', label: 'Belum' },
                    ].map(f => (
                        <button
                            key={f.id}
                            onClick={() => setActiveFilter(f.id)}
                            className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${activeFilter === f.id ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-medium)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] border border-transparent'}`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </motion.div>

            <MapContainer
                center={BANDUNG_CENTER}
                zoom={BANDUNG_ZOOM}
                className="map-container"
                scrollWheelZoom={true}
                zoomControl={false}
                maxBounds={BANDUNG_BOUNDS}
                maxBoundsViscosity={1.0}
                minZoom={12}
                maxZoom={18}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />

                {/* Heatmap Layer */}
                {viewMode === "heatmap" && heatmapGrid.map((cell, idx) => (
                    <Rectangle
                        key={idx}
                        bounds={cell.bounds}
                        pathOptions={{ color: "transparent", fillColor: cell.color, fillOpacity: 1 }}
                    >
                        <LeafletTooltip sticky className="font-serif text-sm font-bold text-[var(--color-primary-dark)]">
                            {cell.count} Kunjungan di area ini
                        </LeafletTooltip>
                    </Rectangle>
                ))}

                {/* Journey Path */}
                {viewMode === "journey" && journeyPolyline.length > 1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                        <Polyline
                            positions={journeyPolyline}
                            pathOptions={{
                                color: 'var(--color-primary)',
                                weight: 2.5,
                                opacity: 0.8,
                                dashArray: '6, 8',
                                lineCap: 'round',
                                lineJoin: 'round'
                            }}
                        />
                    </motion.div>
                )}

                {/* GPS Locate Control */}
                <LocateControl getUserLocation={getUserLocation} setUserLocation={setUserLocation} />

                {/* Tambah Masjid Control */}
                <div className="leaflet-bottom leaflet-right" style={{ marginBottom: "90px", marginRight: "16px", zIndex: 1000, position: "absolute", bottom: 0, right: 0 }}>
                    <div className="leaflet-control leaflet-bar border-none shadow-none">
                        <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowAddMosqueForm(true); }}
                            className="flex bg-[var(--color-primary)] text-white items-center justify-center w-12 h-12 shadow-[var(--shadow-md)] rounded-full transition-transform hover:scale-105"
                            title="Tambah Masjid Baru"
                        >
                            <Plus size={24} />
                        </button>
                    </div>
                </div>

                {/* User Location Marker */}
                {userLocation && (
                    <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon} />
                )}

                <MarkerClusterGroup chunkedLoading disableClusteringAtZoom={14}>
                    {filteredMosques.map((mosque) => {
                        const isVisited = visitedMosqueIds.has(mosque.id);
                        const isPlanned = plannedMosqueIds.has(mosque.id);
                        const order = visitOrderMap.get(mosque.id);

                        let icon = createMosqueIcon('unvisited');
                        if (isVisited && order) {
                            icon = createNumberedIcon(order);
                        } else if (isVisited) {
                            icon = createMosqueIcon('visited');
                        } else if (isPlanned) {
                            icon = createMosqueIcon('planned');
                        }

                        return (
                            <Marker
                                key={mosque.id}
                                position={[mosque.latitude, mosque.longitude]}
                                icon={icon}
                                eventHandlers={{
                                    click: () => {
                                        setSelectedMosque(mosque);
                                        setShowPlanner(false);
                                        resetCheckinForm();
                                    }
                                }}
                            />
                        );
                    })}
                </MarkerClusterGroup>
            </MapContainer>

            {/* Upcoming Visits Card */}
            {upcomingVisitDetails.length > 0 && !selectedMosque && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="upcoming-card">
                    <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3">Rencana Kunjungan</h3>
                    <div className="flex flex-col gap-3">
                        {upcomingVisitDetails.map((plan, i) => (
                            <div key={i} className="flex flex-col cursor-pointer hover:bg-[var(--bg-main)] p-2 rounded-lg transition-colors border border-transparent hover:border-[var(--border-light)]" onClick={() => setSelectedMosque(plan.mosque!)}>
                                <span className="text-[var(--text-primary)] font-bold text-sm tracking-tight leading-none">{plan.mosque?.name}</span>
                                <span className="text-[var(--color-primary)] text-xs font-medium mt-1">{new Date(plan.date).toLocaleDateString('id-ID', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Checklist Popup Overlay */}
            <AnimatePresence>
                {showChecklistPopup && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="checklist-popup-overlay"
                        onClick={() => setShowChecklistPopup(false)}
                    >
                        <motion.div
                            initial={{ y: 20, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.95 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="checklist-popup-card bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="text-center mb-6">
                                <motion.div initial={{ scale: 3, rotate: -20, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.2 }} className="text-5xl mb-2">
                                    🎯
                                </motion.div>
                                <h2 className="font-serif text-2xl text-[var(--text-primary)] mb-1">Kunjungan Tercatat</h2>
                                <p className="text-[var(--color-primary)] font-medium text-sm">Paspor Digital Distempel</p>
                            </div>

                            <div className="bg-[var(--bg-main)] border border-[var(--border-light)] rounded-xl p-4 mb-4">
                                <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3">Telah Dikunjungi ({visitedMosqueIds.size} / {mosques.length})</h3>
                                <div className="max-h-32 overflow-y-auto pr-2 flex flex-col gap-1">
                                    {mosques.filter(m => visitedMosqueIds.has(m.id)).map(m => (
                                        <div key={m.id} className="checklist-item">
                                            <div className="checklist-check visited"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
                                            <span className={m.id === newlyVisitedMosque?.id ? "font-bold text-[var(--color-primary)]" : "text-[var(--text-secondary)]"}>{m.name}</span>
                                            {m.id === newlyVisitedMosque?.id && <span className="ml-auto text-xs font-bold bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-2 py-0.5 rounded-full">Baru</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button onClick={() => router.push("/feed")} className="flex-1 py-3 bg-[var(--color-primary)] text-white rounded-xl font-medium tracking-wide hover:bg-[var(--color-primary-light)] transition-colors">
                                    📱 Lihat di Feed
                                </button>
                                <button onClick={() => setShowChecklistPopup(false)} className="flex-1 py-3 bg-[var(--bg-inverse)] text-white rounded-xl font-medium tracking-wide">
                                    Lanjutkan Eksplorasi
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom Sheet Drawer */}
            <AnimatePresence>
                {selectedMosque && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSelectedMosque(null)}
                            className="absolute inset-0 bg-black/10 backdrop-blur-[1px] z-[1001]"
                        />
                        <motion.div
                            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                            transition={{ type: "tween", ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
                            className="absolute bottom-0 left-0 right-0 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md bg-white rounded-t-[2rem] md:rounded-[2rem] md:bottom-6 z-[1002] shadow-[var(--shadow-floating)] p-8 overflow-hidden flex flex-col gap-6"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="font-serif text-3xl font-normal text-[var(--text-primary)] mb-1 tracking-tight">
                                        {selectedMosque.name}
                                    </h2>
                                    <p className="text-[var(--text-secondary)] font-medium text-md flex items-center gap-1.5">
                                        {selectedMosque.city}, {selectedMosque.province}
                                    </p>
                                </div>
                                <button onClick={() => setSelectedMosque(null)} className="p-2 bg-[var(--bg-main)] rounded-full text-[var(--text-secondary)] hover:bg-[var(--border-medium)] transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                </button>
                            </div>

                            <div className="w-full h-40 rounded-2xl overflow-hidden bg-[var(--bg-main)] relative border border-[var(--border-light)]">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={(selectedMosque as Record<string, unknown>).imageUrl as string || MOSQUE_IMAGES[selectedMosque.category] || MOSQUE_IMAGES.general}
                                    alt={selectedMosque.name}
                                    className="w-full h-full object-cover"
                                />
                                {visitedMosqueIds.has(selectedMosque.id) && (
                                    <div className="absolute top-3 right-3 bg-[var(--color-primary)] text-white px-3 py-1.5 rounded-full font-bold text-xs shadow-sm flex items-center gap-1.5">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        Dikunjungi #{visitOrderMap.get(selectedMosque.id)}
                                    </div>
                                )}
                            </div>

                            {showPlanner ? (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-[var(--bg-main)] border border-[var(--border-medium)] rounded-2xl p-5 flex flex-col gap-4">
                                    <h3 className="font-serif text-lg text-[var(--text-primary)]">Rencanakan Kunjungan</h3>
                                    <div>
                                        <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Tanggal Berpelesir</label>
                                        <input type="date" value={planDate} onChange={e => setPlanDate(e.target.value)} className="w-full bg-white border border-[var(--border-medium)] rounded-xl px-4 py-3 text-[var(--text-primary)] font-medium outline-none focus:border-[var(--color-primary)]" />
                                    </div>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" checked={planReminder} onChange={e => setPlanReminder(e.target.checked)} className="w-5 h-5 rounded border-[var(--border-medium)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
                                        <span className="text-sm font-medium text-[var(--text-secondary)]">Ingatkan saya sebelum kunjungan</span>
                                    </label>
                                    <div className="flex gap-2 mt-2">
                                        <button onClick={() => setShowPlanner(false)} className="flex-1 py-3 bg-white border border-[var(--border-medium)] rounded-xl font-medium text-[var(--text-primary)]">Batal</button>
                                        <button onClick={handleSavePlan} disabled={!planDate} className="flex-1 py-3 bg-[var(--text-primary)] text-white rounded-xl font-medium disabled:opacity-50">Simpan Rencana</button>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {checkinError && (
                                        <div className="w-full py-3 px-4 rounded-xl text-sm bg-red-50 text-red-600 border border-red-200 flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                                            {checkinError}
                                        </div>
                                    )}
                                    {!visitedMosqueIds.has(selectedMosque.id) && !showCheckinForm && (
                                        <button
                                            onClick={() => setShowCheckinForm(true)}
                                            className="w-full py-4 rounded-xl font-medium text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-[var(--shadow-sm)] bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-light)]"
                                        >
                                            📍 Tambah ke Paspor
                                        </button>
                                    )}
                                    {!visitedMosqueIds.has(selectedMosque.id) && showCheckinForm && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            className="bg-[var(--bg-main)] border border-[var(--border-medium)] rounded-2xl p-4 flex flex-col gap-3"
                                        >
                                            {/* Photo picker */}
                                            <input
                                                ref={photoInputRef}
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp"
                                                className="hidden"
                                                onChange={handlePhotoSelect}
                                            />
                                            {checkinPhotoPreview ? (
                                                <div className="relative w-full h-36 rounded-xl overflow-hidden border border-[var(--border-light)]">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={checkinPhotoPreview} alt="Preview" className="w-full h-full object-cover" />
                                                    <button
                                                        onClick={removePhoto}
                                                        className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                                                    >
                                                        <XIcon size={14} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => photoInputRef.current?.click()}
                                                    className="w-full h-24 rounded-xl border-2 border-dashed border-[var(--border-medium)] bg-white flex flex-col items-center justify-center gap-1.5 text-[var(--text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
                                                >
                                                    <Camera size={22} />
                                                    <span className="text-xs font-medium">Tambah Foto (opsional)</span>
                                                </button>
                                            )}

                                            {/* Caption */}
                                            <div className="relative">
                                                <textarea
                                                    value={checkinCaption}
                                                    onChange={(e) => setCheckinCaption(e.target.value.slice(0, 280))}
                                                    placeholder="Tulis catatan singkat... (opsional)"
                                                    rows={2}
                                                    className="w-full bg-white border border-[var(--border-medium)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--color-primary)] resize-none placeholder:text-[var(--text-muted)]"
                                                />
                                                <span className="absolute bottom-2 right-3 text-[10px] text-[var(--text-muted)]">
                                                    {checkinCaption.length}/280
                                                </span>
                                            </div>

                                            {/* Action buttons */}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => { resetCheckinForm(); setCheckinError(null); }}
                                                    className="flex-1 py-3 bg-white border border-[var(--border-medium)] rounded-xl font-medium text-[var(--text-primary)] text-sm"
                                                >
                                                    Batal
                                                </button>
                                                <button
                                                    onClick={() => handleCheckIn(selectedMosque.id)}
                                                    disabled={locationLoading || checkinUploading}
                                                    className="flex-1 py-3 bg-[var(--color-primary)] text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-wait"
                                                >
                                                    {locationLoading || checkinUploading ? (
                                                        <><svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg> {checkinUploading && checkinPhoto ? "Mengunggah..." : "Memverifikasi..."}</>
                                                    ) : (
                                                        <>{checkinPhoto ? <ImageIcon size={16} /> : <>📍</>} Check-in</>
                                                    )}
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                    {!visitedMosqueIds.has(selectedMosque.id) && !plannedMosqueIds.has(selectedMosque.id) && !showCheckinForm && (
                                        <button onClick={() => setShowPlanner(true)} className="w-full py-4 rounded-xl font-medium text-lg flex items-center justify-center gap-2 border border-[var(--border-medium)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--bg-main)] transition-colors">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                            Rencanakan Kunjungan
                                        </button>
                                    )}
                                    {plannedMosqueIds.has(selectedMosque.id) && !visitedMosqueIds.has(selectedMosque.id) && (
                                        <div className="w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 border border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent-dark)]">
                                            ✓ Kunjungan Telah Direncanakan
                                        </div>
                                    )}
                                    <a
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${selectedMosque.latitude},${selectedMosque.longitude}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-3 mt-2 rounded-xl font-medium text-sm flex items-center justify-center gap-2 border border-[var(--border-medium)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:bg-[var(--border-light)] transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>
                                        Arahkan (Google Maps)
                                    </a>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Add Mosque Modal */}
            <AnimatePresence>
                {showAddMosqueForm && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowAddMosqueForm(false)}
                            className="absolute inset-0 bg-black/10 backdrop-blur-[1px] z-[1001]"
                        />
                        <motion.div
                            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                            transition={{ type: "tween", ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
                            className="absolute bottom-0 left-0 right-0 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md bg-white rounded-t-[2rem] md:rounded-[2rem] md:bottom-6 z-[1002] shadow-[var(--shadow-floating)] p-8 overflow-hidden flex flex-col gap-6"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="font-serif text-2xl font-normal text-[var(--text-primary)] mb-1 tracking-tight">
                                        Tambah Masjid Baru
                                    </h2>
                                    <p className="text-[var(--text-secondary)] font-medium text-sm">
                                        Masjid ini akan otomatis ditambahkan ke koordinat Anda saat ini dan Anda akan langsung check-in.
                                    </p>
                                </div>
                                <button onClick={() => setShowAddMosqueForm(false)} className="p-2 bg-[var(--bg-main)] rounded-full text-[var(--text-secondary)] hover:bg-[var(--border-medium)] transition-colors">
                                    <XIcon size={20} />
                                </button>
                            </div>

                            <div className="flex flex-col gap-4">
                                {checkinError && (
                                    <div className="w-full py-3 px-4 rounded-xl text-sm bg-red-50 text-red-600 border border-red-200">
                                        {checkinError}
                                    </div>
                                )}
                                <div>
                                    <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Nama Masjid / Musholla</label>
                                    <input
                                        type="text"
                                        value={newMosqueName}
                                        onChange={e => setNewMosqueName(e.target.value)}
                                        placeholder="cth: Musholla Al-Ikhlas"
                                        className="w-full bg-white border border-[var(--border-medium)] rounded-xl px-4 py-3 text-[var(--text-primary)] font-medium outline-none focus:border-[var(--color-primary)]"
                                    />
                                </div>

                                <div className="flex gap-2 mt-2">
                                    <button onClick={() => setShowAddMosqueForm(false)} className="flex-1 py-3 bg-white border border-[var(--border-medium)] rounded-xl font-medium text-[var(--text-primary)]">Batal</button>
                                    <button
                                        onClick={handleAddMosque}
                                        disabled={!newMosqueName.trim() || addMosqueLoading}
                                        className="flex-1 py-3 bg-[var(--color-primary)] text-white rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {addMosqueLoading ? "Menyimpan..." : "Tambah & Check-in"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
