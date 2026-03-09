'use client';

import { motion } from 'framer-motion';
import { User, Mail, Lock, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CountrySelector } from './CountrySelector';
import { PremiumInput } from '@/components/ui/PremiumInput';

interface Step1InfoProps {
    username: string;
    setUsername: (val: string) => void;
    usernameError: string;
    isCheckingUsername: boolean;
    isUsernameAvailable: boolean;
    fullName: string;
    setFullName: (val: string) => void;
    email: string;
    setEmail: (val: string) => void;
    emailError: string;
    isCheckingEmail: boolean;
    phone: string;
    setPhone: (val: string) => void;
    password: string;
    setPassword: (val: string) => void;
    showPassword: boolean;
    setShowPassword: (val: boolean) => void;
    isPasswordDirty: boolean;
    setIsPasswordDirty: (val: boolean) => void;
    countries: any[];
    selectedCountry: any;
    setSelectedCountry: (val: any) => void;
    setError: (val: string) => void;
}

export function Step1Info({
    username, setUsername, usernameError, isCheckingUsername, isUsernameAvailable,
    fullName, setFullName, email, setEmail, emailError, isCheckingEmail,
    phone, setPhone, password, setPassword, showPassword, setShowPassword,
    isPasswordDirty, setIsPasswordDirty,
    countries, selectedCountry, setSelectedCountry,
    setError
}: Step1InfoProps) {
    return (
        <motion.div
            key="signup-step-1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-4 w-full"
        >
            {/* Username */}
            <PremiumInput
                value={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''));
                    setError('');
                }}
                placeholder="kullanıcı-adı"
                error={usernameError}
                success={isUsernameAvailable && !isCheckingUsername}
                innerPrefix="sety.store/"
                helperText={isCheckingUsername ? "Kontrol ediliyor..." : ""}
            />

            {/* Full Name */}
            <PremiumInput
                value={fullName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                placeholder="Ad Soyad"
            />

            {/* Email */}
            <PremiumInput
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setEmail(e.target.value);
                    setError('');
                }}
                placeholder="E-posta"
                error={emailError}
                helperText={isCheckingEmail ? "Kontrol ediliyor..." : ""}
            />

            {/* Phone */}
            <div className="flex gap-2">
                <CountrySelector
                    countries={countries}
                    selectedCountry={selectedCountry}
                    onSelect={setSelectedCountry}
                />
                <PremiumInput
                    type="tel"
                    value={phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                    placeholder="5XX XXX XX XX"
                />
            </div>

            {/* Password */}
            <PremiumInput
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setPassword(e.target.value);
                    setError('');
                    if (!isPasswordDirty) setIsPasswordDirty(true);
                }}
                placeholder="Şifre (en az 6 karakter)"
                error={isPasswordDirty && password.length < 6 ? "En az 6 karakter olmalıdır." : ""}
            />
        </motion.div>
    );
}
