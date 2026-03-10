import { NextResponse } from "next/server";

const INDEXNOW_KEY = "c7ef6794d8ee40d8930029efe18eb75b";
const HOST = "jejak-masjid-62zo.vercel.app";

const ALL_URLS = [
    `https://${HOST}/`,
    `https://${HOST}/map`,
    `https://${HOST}/feed`,
    `https://${HOST}/journey`,
    `https://${HOST}/passport`,
    `https://${HOST}/recap`,
    `https://${HOST}/wrapped`,
    `https://${HOST}/tentang`,
    `https://${HOST}/artikel/panduan-itikaf`,
];

export async function GET() {
    const results = [];

    // Submit to IndexNow (Bing, Yandex, Seznam, Naver)
    for (const engine of [
        "https://api.indexnow.org/indexnow",
        "https://www.bing.com/indexnow",
        "https://yandex.com/indexnow",
    ]) {
        try {
            const res = await fetch(engine, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    host: HOST,
                    key: INDEXNOW_KEY,
                    keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
                    urlList: ALL_URLS,
                }),
            });
            results.push({
                engine,
                status: res.status,
                ok: res.ok,
            });
        } catch (error) {
            results.push({
                engine,
                status: "error",
                message: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }

    return NextResponse.json({
        submitted: ALL_URLS.length,
        urls: ALL_URLS,
        results,
        timestamp: new Date().toISOString(),
    });
}
