import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const { pathname } = req.nextUrl;

    // Protected routes
    const protectedPaths = ["/journey", "/api/checkin", "/api/recap"];
    const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

    if (isProtected && !req.auth) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/journey/:path*", "/api/checkin/:path*", "/api/recap/:path*"],
};
