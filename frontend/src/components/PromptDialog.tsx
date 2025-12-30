import { useState, useEffect, useRef } from 'react';

interface PromptDialogProps {
    title: string;
    message: string;
    placeholder?: string;
    defaultValue?: string;
    onConfirm: (value: string) => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    type?: 'text' | 'url' | 'time';
    validation?: (value: string) => boolean;
    validationMessage?: string;
}

const PromptDialog = ({
    title,
    message,
    placeholder = '',
    defaultValue = '',
    onConfirm,
    onCancel,
    confirmText = 'OK',
    cancelText = 'Cancel',
    type = 'text',
    validation,
    validationMessage
}: PromptDialogProps) => {
    const [value, setValue] = useState(defaultValue);
    const [error, setError] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleConfirm = () => {
        if (validation && !validation(value)) {
            setError(validationMessage || 'Invalid input');
            return;
        }
        if (value.trim() === '' && !defaultValue) {
            setError('This field is required');
            return;
        }
        onConfirm(value);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleConfirm();
        } else if (e.key === 'Escape') {
            onCancel();
        }
    };

    const inputType = type === 'url' ? 'url' : type === 'time' ? 'time' : 'text';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full mx-4 animate-in zoom-in-95 duration-200">
                <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{message}</p>
                    <input
                        ref={inputRef}
                        type={inputType}
                        value={value}
                        onChange={(e) => {
                            setValue(e.target.value);
                            setError('');
                        }}
                        onKeyDown={handleKeyPress}
                        placeholder={placeholder}
                        className={`w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border ${
                            error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } focus:outline-none focus:ring-2 focus:ring-primary/20 dark:text-white`}
                    />
                    {error && (
                        <p className="mt-2 text-sm text-red-500">{error}</p>
                    )}
                    <div className="flex gap-3 justify-end mt-6">
                        <button
                            onClick={onCancel}
                            className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="px-5 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromptDialog;


