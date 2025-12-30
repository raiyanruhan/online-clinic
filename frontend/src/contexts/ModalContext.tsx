import { createContext, useContext, useState, ReactNode } from 'react';
import Alert from '../components/Alert';
import ConfirmDialog from '../components/ConfirmDialog';
import PromptDialog from '../components/PromptDialog';

interface AlertOptions {
    message: string;
    type?: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
}

interface ConfirmOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

interface PromptOptions {
    title: string;
    message: string;
    placeholder?: string;
    defaultValue?: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'text' | 'url' | 'time';
    validation?: (value: string) => boolean;
    validationMessage?: string;
}

interface ModalContextType {
    showAlert: (options: AlertOptions) => void;
    showConfirm: (options: ConfirmOptions) => Promise<boolean>;
    showPrompt: (options: PromptOptions) => Promise<string | null>;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within ModalProvider');
    }
    return context;
};

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [alert, setAlert] = useState<AlertOptions | null>(null);
    const [confirm, setConfirm] = useState<{ options: ConfirmOptions; resolve: (value: boolean) => void } | null>(null);
    const [prompt, setPrompt] = useState<{ options: PromptOptions; resolve: (value: string | null) => void } | null>(null);

    const showAlert = (options: AlertOptions) => {
        setAlert(options);
    };

    const showConfirm = (options: ConfirmOptions): Promise<boolean> => {
        return new Promise((resolve) => {
            setConfirm({ options, resolve });
        });
    };

    const showPrompt = (options: PromptOptions): Promise<string | null> => {
        return new Promise((resolve) => {
            setPrompt({ options, resolve });
        });
    };

    const handleConfirm = (confirmed: boolean) => {
        if (confirm) {
            confirm.resolve(confirmed);
            setConfirm(null);
        }
    };

    const handlePrompt = (value: string | null) => {
        if (prompt) {
            prompt.resolve(value);
            setPrompt(null);
        }
    };

    return (
        <ModalContext.Provider value={{ showAlert, showConfirm, showPrompt }}>
            {children}
            {alert && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                    duration={alert.duration}
                    onClose={() => setAlert(null)}
                />
            )}
            {confirm && (
                <ConfirmDialog
                    {...confirm.options}
                    onConfirm={() => handleConfirm(true)}
                    onCancel={() => handleConfirm(false)}
                />
            )}
            {prompt && (
                <PromptDialog
                    {...prompt.options}
                    onConfirm={(value) => handlePrompt(value)}
                    onCancel={() => handlePrompt(null)}
                />
            )}
        </ModalContext.Provider>
    );
};


