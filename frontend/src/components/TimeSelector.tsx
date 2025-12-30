import { useState, useEffect, useRef } from 'react';

interface TimeSelectorProps {
    availableSlots: string[];
    selectedTime: string;
    onTimeSelect: (time: string) => void;
    loading?: boolean;
    bookedSlots?: string[]; // Slots that are already booked by other patients
    selectedDate?: string; // Selected date to check if it's today
}

const TimeSelector = ({ availableSlots, selectedTime, onTimeSelect, loading = false, bookedSlots = [], selectedDate }: TimeSelectorProps) => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll to selected time when it changes
        if (selectedTime && containerRef.current) {
            const selectedElement = containerRef.current.querySelector(`[data-time="${selectedTime}"]`);
            if (selectedElement) {
                selectedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [selectedTime]);

    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return `${displayHour}:${minutes} ${period}`;
    };

    // Check if a time slot is in the past (for today only)
    const isTimePast = (time: string): boolean => {
        if (!selectedDate) return false;
        
        // Check if selected date is today
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        
        if (selectedDate !== todayStr) {
            return false; // Not today, so not past
        }
        
        // Parse time slot (HH:MM format)
        const [slotHours, slotMinutes] = time.split(':').map(Number);
        const slotTime = new Date();
        slotTime.setHours(slotHours, slotMinutes, 0, 0);
        
        // Get current time
        const now = new Date();
        
        // Compare: if slot time is before current time, it's past
        return slotTime < now;
    };

    if (loading) {
        return (
            <div className="w-full">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {[...Array(10)].map((_, i) => (
                        <div
                            key={i}
                            className="h-14 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse"
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (availableSlots.length === 0) {
        return (
            <div className="w-full px-4 py-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-center">
                <span className="material-symbols-outlined text-red-500 dark:text-red-400 text-4xl mb-2 block">schedule</span>
                <p className="text-red-700 dark:text-red-400 font-medium">No available time slots</p>
                <p className="text-sm text-red-600 dark:text-red-500 mt-1">Please select a different date</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {availableSlots.filter(slot => {
                        const normalizedSlot = slot.length > 5 ? slot.substring(0, 5) : slot;
                        const isBooked = bookedSlots.some(booked => {
                            const normalizedBooked = booked.length > 5 ? booked.substring(0, 5) : booked;
                            return normalizedSlot === normalizedBooked;
                        });
                        const isPast = isTimePast(slot);
                        return !isBooked && !isPast;
                    }).length} slot{availableSlots.filter(slot => {
                        const normalizedSlot = slot.length > 5 ? slot.substring(0, 5) : slot;
                        const isBooked = bookedSlots.some(booked => {
                            const normalizedBooked = booked.length > 5 ? booked.substring(0, 5) : booked;
                            return normalizedSlot === normalizedBooked;
                        });
                        const isPast = isTimePast(slot);
                        return !isBooked && !isPast;
                    }).length !== 1 ? 's' : ''} available
                    {bookedSlots.length > 0 && (
                        <span className="text-gray-500 dark:text-gray-400 ml-2 font-normal">
                            ({bookedSlots.length} booked)
                        </span>
                    )}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">24-hour format</p>
            </div>
            <div
                ref={containerRef}
                className="max-h-64 overflow-y-auto pr-2 custom-scrollbar"
            >
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {availableSlots.map((slot) => {
                        const isSelected = selectedTime === slot;
                        // Check if this slot is booked by another patient
                        const isBooked = bookedSlots.some(booked => {
                            // Normalize both times for comparison
                            const normalizedSlot = slot.length > 5 ? slot.substring(0, 5) : slot;
                            const normalizedBooked = booked.length > 5 ? booked.substring(0, 5) : booked;
                            return normalizedSlot === normalizedBooked;
                        });
                        // Check if this time is in the past (for today)
                        const isPast = isTimePast(slot);
                        const isDisabled = isBooked || isPast;
                        
                        return (
                            <button
                                key={slot}
                                data-time={slot}
                                onClick={() => !isDisabled && onTimeSelect(slot)}
                                disabled={isDisabled}
                                className={`
                                    h-14 rounded-xl font-medium text-sm transition-all duration-200
                                    border-2 flex flex-col items-center justify-center relative
                                    ${isDisabled
                                        ? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-60'
                                        : isSelected
                                        ? 'bg-primary text-white border-primary shadow-lg scale-105'
                                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10'
                                    }
                                `}
                                title={isPast ? 'This time has already passed' : isBooked ? 'This time slot is already booked' : ''}
                            >
                                <span className="font-bold">{slot}</span>
                                <span className={`text-xs ${isSelected ? 'text-white/90' : isDisabled ? 'text-gray-400 dark:text-gray-600' : 'text-gray-500 dark:text-gray-400'}`}>
                                    {formatTime(slot)}
                                </span>
                                {isDisabled && (
                                    <span className="absolute top-1 right-1 text-xs text-gray-400 dark:text-gray-600">✕</span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
            {selectedTime && (
                <div className="mt-4 p-3 rounded-lg bg-primary/10 dark:bg-primary/20 border border-primary/30">
                    <div className="flex items-center gap-2 text-primary">
                        <span className="material-symbols-outlined text-lg">schedule</span>
                        <span className="text-sm font-medium">Selected: {selectedTime} ({formatTime(selectedTime)})</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimeSelector;

