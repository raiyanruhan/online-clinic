import { useState, useEffect } from 'react';

interface CalendarProps {
    selectedDate: string;
    onDateSelect: (date: string) => void;
    availableDates?: string[];
    minDate?: string;
}

const Calendar = ({ selectedDate, onDateSelect, availableDates = [], minDate }: CalendarProps) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [availableDatesSet, setAvailableDatesSet] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (availableDates.length > 0) {
            setAvailableDatesSet(new Set(availableDates));
        }
    }, [availableDates]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Normalize minDate to midnight in local timezone for proper comparison
    let minDateObj = today;
    if (minDate) {
        // Parse minDate (YYYY-MM-DD) and create date in local timezone
        const [minYear, minMonth, minDay] = minDate.split('-').map(Number);
        minDateObj = new Date(minYear, minMonth - 1, minDay);
        minDateObj.setHours(0, 0, 0, 0);
    }

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek, year, month };
    };

    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);

    const isDateAvailable = (day: number) => {
        // Format date as YYYY-MM-DD in local timezone (avoid UTC conversion)
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return availableDatesSet.has(dateStr) || availableDatesSet.size === 0;
    };

    const isDatePast = (day: number) => {
        // Create date in local timezone and normalize to midnight
        const date = new Date(year, month, day);
        date.setHours(0, 0, 0, 0);
        // Compare dates: allow same day (date should be >= minDateObj)
        // Return true only if date is BEFORE minDateObj (not same day or future)
        return date.getTime() < minDateObj.getTime();
    };

    const isDateSelected = (day: number) => {
        if (!selectedDate) return false;
        // Format date as YYYY-MM-DD in local timezone (avoid UTC conversion)
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return dateStr === selectedDate;
    };

    const handleDateClick = (day: number) => {
        // Format date as YYYY-MM-DD in local timezone (avoid UTC conversion)
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        if (!isDatePast(day) && isDateAvailable(day)) {
            onDateSelect(dateStr);
        }
    };

    const goToPreviousMonth = () => {
        setCurrentMonth(new Date(year, month - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentMonth(new Date(year, month + 1, 1));
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayNamesBengali = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহ', 'শুক্র', 'শনি'];

    const days = [];
    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null);
    }
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        days.push(day);
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={goToPreviousMonth}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors active:scale-95"
                    aria-label="Previous month"
                >
                    <span className="material-symbols-outlined text-gray-600 dark:text-gray-300 text-xl">chevron_left</span>
                </button>
                <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                        {monthNames[month]} {year}
                    </h3>
                    {selectedDate && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Selected: {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </p>
                    )}
                </div>
                <button
                    onClick={goToNextMonth}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors active:scale-95"
                    aria-label="Next month"
                >
                    <span className="material-symbols-outlined text-gray-600 dark:text-gray-300 text-xl">chevron_right</span>
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-3">
                {dayNames.map((day, index) => (
                    <div key={day} className="text-center text-xs font-bold text-gray-500 dark:text-gray-400 py-2">
                        <div>{day}</div>
                        <div className="text-[10px] font-normal text-gray-400 dark:text-gray-500">{dayNamesBengali[index]}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
                {days.map((day, index) => {
                    if (day === null) {
                        return <div key={`empty-${index}`} className="aspect-square"></div>;
                    }

                    const isPast = isDatePast(day);
                    const isAvailable = isDateAvailable(day);
                    const isSelected = isDateSelected(day);
                    // Check if this is today - compare with current date in local timezone
                    const now = new Date();
                    const isToday = 
                        day === now.getDate() &&
                        month === now.getMonth() &&
                        year === now.getFullYear();

                    return (
                        <button
                            key={day}
                            onClick={() => handleDateClick(day)}
                            disabled={isPast || !isAvailable}
                            className={`
                                aspect-square rounded-xl text-sm font-medium transition-all duration-200
                                flex items-center justify-center relative
                                ${isPast 
                                    ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed opacity-50' 
                                    : isSelected
                                    ? 'bg-primary text-white shadow-lg scale-105 ring-2 ring-primary ring-offset-2'
                                    : isAvailable
                                    ? 'hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 text-gray-700 dark:text-gray-300 cursor-pointer hover:scale-105 active:scale-95 border-2 border-transparent hover:border-primary/30'
                                    : 'text-gray-400 dark:text-gray-600 cursor-not-allowed bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700'
                                }
                                ${isToday && !isSelected ? 'ring-2 ring-primary/50 border-primary/30' : ''}
                            `}
                        >
                            {day}
                            {isToday && !isSelected && (
                                <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-primary"></span>
                            )}
                        </button>
                    );
                })}
            </div>

            {availableDatesSet.size > 0 && (
                <div className="mt-4 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-primary/20 border border-primary"></div>
                        <span>Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-gray-200 dark:bg-gray-700"></div>
                        <span>Unavailable</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;

