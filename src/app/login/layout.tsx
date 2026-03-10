import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Masuk",
    description: "Masuk ke akun Jejak Masjid untuk melanjutkan perjalanan masjid Ramadanmu.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
