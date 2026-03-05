"use client";

export default function JourneyStats({ checkins }: { checkins: any[] }) {
    const uniqueMosques = new Set(checkins.map(c => c.mosque.id)).size;
    const uniqueCities = new Set(checkins.map(c => c.mosque.city)).size;

    // Simple streak calculation (consecutive days including today or yesterday)
    let streak = 0;
    if (checkins.length > 0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let currentDate = new Date(today);

        // Check if they checked in today or yesterday
        const lastCheckinDate = new Date(checkins[0].visitedAt);
        lastCheckinDate.setHours(0, 0, 0, 0);

        const diffTime = Math.abs(today.getTime() - lastCheckinDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 1) {
            streak = 1;
            let expectedDate = new Date(lastCheckinDate);

            // Count backwards
            for (let i = 1; i < checkins.length; i++) {
                const checkDate = new Date(checkins[i].visitedAt);
                checkDate.setHours(0, 0, 0, 0);

                const dayDiff = Math.round((expectedDate.getTime() - checkDate.getTime()) / (1000 * 60 * 60 * 24));

                if (dayDiff === 0) {
                    // Same day, ignore
                    continue;
                } else if (dayDiff === 1) {
                    // Consecutive day
                    streak++;
                    expectedDate = new Date(checkDate);
                } else {
                    // Streak broken
                    break;
                }
            }
        }
    }

    return (
        <div className="stats-grid" style={{ marginBottom: '2rem' }}>
            <div className="stat-card">
                <div className="stat-value">{uniqueMosques}</div>
                <div className="stat-label">Masjid Dikunjungi</div>
            </div>
            <div className="stat-card">
                <div className="stat-value">{uniqueCities}</div>
                <div className="stat-label">Kota Dijelajahi</div>
            </div>
            <div className="stat-card">
                <div className="stat-value">{streak} 🔥</div>
                <div className="stat-label">Hari Beruntun (Streak)</div>
            </div>
        </div>
    );
}
