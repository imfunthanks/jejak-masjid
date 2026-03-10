import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Daftar",
    description: "Daftar akun Jejak Masjid dan mulai lacak perjalanan masjid Ramadanmu.",
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
