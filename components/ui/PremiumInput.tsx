import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export interface PremiumInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: React.ReactNode;
    innerPrefix?: string;
    error?: string;
    success?: boolean;
    helperText?: string;
}

const PremiumInput = React.forwardRef<HTMLInputElement, PremiumInputProps>(
    ({ className, type, label, icon, innerPrefix, error, success, helperText, ...props }, ref) => {
        const [isFocused, setIsFocused] = React.useState(false);
        const prefixRef = React.useRef<HTMLSpanElement>(null);
        const [prefixWidth, setPrefixWidth] = React.useState(0);

        React.useEffect(() => {
            if (prefixRef.current) {
                setPrefixWidth(prefixRef.current.offsetWidth);
            }
        }, [innerPrefix]);

        return (
            <div className="w-full space-y-2 group">
                {label && (
                    <label className="text-[14px] font-black text-slate-800 ml-1 uppercase tracking-widest opacity-80 group-focus-within:opacity-100 transition-opacity">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && !innerPrefix && (
                        <div className={cn(
                            "absolute left-5 top-1/2 -translate-y-1/2 transition-colors duration-300",
                            isFocused ? "text-[#5500ff]" : "text-slate-400"
                        )}>
                            {icon}
                        </div>
                    )}

                    {innerPrefix && (
                        <span
                            ref={prefixRef}
                            className={cn(
                                "absolute left-6 top-1/2 -translate-y-1/2 font-bold text-[16px] transition-colors duration-300 pointer-events-none",
                                isFocused ? "text-[#5500ff]" : "text-[#5500ff]/60"
                            )}>
                            {innerPrefix}
                        </span>
                    )}

                    <input
                        type={type}
                        className={cn(
                            "w-full h-14 rounded-[20px] bg-slate-50/50 border-2 transition-all duration-300 outline-none",
                            innerPrefix ? "" : (icon ? "pl-14 pr-12" : "px-6 pr-12"),
                            "font-bold text-[16px] text-slate-900 placeholder:text-slate-400 placeholder:font-medium",
                            isFocused ? "border-[#5500ff]/60 bg-white shadow-[0_0_0_4px_rgba(85,0,255,0.05)]" : "border-slate-100/50 hover:border-slate-200",
                            error && "border-rose-200 bg-rose-50/10 shadow-[0_0_0_4px_rgba(244,63,94,0.05)]",
                            success && "border-emerald-200 bg-emerald-50/10",
                            className
                        )}
                        style={innerPrefix ? { paddingLeft: `${prefixWidth + 24}px` } : {}}
                        onFocus={(e) => {
                            setIsFocused(true);
                            props.onFocus?.(e);
                        }}
                        onBlur={(e) => {
                            setIsFocused(false);
                            props.onBlur?.(e);
                        }}
                        ref={ref}
                        {...props}
                    />

                    <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                >
                                    <AlertCircle className="w-5 h-5 text-rose-500" />
                                </motion.div>
                            )}
                            {success && !error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                >
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <AnimatePresence>
                    {(error || (helperText && !innerPrefix)) && (
                        <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className={cn(
                                "text-[12px] font-bold ml-2",
                                error ? "text-rose-500" : "text-slate-400"
                            )}
                        >
                            {error || helperText}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        );
    }
);
PremiumInput.displayName = 'PremiumInput';

export { PremiumInput };
