import React, { useState, createContext, useContext, ReactNode } from "react";
import { CustomToast } from "~/components/Toast/CustomToast";

interface ToastState {
    visible: boolean;
    message: string;
    title?: string;
    type: "success" | "error" | "info" | "warning";
}

interface ToastContextType {
    showToast: (message: string, type?: "success" | "error" | "info" | "warning", title?: string) => void;
    showAlert: (options: { title: string; message: string; preset?: "error" | "success" | "info" | "warning" }) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toastState, setToastState] = useState<ToastState>({
        visible: false,
        message: "",
        type: "info",
    });

    const showToast = (message: string, type: "success" | "error" | "info" | "warning" = "success", title?: string) => {
        setToastState({
            visible: true,
            message,
            title,
            type,
        });
    };

    const showAlert = (options: {
        title: string;
        message: string;
        preset?: "error" | "success" | "info" | "warning";
    }) => {
        const type = options.preset || "info";
        setToastState({
            visible: true,
            message: options.message,
            title: options.title,
            type,
        });
    };

    const hideToast = () => {
        setToastState(prev => ({ ...prev, visible: false }));
    };

    return (
        <ToastContext.Provider value={{ showToast, showAlert }}>
            {children}
            <CustomToast
                visible={toastState.visible}
                message={toastState.message}
                title={toastState.title}
                type={toastState.type}
                onHide={hideToast}
            />
        </ToastContext.Provider>
    );
};

export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};
