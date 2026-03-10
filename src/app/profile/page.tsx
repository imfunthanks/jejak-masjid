import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Profil",
    description: "Profil pengguna Jejak Masjid — lihat dan kelola akun perjalanan masjidmu.",
};

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] pt-24 px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="title-font text-4xl font-bold text-[var(--color-primary-dark)] mb-4">Profile</h1>
                <p className="text-[var(--text-secondary)]">Feature coming soon.</p>
            </div>
        </div>
    );
}
