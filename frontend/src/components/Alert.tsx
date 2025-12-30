import { useEffect } from 'react';

interface AlertProps {
    message: string;
    type?: 'success' | 'error' | 'info' | 'warning';
    onClose: () => void;
    duration?: number;
}

const Alert = ({ message, type = 'info', onClose, duration = 3000 }: AlertProps) => {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const bgColors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500'
    };

    const iconColors = {
        success: 'text-green-100',
        error: 'text-red-100',
        info: 'text-blue-100',
        warning: 'text-yellow-100'
    };

    return (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
            <div className={`${bgColors[type]} text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 min-w-[300px] max-w-md`}>
                <span className={`material-symbols-outlined ${iconColors[type]}`}>
                    {type === 'success' ? 'check_circle' :
                     type === 'error' ? 'error' :
                     type === 'warning' ? 'warning' : 'info'}
                </span>
                <p className="flex-1 font-medium">{message}</p>
                <button
                    onClick={onClose}
                    className="text-white/80 hover:text-white transition-colors"
                >
                    <span className="material-symbols-outlined text-xl">close</span>
                </button>
            </div>
        </div>
    );
};

export default Alert;


