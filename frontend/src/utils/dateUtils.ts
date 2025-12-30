// Bangladesh Standard Time (BST) is UTC+6
const BD_TIMEZONE_OFFSET = 6 * 60; // 6 hours in minutes

/**
 * Convert a date string or Date object to Bangladesh time
 * Bangladesh Standard Time (BST) is UTC+6
 */
export const toBDTime = (date: string | Date): Date => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    // If it's a date-only string (YYYY-MM-DD), treat it as local date in BD timezone
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        // Parse as BD local date
        const [year, month, day] = date.split('-').map(Number);
        return new Date(year, month - 1, day);
    }
    // For datetime strings, convert to BD time
    // Get UTC time and add BD offset
    const utcTime = dateObj.getTime() + (dateObj.getTimezoneOffset() * 60000);
    const bdTime = new Date(utcTime + (BD_TIMEZONE_OFFSET * 60000));
    return bdTime;
};

/**
 * Format date in Bangladesh timezone (DD/MM/YYYY format)
 */
export const formatBDDate = (date: string | Date): string => {
    const bdDate = toBDTime(date);
    const day = String(bdDate.getDate()).padStart(2, '0');
    const month = String(bdDate.getMonth() + 1).padStart(2, '0');
    const year = bdDate.getFullYear();
    return `${day}/${month}/${year}`;
};

/**
 * Format date with month name in Bangladesh timezone
 */
export const formatBDDateWithMonth = (date: string | Date, options?: {
    year?: 'numeric' | '2-digit';
    month?: 'short' | 'long' | 'numeric';
    day?: 'numeric' | '2-digit';
}): string => {
    const bdDate = toBDTime(date);
    const defaultOptions = {
        year: 'numeric' as const,
        month: 'short' as const,
        day: 'numeric' as const,
        timeZone: 'Asia/Dhaka'
    };
    return bdDate.toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

/**
 * Format time in 12-hour format with AM/PM (Bangladesh timezone)
 */
export const formatBDTime = (time: string): string => {
    // If time is already in HH:MM format, just format it
    if (time.includes(':')) {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return `${displayHour}:${minutes} ${period}`;
    }
    // If it's a date string, extract time
    const date = new Date(time);
    const bdDate = toBDTime(date);
    const hours = bdDate.getHours();
    const mins = String(bdDate.getMinutes()).padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHour}:${mins} ${period}`;
};

/**
 * Format date and time together in Bangladesh timezone
 */
export const formatBDDateTime = (date: string | Date, time?: string): string => {
    const dateStr = formatBDDate(date);
    if (time) {
        return `${dateStr} at ${formatBDTime(time)}`;
    }
    return dateStr;
};

/**
 * Get current date in Bangladesh timezone (YYYY-MM-DD format)
 */
export const getCurrentBDDate = (): string => {
    const now = new Date();
    const bdDate = toBDTime(now);
    const year = bdDate.getFullYear();
    const month = String(bdDate.getMonth() + 1).padStart(2, '0');
    const day = String(bdDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Get current time in Bangladesh timezone (HH:MM format)
 */
export const getCurrentBDTime = (): string => {
    const now = new Date();
    const bdDate = toBDTime(now);
    const hours = String(bdDate.getHours()).padStart(2, '0');
    const minutes = String(bdDate.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};

/**
 * Format date for input fields (YYYY-MM-DD) in Bangladesh timezone
 */
export const formatBDDateForInput = (date: string | Date): string => {
    const bdDate = toBDTime(date);
    const year = bdDate.getFullYear();
    const month = String(bdDate.getMonth() + 1).padStart(2, '0');
    const day = String(bdDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

