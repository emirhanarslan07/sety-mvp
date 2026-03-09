'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface Country {
    name: string;
    code: string;
    iso: string;
}

interface CountrySelectorProps {
    countries: Country[];
    selectedCountry: Country;
    onSelect: (country: Country) => void;
}

export function CountrySelector({ countries, selectedCountry, onSelect }: CountrySelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const filteredCountries = countries.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.includes(searchQuery)
    );

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 h-14 px-4 rounded-[20px] border-2 border-slate-100/50 bg-slate-50/50 hover:border-slate-200 transition-all shrink-0"
            >
                <img
                    src={`https://flagcdn.com/w40/${selectedCountry.iso}.png`}
                    alt={selectedCountry.name}
                    className="w-6 h-4 object-cover rounded-sm shadow-sm"
                />
                <span className="text-[15px] font-bold text-slate-900">{selectedCountry.code}</span>
                <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <div className="absolute bottom-16 left-0 w-[280px] bg-white rounded-2xl border border-slate-100 shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="p-3 border-b border-slate-50">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Ülke ara..."
                                className="pl-9 h-10 rounded-lg text-sm bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-slate-200"
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-1">
                        {filteredCountries.map((country) => (
                            <button
                                key={country.iso}
                                type="button"
                                onClick={() => {
                                    onSelect(country);
                                    setIsOpen(false);
                                    setSearchQuery('');
                                }}
                                className={cn(
                                    "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors",
                                    selectedCountry.iso === country.iso ? "bg-slate-50" : "hover:bg-slate-50/50"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={`https://flagcdn.com/w40/${country.iso}.png`}
                                        alt=""
                                        className="w-5 h-3.5 object-cover rounded-sm"
                                    />
                                    <span className="text-[14px] font-medium text-slate-900">{country.name}</span>
                                    <span className="text-[13px] text-slate-400 font-medium">({country.code})</span>
                                </div>
                                {selectedCountry.iso === country.iso && <Check className="w-4 h-4 text-[#5500ff]" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
