import { useEffect, useState } from 'react';
import { useModal } from '../../contexts/ModalContext';
import { formatBDTime, formatBDDate } from '../../utils/dateUtils';

interface TimeRange {
    start: string; // HH:MM format
    end: string;   // HH:MM format
}

interface Weekday {
    isAvailable: boolean;
    timeRanges: TimeRange[];
}

interface SpecialDay {
    date: string;
    isAvailable: boolean;
    timeRanges: TimeRange[];
    note?: string;
}

interface Availability {
    weekdays: {
        [key: string]: Weekday;
    };
    specialDays: SpecialDay[];
}

const AvailabilitySettings = () => {
    const { showAlert, showPrompt } = useModal();
    const [availability, setAvailability] = useState<Availability>({
        weekdays: {
            monday: { isAvailable: false, timeRanges: [] },
            tuesday: { isAvailable: false, timeRanges: [] },
            wednesday: { isAvailable: false, timeRanges: [] },
            thursday: { isAvailable: false, timeRanges: [] },
            friday: { isAvailable: false, timeRanges: [] },
            saturday: { isAvailable: false, timeRanges: [] },
            sunday: { isAvailable: false, timeRanges: [] }
        },
        specialDays: []
    });
    const [isAvailable, setIsAvailable] = useState(true);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [newSpecialDate, setNewSpecialDate] = useState('');
    const [newSpecialNote, setNewSpecialNote] = useState('');

    const dayLabels: { [key: string]: string } = {
        monday: 'সোমবার',
        tuesday: 'মঙ্গলবার',
        wednesday: 'বুধবার',
        thursday: 'বৃহস্পতিবার',
        friday: 'শুক্রবার',
        saturday: 'শনিবার',
        sunday: 'রবিবার'
    };

    useEffect(() => {
        fetchAvailability();
    }, []);

    const fetchAvailability = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/doctor/dashboard/availability', {
                headers: { 'x-auth-token': token || '' }
            });
            if (res.ok) {
                const data = await res.json();
                // Merge backend data with default structure
                const defaultWeekdays = {
                    monday: { isAvailable: false, timeRanges: [] },
                    tuesday: { isAvailable: false, timeRanges: [] },
                    wednesday: { isAvailable: false, timeRanges: [] },
                    thursday: { isAvailable: false, timeRanges: [] },
                    friday: { isAvailable: false, timeRanges: [] },
                    saturday: { isAvailable: false, timeRanges: [] },
                    sunday: { isAvailable: false, timeRanges: [] }
                };
                
                if (data.availability) {
                    // Convert old format (timeSlots) to new format (timeRanges) if needed
                    const convertedWeekdays: any = {};
                    Object.keys(defaultWeekdays).forEach(day => {
                        const oldData = data.availability.weekdays?.[day];
                        if (oldData) {
                            // If it has timeSlots (old format), convert to timeRanges
                            if (oldData.timeSlots && oldData.timeSlots.length > 0) {
                                // Group consecutive slots into ranges (simplified - just create ranges)
                                convertedWeekdays[day] = {
                                    isAvailable: oldData.isAvailable,
                                    timeRanges: [] // Will need manual setup
                                };
                            } else {
                                convertedWeekdays[day] = {
                                    isAvailable: oldData.isAvailable || false,
                                    timeRanges: oldData.timeRanges || []
                                };
                            }
                        } else {
                            convertedWeekdays[day] = defaultWeekdays[day];
                        }
                    });

                    setAvailability({
                        weekdays: convertedWeekdays,
                        specialDays: (data.availability.specialDays || []).map((sd: any) => ({
                            ...sd,
                            timeRanges: sd.timeRanges || (sd.timeSlots ? [] : [])
                        }))
                    });
                } else {
                    setAvailability({
                        weekdays: defaultWeekdays,
                        specialDays: []
                    });
                }
                setIsAvailable(data.is_available !== false);
            } else {
                console.error('Failed to fetch availability:', res.status);
            }
        } catch (error) {
            console.error('Error fetching availability:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleWeekdayToggle = (day: string) => {
        setAvailability(prev => ({
            ...prev,
            weekdays: {
                ...prev.weekdays,
                [day]: {
                    isAvailable: !(prev.weekdays[day]?.isAvailable || false),
                    timeRanges: prev.weekdays[day]?.timeRanges || []
                }
            }
        }));
    };

    const addTimeRange = async (day: string) => {
        const start = await showPrompt({
            title: 'Start Time (Bangladesh Time)',
            message: 'Enter start time in 24-hour format (HH:MM, e.g., 09:00 for 9:00 AM):',
            placeholder: '09:00',
            type: 'time',
            validation: (value) => /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(value),
            validationMessage: 'Invalid time format. Please use HH:MM format (e.g., 09:00 for 9:00 AM)'
        });

        if (!start) return;

        const end = await showPrompt({
            title: 'End Time (Bangladesh Time)',
            message: 'Enter end time in 24-hour format (HH:MM, e.g., 17:00 for 5:00 PM):',
            placeholder: '17:00',
            type: 'time',
            validation: (value) => {
                if (!/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(value)) return false;
                // Check if end is after start
                const startTime = start.split(':').map(Number);
                const endTime = value.split(':').map(Number);
                const startMinutes = startTime[0] * 60 + startTime[1];
                const endMinutes = endTime[0] * 60 + endTime[1];
                return endMinutes > startMinutes;
            },
            validationMessage: 'End time must be after start time'
        });

        if (end) {
            setAvailability(prev => ({
                ...prev,
                weekdays: {
                    ...prev.weekdays,
                    [day]: {
                        isAvailable: prev.weekdays[day]?.isAvailable || false,
                        timeRanges: [...(prev.weekdays[day]?.timeRanges || []), { start, end }].sort((a, b) => 
                            a.start.localeCompare(b.start)
                        )
                    }
                }
            }));
        }
    };

    const removeTimeRange = (day: string, index: number) => {
        setAvailability(prev => ({
            ...prev,
            weekdays: {
                ...prev.weekdays,
                [day]: {
                    isAvailable: prev.weekdays[day]?.isAvailable || false,
                    timeRanges: (prev.weekdays[day]?.timeRanges || []).filter((_, i) => i !== index)
                }
            }
        }));
    };

    const addSpecialDay = () => {
        if (!newSpecialDate) {
            showAlert({ message: 'Please select a date', type: 'warning' });
            return;
        }

        const specialDay: SpecialDay = {
            date: newSpecialDate,
            isAvailable: true,
            timeRanges: [],
            note: newSpecialNote || undefined
        };

        setAvailability(prev => ({
            ...prev,
            specialDays: [...prev.specialDays, specialDay]
        }));

        setNewSpecialDate('');
        setNewSpecialNote('');
    };

    const removeSpecialDay = (index: number) => {
        setAvailability(prev => ({
            ...prev,
            specialDays: prev.specialDays.filter((_, i) => i !== index)
        }));
    };

    const toggleSpecialDayAvailability = (index: number) => {
        setAvailability(prev => ({
            ...prev,
            specialDays: prev.specialDays.map((day, i) =>
                i === index ? { ...day, isAvailable: !day.isAvailable } : day
            )
        }));
    };

    const addSpecialDayTimeRange = async (index: number) => {
        const start = await showPrompt({
            title: 'Start Time (Bangladesh Time)',
            message: 'Enter start time in 24-hour format (HH:MM, e.g., 09:00 for 9:00 AM):',
            placeholder: '09:00',
            type: 'time',
            validation: (value) => /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(value),
            validationMessage: 'Invalid time format. Please use HH:MM format (e.g., 09:00 for 9:00 AM)'
        });

        if (!start) return;

        const end = await showPrompt({
            title: 'End Time (Bangladesh Time)',
            message: 'Enter end time in 24-hour format (HH:MM, e.g., 17:00 for 5:00 PM):',
            placeholder: '17:00',
            type: 'time',
            validation: (value) => {
                if (!/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(value)) return false;
                const startTime = start.split(':').map(Number);
                const endTime = value.split(':').map(Number);
                const startMinutes = startTime[0] * 60 + startTime[1];
                const endMinutes = endTime[0] * 60 + endTime[1];
                return endMinutes > startMinutes;
            },
            validationMessage: 'End time must be after start time'
        });

        if (end) {
            setAvailability(prev => ({
                ...prev,
                specialDays: prev.specialDays.map((day, i) =>
                    i === index
                        ? { ...day, timeRanges: [...day.timeRanges, { start, end }].sort((a, b) => 
                            a.start.localeCompare(b.start)
                        ) }
                        : day
                )
            }));
        }
    };

    const removeSpecialDayTimeRange = (specialIndex: number, rangeIndex: number) => {
        setAvailability(prev => ({
            ...prev,
            specialDays: prev.specialDays.map((day, i) =>
                i === specialIndex
                    ? { ...day, timeRanges: day.timeRanges.filter((_, ri) => ri !== rangeIndex) }
                    : day
            )
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/doctor/dashboard/availability', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token || ''
                },
                body: JSON.stringify({
                    availability,
                    is_available: isAvailable
                })
            });

            if (res.ok) {
                showAlert({ message: 'Availability settings saved successfully!', type: 'success' });
            } else {
                const error = await res.json();
                showAlert({ message: `Failed to save: ${error.message || 'Unknown error'}`, type: 'error' });
            }
        } catch (error) {
            console.error('Error saving availability:', error);
            showAlert({ message: 'Failed to save availability settings', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8 text-center">
                <div className="text-sm sm:text-base text-gray-500">Loading availability settings...</div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">Availability Settings</h2>
                    <label className="flex items-center gap-2 sm:gap-3 cursor-pointer">
                        <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Available for Booking</span>
                        <input
                            type="checkbox"
                            checked={isAvailable}
                            onChange={(e) => setIsAvailable(e.target.checked)}
                            className="w-4 h-4 sm:w-5 sm:h-5 text-primary rounded focus:ring-primary"
                        />
                    </label>
                </div>

                {/* Weekday Settings */}
                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                    <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">Weekly Schedule</h3>
                    {Object.keys(availability.weekdays).map((day) => {
                        const weekday = availability.weekdays[day] || { isAvailable: false, timeRanges: [] };
                        return (
                        <div key={day} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
                                <label className="flex items-center gap-2 sm:gap-3 cursor-pointer flex-1 w-full sm:w-auto">
                                    <input
                                        type="checkbox"
                                        checked={weekday.isAvailable}
                                        onChange={() => handleWeekdayToggle(day)}
                                        className="w-4 h-4 sm:w-5 sm:h-5 text-primary rounded focus:ring-primary shrink-0"
                                    />
                                    <span className="font-medium text-sm sm:text-base text-gray-800 dark:text-white">{dayLabels[day]}</span>
                                </label>
                                {weekday.isAvailable && (
                                    <button
                                        onClick={() => addTimeRange(day)}
                                        className="w-full sm:w-auto px-3 py-1.5 sm:py-1 text-xs sm:text-sm bg-primary text-white rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
                                    >
                                        Add Time Range
                                    </button>
                                )}
                            </div>
                            {weekday.isAvailable && (
                                <div className="space-y-2 mt-2">
                                    {weekday.timeRanges.map((range, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
                                        >
                                            <span className="text-xs sm:text-sm text-gray-800 dark:text-white font-medium flex-1 break-words">
                                                {formatBDTime(range.start)} - {formatBDTime(range.end)}
                                            </span>
                                            <button
                                                onClick={() => removeTimeRange(day, index)}
                                                className="text-red-500 hover:text-red-700 shrink-0"
                                            >
                                                <span className="material-symbols-outlined text-base sm:text-lg">close</span>
                                            </button>
                                        </div>
                                    ))}
                                    {weekday.timeRanges.length === 0 && (
                                        <span className="text-xs sm:text-sm text-gray-500">No time ranges added</span>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                    })}
                </div>

                {/* Special Days */}
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">Special Days (Holidays/Custom Dates)</h3>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <input
                            type="date"
                            value={newSpecialDate}
                            onChange={(e) => setNewSpecialDate(e.target.value)}
                            className="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        />
                        <input
                            type="text"
                            value={newSpecialNote}
                            onChange={(e) => setNewSpecialNote(e.target.value)}
                            placeholder="Note (optional)"
                            className="flex-1 w-full sm:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        />
                        <button
                            onClick={addSpecialDay}
                            className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base bg-primary text-white rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
                        >
                            Add Date
                        </button>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                        {availability.specialDays.map((specialDay, index) => (
                            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={specialDay.isAvailable}
                                                onChange={() => toggleSpecialDayAvailability(index)}
                                                className="w-4 h-4 text-primary rounded shrink-0"
                                            />
                                            <span className="font-medium text-sm sm:text-base text-gray-800 dark:text-white">
                                                {new Date(specialDay.date).toLocaleDateString()}
                                            </span>
                                        </label>
                                        {specialDay.note && (
                                            <span className="text-xs sm:text-sm text-gray-500 break-words">({specialDay.note})</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                        {specialDay.isAvailable && (
                                            <button
                                                onClick={() => addSpecialDayTimeRange(index)}
                                                className="flex-1 sm:flex-initial px-2 sm:px-3 py-1.5 sm:py-1 text-xs bg-primary text-white rounded hover:bg-red-700 whitespace-nowrap"
                                            >
                                                Add Time Range
                                            </button>
                                        )}
                                        <button
                                            onClick={() => removeSpecialDay(index)}
                                            className="px-2 py-1.5 sm:py-1 text-red-500 hover:text-red-700 shrink-0"
                                        >
                                            <span className="material-symbols-outlined text-base sm:text-lg">delete</span>
                                        </button>
                                    </div>
                                </div>
                                {specialDay.isAvailable && (
                                    <div className="space-y-2">
                                        {specialDay.timeRanges.map((range, rangeIndex) => (
                                            <div
                                                key={rangeIndex}
                                                className="flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
                                            >
                                                <span className="text-xs sm:text-sm text-gray-800 dark:text-white font-medium flex-1 break-words">
                                                    {formatBDTime(range.start)} - {formatBDTime(range.end)}
                                                </span>
                                                <button
                                                    onClick={() => removeSpecialDayTimeRange(index, rangeIndex)}
                                                    className="text-red-500 hover:text-red-700 shrink-0"
                                                >
                                                    <span className="material-symbols-outlined text-base sm:text-lg">close</span>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full py-2.5 sm:py-3 text-sm sm:text-base bg-primary text-white font-bold rounded-lg sm:rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? 'Saving...' : 'Save Availability Settings'}
                </button>
            </div>
        </div>
    );
};

export default AvailabilitySettings;
