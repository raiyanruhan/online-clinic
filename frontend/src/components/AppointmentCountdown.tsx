import { useEffect, useState } from 'react';

interface AppointmentCountdownProps {
    date: string;
    time: string;
    meetingLink?: string;
    onJoinTime?: () => void;
}

const AppointmentCountdown = ({ date, time, meetingLink, onJoinTime }: AppointmentCountdownProps) => {
    const [timeRemaining, setTimeRemaining] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
    const [hasTriggered, setHasTriggered] = useState(false);

    useEffect(() => {
        const updateCountdown = () => {
            const appointmentDate = new Date(date);
            const timeStr = time.toString();
            const [hours, minutes] = timeStr.substring(0, 5).split(':').map(Number);
            appointmentDate.setHours(hours, minutes, 0, 0);

            const now = new Date();
            const diff = appointmentDate.getTime() - now.getTime();
            const tenMinutesInMs = 10 * 60 * 1000; // 10 minutes in milliseconds

            // Don't show countdown if more than 10 minutes past appointment time
            if (diff < -tenMinutesInMs) {
                setTimeRemaining(null);
                return;
            }

            if (diff <= 0) {
                setTimeRemaining({ hours: 0, minutes: 0, seconds: 0 });
                // Only trigger if within 10 minutes after appointment time
                if (diff >= -tenMinutesInMs && meetingLink && onJoinTime && !hasTriggered) {
                    setHasTriggered(true);
                    onJoinTime();
                }
                return;
            }

            const hoursRemaining = Math.floor(diff / (1000 * 60 * 60));
            const minutesRemaining = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secondsRemaining = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeRemaining({ hours: hoursRemaining, minutes: minutesRemaining, seconds: secondsRemaining });

            // Trigger join animation when within 10 seconds (and not more than 10 mins past)
            if (diff <= 10000 && diff > 0 && meetingLink && onJoinTime && !hasTriggered) {
                setHasTriggered(true);
                onJoinTime();
            }
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, [date, time, meetingLink, onJoinTime, hasTriggered]);

    if (!timeRemaining) return null;

    return (
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Time remaining:</span>
            <span className="text-sm font-bold text-blue-700 dark:text-blue-300 tabular-nums">
                {String(timeRemaining.hours).padStart(2, '0')}:
                {String(timeRemaining.minutes).padStart(2, '0')}:
                {String(timeRemaining.seconds).padStart(2, '0')}
            </span>
        </div>
    );
};

export default AppointmentCountdown;

