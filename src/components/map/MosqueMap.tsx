"use client";

import dynamic from "next/dynamic";

// Leaflet must be dynamically imported (no SSR) because it requires `window`
const MosqueMapInner = dynamic(() => import("./MosqueMapInner"), {
    ssr: false,
    loading: () => (
        <div className="map-loading">
            <div className="map-loading-spinner"></div>
            <p>Memuat peta...</p>
        </div>
    ),
});

export default function MosqueMap() {
    return <MosqueMapInner />;
}
