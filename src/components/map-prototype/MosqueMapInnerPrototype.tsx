"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Navigation2, X } from "lucide-react";

// Fake Data
const mockMosques = [
    { id: 1, name: "Istiqlal Grand Mosque", city: "Jakarta", lat: -6.1701, lng: 106.8310, image: "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&q=80&w=800", isVisited: true },
    { id: 2, name: "Al-Azhar Great Mosque", city: "Jakarta Selatan", lat: -6.2355, lng: 106.7997, image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=800", isVisited: false },
    { id: 3, name: "Sunda Kelapa Mosque", city: "Jakarta Pusat", lat: -6.2023, lng: 106.8316, image: "https://images.unsplash.com/photo-1618641986557-124b89adcd04?auto=format&fit=crop&q=80&w=800", isVisited: false },
];

// Custom Icons
const defaultIcon = new L.DivIcon({
    className: "custom-leaflet-marker",
    html: `<div style="width: 24px; height: 24px; background-color: white; border: 3px solid var(--color-primary); border-radius: 50%; box-shadow: var(--shadow-md);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
});

const visitedIcon = new L.DivIcon({
    className: "custom-leaflet-marker",
    html: `<div style="width: 28px; height: 28px; background-color: var(--color-accent); border: 3px solid white; border-radius: 50%; box-shadow: var(--shadow-md); display: flex; align-items: center; justify-content: center;"><span style="color: white; font-size: 14px;">✓</span></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
});


export default function MosqueMapInnerPrototype() {
    const [selectedMosque, setSelectedMosque] = useState<typeof mockMosques[0] | null>(null);

    return (
        <>
            <MapContainer
                center={[-6.2000, 106.8166]}
                zoom={12}
                style={{ height: "100%", width: "100%" }}
                zoomControl={false} // Disable default zoom to position manually if needed
                className="z-0"
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />

                {mockMosques.map((mosque) => (
                    <Marker
                        key={mosque.id}
                        position={[mosque.lat, mosque.lng]}
                        icon={mosque.isVisited ? visitedIcon : defaultIcon}
                        eventHandlers={{
                            click: () => {
                                setSelectedMosque(mosque);
                            },
                        }}
                    />
                ))}
            </MapContainer>

            {/* Bottom Sheet Drawer using Framer Motion */}
            <AnimatePresence>
                {selectedMosque && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedMosque(null)}
                            className="absolute inset-0 bg-black/20 backdrop-blur-[2px] z-[1001]"
                        />

                        {/* Bottom Sheet Card */}
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="absolute bottom-0 left-0 right-0 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-xl bg-white rounded-t-[var(--radius-xl)] md:rounded-[var(--radius-xl)] md:bottom-6 z-[1002] shadow-[var(--shadow-floating)] p-6 overflow-hidden flex flex-col gap-6 border-t md:border border-[var(--border-light)]"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="title-font text-3xl font-bold text-[var(--color-primary-dark)] mb-1">
                                        {selectedMosque.name}
                                    </h2>
                                    <p className="text-[var(--text-secondary)] font-medium text-lg flex items-center gap-1">
                                        <Navigation2 size={16} /> {selectedMosque.city}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedMosque(null)}
                                    className="p-2 bg-[var(--bg-main)] rounded-full text-[var(--text-secondary)] hover:bg-[var(--border-light)] transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Photo Area */}
                            <div className="w-full h-48 rounded-[var(--radius-lg)] overflow-hidden bg-[var(--bg-main)] relative">
                                <img
                                    src={selectedMosque.image}
                                    alt={selectedMosque.name}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                />

                                {selectedMosque.isVisited && (
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[var(--color-primary-dark)] font-bold text-sm shadow-[var(--shadow-md)] flex items-center gap-2">
                                        <CheckCircle2 size={18} className="text-[var(--color-primary)]" />
                                        Visited
                                    </div>
                                )}
                            </div>

                            {/* Massive CTA */}
                            <button
                                className={`w-full py-5 rounded-[var(--radius-pill)] font-bold text-xl flex items-center justify-center gap-3 transition-all duration-300 shadow-[var(--shadow-md)] ${selectedMosque.isVisited
                                        ? "bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-light)] cursor-not-allowed"
                                        : "bg-[var(--color-primary)] text-white hover:translate-y-[-2px] hover:shadow-[var(--shadow-lg)]"
                                    }`}
                            >
                                {selectedMosque.isVisited ? "Already Checked In" : "Check In Here"}
                            </button>

                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
