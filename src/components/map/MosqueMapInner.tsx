"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MapContainer, TileLayer, Marker, Polyline, Rectangle, Tooltip as LeafletTooltip } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Mosque } from "@/lib/db/schema";
import { motion, AnimatePresence } from "framer-motion";

// Default Unvisited Marker (Neutral)
const defaultIcon = L.divIcon({
    className: "custom-leaflet-marker",
    html: `
        <div style="background-color: var(--bg-main); border: 2px solid var(--text-muted); width: 20px; height: 20px; border-radius: 50%; box-shadow: var(--shadow-sm); position: relative;">
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 6px; height: 6px; background-color: var(--text-muted); border-radius: 50%;"></div>
            <div class="marker-pulse-ring"></div>
        </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
});

// Planned Marker (Gold + Clock)
const plannedIcon = L.divIcon({
    className: "custom-leaflet-marker",
    html: `
        <div class="planned-marker">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
});

// Dynamic Numbered Icon Factory
const createNumberedIcon = (number: number) => L.divIcon({
    className: "custom-leaflet-marker",
    html: `<div class="numbered-marker">${number}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
});

// Category-specific colors

// Bandung center coordinates
const BANDUNG_CENTER: [number, number] = [-6.9147, 107.6098];
const BANDUNG_ZOOM = 13;

// Mock mosques scoped to Bandung area
const MOCK_MOSQUES = [
    { id: "m1", name: "Masjid Raya Bandung", city: "Bandung", province: "Jawa Barat", latitude: -6.9218, longitude: 107.6070, category: "historic", createdAt: new Date() },
    { id: "m2", name: "Masjid Salman ITB", city: "Bandung", province: "Jawa Barat", latitude: -6.8934, longitude: 107.6102, category: "campus", createdAt: new Date() },
    { id: "m3", name: "Pusdai Jawa Barat", city: "Bandung", province: "Jawa Barat", latitude: -6.8996, longitude: 107.6322, category: "iconic", createdAt: new Date() },
    { id: "m4", name: "Masjid Raya Al Jabbar", city: "Bandung", province: "Jawa Barat", latitude: -6.9458, longitude: 107.7027, category: "iconic", createdAt: new Date() },
    { id: "m5", name: "Masjid Al-Ukhuwwah", city: "Bandung", province: "Jawa Barat", latitude: -6.9126, longitude: 107.6080, category: "historic", createdAt: new Date() },
    { id: "m6", name: "Masjid Trans Studio", city: "Bandung", province: "Jawa Barat", latitude: -6.9261, longitude: 107.6366, category: "iconic", createdAt: new Date() },
    { id: "m7", name: "Masjid Lautze 2", city: "Bandung", province: "Jawa Barat", latitude: -6.9189, longitude: 107.6186, category: "historic", createdAt: new Date() },
    { id: "m8", name: "Masjid Cipaganti", city: "Bandung", province: "Jawa Barat", latitude: -6.9080, longitude: 107.6015, category: "historic", createdAt: new Date() },
    { id: "m9", name: "Masjid Al-Imtizaj", city: "Bandung", province: "Jawa Barat", latitude: -6.9185, longitude: 107.6054, category: "historic", createdAt: new Date() },
    { id: "m10", name: "Masjid Al-Lathiif", city: "Bandung", province: "Jawa Barat", latitude: -6.9056, longitude: 107.6318, category: "general", createdAt: new Date() },
    { id: "m11", name: "Masjid Daarut Tauhiid", city: "Bandung", province: "Jawa Barat", latitude: -6.8654, longitude: 107.5898, category: "iconic", createdAt: new Date() },
    { id: "m12", name: "Masjid Istiqamah", city: "Bandung", province: "Jawa Barat", latitude: -6.9046, longitude: 107.6163, category: "historic", createdAt: new Date() },
    { id: "m13", name: "Masjid Al-Furqon UPI", city: "Bandung", province: "Jawa Barat", latitude: -6.8601, longitude: 107.5902, category: "campus", createdAt: new Date() },
    { id: "m14", name: "Masjid Al-Multazam", city: "Bandung", province: "Jawa Barat", latitude: -6.8837, longitude: 107.5954, category: "general", createdAt: new Date() },
    { id: "m15", name: "Masjid At-Taqwa", city: "Bandung", province: "Jawa Barat", latitude: -6.9103, longitude: 107.6369, category: "general", createdAt: new Date() },
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

    // View modes
    const [activeFilter, setActiveFilter] = useState<string>("all");
    const [viewMode, setViewMode] = useState<"journey" | "heatmap">("journey");
    const [showChecklistPopup, setShowChecklistPopup] = useState(false);
    const [newlyVisitedMosque, setNewlyVisitedMosque] = useState<Mosque | null>(null);

    const { data: session } = useSession();
    const router = useRouter();

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

    const handleCheckIn = async (mosqueId: string) => {
        if (!session) {
            router.push("/login?callbackUrl=/map");
            return;
        }

        try {
            const res = await fetch("/api/checkin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mosqueId }),
            });
            if (!res.ok) throw new Error("Gagal check-in");

            // Successful checkin interaction
            const mosque = mosques.find(m => m.id === mosqueId);
            if (mosque) {
                setNewlyVisitedMosque(mosque);
            }
            setShowChecklistPopup(true);

            // Remove from planned if it was planned
            const updatedPlans = plannedVisits.filter(p => p.mosqueId !== mosqueId);
            setPlannedVisits(updatedPlans);
            localStorage.setItem("plannedVisits", JSON.stringify(updatedPlans));

            await fetchJourney();
        } catch (error) {
            console.error(error);
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
            <div className="absolute top-4 left-4 z-[1000] bg-white rounded-full p-1 shadow-[var(--shadow-md)] flex gap-1 border border-[var(--border-light)]">
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
                className="absolute top-4 right-4 z-[1000] flex justify-center"
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

                <MarkerClusterGroup chunkedLoading disableClusteringAtZoom={14}>
                    {filteredMosques.map((mosque) => {
                        const isVisited = visitedMosqueIds.has(mosque.id);
                        const isPlanned = plannedMosqueIds.has(mosque.id);
                        const order = visitOrderMap.get(mosque.id);

                        let icon = defaultIcon;
                        if (isVisited && order) {
                            icon = createNumberedIcon(order);
                        } else if (isPlanned && !isVisited) {
                            icon = plannedIcon;
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

                            <button onClick={() => setShowChecklistPopup(false)} className="w-full py-3 bg-[var(--bg-inverse)] text-white rounded-xl font-medium tracking-wide">
                                Lanjutkan Eksplorasi
                            </button>
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

                            <div className="w-full h-40 rounded-2xl overflow-hidden bg-[var(--bg-main)] relative flex items-center justify-center border border-[var(--border-light)]">
                                <span className="text-4xl opacity-50">🕌</span>
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
                                    {!visitedMosqueIds.has(selectedMosque.id) && (
                                        <button onClick={() => handleCheckIn(selectedMosque.id)} className="w-full py-4 rounded-xl font-medium text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-[var(--shadow-sm)] bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-light)]">
                                            Tambah ke Paspor
                                        </button>
                                    )}
                                    {!visitedMosqueIds.has(selectedMosque.id) && !plannedMosqueIds.has(selectedMosque.id) && (
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
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
