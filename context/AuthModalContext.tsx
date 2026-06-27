'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type AuthMode = 'login' | 'signup';

interface AuthModalContextType {
    isOpen: boolean;
    mode: AuthMode;
    openModal: (mode?: AuthMode) => void;
    closeModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<AuthMode>('login');

    const openModal = (newMode: AuthMode = 'login') => {
        setMode(newMode);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    return (
        <AuthModalContext.Provider value={{ isOpen, mode, openModal, closeModal }}>
            {children}
        </AuthModalContext.Provider>
    );
}

export function useAuthModal() {
    const context = useContext(AuthModalContext);
    if (context === undefined) {
        throw new Error('useAuthModal must be used within an AuthModalProvider');
    }
    return context;
}
