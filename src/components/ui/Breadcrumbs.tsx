"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const ROUTE_LABELS: Record<string, string> = {
    "": "Beranda",
    map: "Peta Masjid",
    feed: "Feed",
    journey: "Perjalanan",
    passport: "Passport",
    recap: "Recap",
    wrapped: "Wrapped",
    profile: "Profil",
    login: "Masuk",
    signup: "Daftar",
    tentang: "Tentang",
};

export default function Breadcrumbs() {
    const pathname = usePathname();

    if (!pathname || pathname === "/") return null;

    const segments = pathname.split("/").filter(Boolean);

    const crumbs = [
        { label: "Beranda", href: "/" },
        ...segments.map((seg, i) => ({
            label: ROUTE_LABELS[seg] || seg.charAt(0).toUpperCase() + seg.slice(1),
            href: "/" + segments.slice(0, i + 1).join("/"),
        })),
    ];

    // BreadcrumbList JSON-LD
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((crumb, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: crumb.label,
            item: `https://jejak-masjid-62zo.vercel.app${crumb.href}`,
        })),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <nav aria-label="Breadcrumb" className="breadcrumb-nav">
                <ol className="breadcrumb-list">
                    {crumbs.map((crumb, i) => {
                        const isLast = i === crumbs.length - 1;
                        return (
                            <li key={crumb.href} className="breadcrumb-item">
                                {i > 0 && (
                                    <ChevronRight
                                        size={14}
                                        className="breadcrumb-separator"
                                        aria-hidden="true"
                                    />
                                )}
                                {isLast ? (
                                    <span className="breadcrumb-current" aria-current="page">
                                        {crumb.label}
                                    </span>
                                ) : (
                                    <Link href={crumb.href} className="breadcrumb-link">
                                        {crumb.label}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </nav>
        </>
    );
}
