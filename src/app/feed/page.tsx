import FeedClient from "./FeedClient";

export const metadata = {
    title: "Feed — Jejak Masjid",
    description: "Lihat aktivitas terbaru kunjungan masjid dari komunitas.",
};

export default function FeedPage() {
    return <FeedClient />;
}
