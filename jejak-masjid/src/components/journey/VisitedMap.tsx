"use client";
import dynamic from "next/dynamic";

type CheckinData = {
    mosque: {
        id: string;
        name: string;
        latitude: number;
        longitude: number;
    }
};

const VisitedMapInner = dynamic<{ checkins: CheckinData[] }>(() => import("./VisitedMapInner"), {
    ssr: false,
    loading: () => <div className="visited-map-loading map-loading-spinner mx-auto my-10"></div>
});

export default function VisitedMap({ checkins }: { checkins: CheckinData[] }) {
    // Client wrapper around the raw leaflet component
    return <VisitedMapInner checkins={checkins} />;
}
