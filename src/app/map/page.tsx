import MosqueMap from "@/components/map/MosqueMap";

export const metadata = {
    title: "Peta Masjid — Jejak Masjid",
    description: "Jelajahi masjid-masjid di Indonesia dalam peta interaktif.",
};

export default function MapPage() {
    return (
        <div className="map-page">
            <MosqueMap />
        </div>
    );
}
