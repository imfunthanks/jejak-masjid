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
        <div className="checkin-list">
            <h2 className="section-title">Riwayat Kunjungan</h2>
            <div className="checkin-items">
                {checkins.map((checkin) => (
                    <div key={checkin.id} className="checkin-item">
                        <div className="checkin-date">
                            {new Date(checkin.visitedAt).toLocaleDateString('id-ID', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </div>
                        <div className="checkin-details">
                            <h4 className="checkin-mosque-name">{checkin.mosque.name}</h4>
                            <p className="checkin-mosque-location">{checkin.mosque.city}, {checkin.mosque.province}</p>
                        </div>
                        <div className="checkin-badge">
                            {checkin.mosque.category}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
