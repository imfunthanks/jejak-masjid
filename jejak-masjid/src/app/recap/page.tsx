"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function RecapPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login?callbackUrl=/recap");
        }
    }, [status, router]);

    if (status === "loading" || status === "unauthenticated") {
        return (
            <div className="container" style={{ display: "flex", justifyContent: "center", paddingTop: "5rem" }}>
                <div className="map-loading-spinner"></div>
            </div>
        );
    }

    const recapImageUrl = "/api/recap";

    // Custom share message
    const shareText = encodeURIComponent(
        `Alhamdulillah! Ini adalah rekap perjalanan kunjunganku ke masjid-masjid selama bulan Ramadan ini bersama Jejak Masjid 🕌✨\n\nBuat rekap perjalananmu sendiri di:`
    );
    const siteUrl = encodeURIComponent(`https://jejak-masjid.vercel.app`);

    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${siteUrl}`;
    const whatsappShareUrl = `https://wa.me/?text=${shareText}%20${siteUrl}`;

    const handleDownload = async () => {
        try {
            const response = await fetch(recapImageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `JejakMasjid_Recap_${session?.user?.name || "User"}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download failed", err);
            alert("Gagal mengunduh gambar. Silakan coba lagi.");
        }
    };

    return (
        <div className="container recap-page-container">
            <div className="recap-header">
                <h1 className="recap-title">Kartu Rekapitulasi Anda</h1>
                <p className="recap-subtitle">Simpan dan bagikan momen spiritual Anda selama bulan suci ini.</p>
            </div>

            <div className="recap-content">
                <div className="recap-image-wrapper">
                    {!imageLoaded && (
                        <div className="recap-image-placeholder">
                            <div className="map-loading-spinner"></div>
                            <p>Membuat kartu Anda...</p>
                        </div>
                    )}

                    <Image
                        src={recapImageUrl}
                        alt="Jejak Masjid Recap Card"
                        width={1080}
                        height={1080}
                        className={`recap-image ${imageLoaded ? "loaded" : "loading"}`}
                        onLoad={() => setImageLoaded(true)}
                        unoptimized // next/og generates dynamic images, skip standard optimization
                    />
                </div>

                <div className="recap-actions">
                    <h3 className="recap-actions-title">Bagikan Perjalananmu</h3>

                    <button onClick={handleDownload} className="btn btn-primary recap-action-btn">
                        ⬇️ Unduh Gambar (PNG)
                    </button>

                    <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer" className="btn recap-action-btn twitter-btn">
                        🐦 Bagikan ke X (Twitter)
                    </a>

                    <a href={whatsappShareUrl} target="_blank" rel="noopener noreferrer" className="btn recap-action-btn whatsapp-btn">
                        📱 Bagikan ke WhatsApp
                    </a>

                    <Link href="/journey" className="btn btn-outline recap-action-btn mt-4">
                        ← Kembali ke Dasbor
                    </Link>
                </div>
            </div>
        </div>
    );
}
