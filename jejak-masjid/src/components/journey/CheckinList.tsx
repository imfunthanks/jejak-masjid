"use client";

// Define inline type since we're passing joined data
type CheckinData = {
    id: string;
    visitedAt: Date;
    mosque: {
        id: string;
        name: string;
        city: string;
        province: string;
        category: string;
    }
};

export default function CheckinList({ checkins }: { checkins: CheckinData[] }) {
    if (checkins.length === 0) {
        return (
            <div className="empty-state">
                <span className="empty-icon">🕌</span>
                <h3 className="empty-title">Belum ada jejak masjid</h3>
                <p className="empty-desc">Mulai perjalananmu dengan check-in di masjid yang kamu kunjungi hari ini.</p>
            </div>
        );
    }

    return (
        <div className="checkin-container mb-8">
            <h2 className="section-title">Riwayat Kunjungan</h2>
            <div className="timeline-list mt-6">
                {checkins.map((checkin) => (
                    <div key={checkin.id} className="timeline-item">
                        <div className="timeline-dot"></div>
                        <div className="checkin-card">
                            <div className="checkin-details flex-1">
                                <h4 className="font-bold text-lg text-[var(--text-primary)] title-font mb-1">{checkin.mosque.name}</h4>
                                <p className="text-sm text-[var(--text-secondary)] mb-2">
                                    {checkin.mosque.city}, {checkin.mosque.province}
                                </p>
                                <div className="text-xs font-semibold text-[color:var(--text-muted)]">
                                    {new Date(checkin.visitedAt).toLocaleDateString('id-ID', {
                                        weekday: 'short',
                                        day: 'numeric',
                                        month: 'short',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>
                            <div className="checkin-badge-wrapper ml-4">
                                <span className="inline-block px-3 py-1 bg-[color:var(--bg-main)] text-[color:var(--color-primary-light)] rounded-full text-xs font-bold uppercase tracking-wide border border-[color:var(--border-light)] shadow-sm">
                                    {checkin.mosque.category}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
