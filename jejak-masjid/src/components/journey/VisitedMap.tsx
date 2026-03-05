"use client";
import dynamic from "next/dynamic";

const VisitedMapInner = dynamic(() => import("./VisitedMapInner"), {
    ssr: false,
    loading: () => <div className="visited-map-loading map-loading-spinner mx-auto my-10"></div>
});

export default function VisitedMap({ checkins }: { checkins: any[] }) {
    // Client wrapper around the raw leaflet component
    return <VisitedMapInner checkins={checkins} />;
}
