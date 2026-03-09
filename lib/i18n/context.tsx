'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import tr from './dictionaries/tr.json';
import en from './dictionaries/en.json';
import ar from './dictionaries/ar.json';
import ru from './dictionaries/ru.json';
import de from './dictionaries/de.json';
import es from './dictionaries/es.json';
import pt from './dictionaries/pt.json';
import fr from './dictionaries/fr.json';
import zh from './dictionaries/zh.json';
import hi from './dictionaries/hi.json';

type Dictionary = typeof tr;
type Language = 'tr' | 'en' | 'ar' | 'ru' | 'de' | 'es' | 'pt' | 'fr' | 'zh' | 'hi';

const dictionaries: Record<Language, any> = { tr, en, ar, ru, de, es, pt, fr, zh, hi };

interface I18nContextType {
    lang: Language;
    setLang: (lang: Language) => void;
    t: (path: string, options?: { returnObjects?: boolean } & Record<string, any>) => any;
    isRTL: boolean;
}

export const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLangState] = useState<Language>('tr');

    useEffect(() => {
        const savedLang = localStorage.getItem('s_lang') as Language;
        const supported = ['tr', 'en', 'ar', 'ru', 'de', 'es', 'pt', 'fr', 'zh', 'hi'];

        if (savedLang && supported.includes(savedLang)) {
            setLangState(savedLang);
        } else {
            // Auto detect browser language
            const browserLang = navigator.language.split('-')[0];
            if (supported.includes(browserLang)) {
                setLangState(browserLang as Language);
            } else {
                setLangState('en'); // Global fallback to English
            }
        }
    }, []);

    useEffect(() => {
        // Update document direction based on language
        const dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.dir = dir;
        document.documentElement.lang = lang;

        // Also update cookie for server-side detection
        document.cookie = `s_lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    }, [lang]);

    const setLang = (newLang: Language) => {
        setLangState(newLang);
        localStorage.setItem('s_lang', newLang);
    };

    const isRTL = lang === 'ar';

    const t = (path: string, options?: { returnObjects?: boolean } & Record<string, any>): any => {
        const keys = path.split('.');
        let result: any = dictionaries[lang] || dictionaries['en']; // Fallback to EN if lang not loaded

        for (const key of keys) {
            if (result && typeof result === 'object' && key in result) {
                result = result[key];
            } else {
                // If not found in current lang, try English
                let enResult = dictionaries['en'];
                for (const enKey of keys) {
                    if (enResult && typeof enResult === 'object' && enKey in enResult) {
                        enResult = enResult[enKey];
                    } else {
                        return path;
                    }
                }
                result = enResult;
                break;
            }
        }

        if (typeof result === 'string' && options) {
            Object.entries(options).forEach(([key, value]) => {
                if (key !== 'returnObjects') {
                    result = (result as string).replace(new RegExp(`{{${key}}}`, 'g'), String(value));
                }
            });
        }

        return result;
    };

    return (
        <I18nContext.Provider value={{ lang, setLang, t, isRTL }}>
            {children}
        </I18nContext.Provider>
    );
}

export const useTranslation = () => {
    const context = useContext(I18nContext);
    if (context === undefined) {
        throw new Error('useTranslation must be used within an I18nProvider');
    }
    return context;
};
