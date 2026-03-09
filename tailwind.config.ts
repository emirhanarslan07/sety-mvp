/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: [],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                purple: {
                    600: '#9333ea',
                },
                blue: {
                    600: '#3b82f6',
                },
                green: {
                    600: '#16a34a',
                },
                orange: {
                    600: '#ea580c',
                },
                red: {
                    600: '#dc2626',
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            fontFamily: {
                sans: ['var(--font-plus-jakarta)', 'Inter', 'sans-serif'],
                inter: ['var(--font-inter)', 'sans-serif'],
                plus_jakarta: ['var(--font-plus-jakarta)', 'Inter', 'sans-serif'],
                montserrat: ['var(--font-montserrat)', 'sans-serif'],
                syne: ['var(--font-syne)', 'sans-serif'],
                space_mono: ['var(--font-space-mono)', 'monospace'],
                playfair: ['var(--font-playfair)', 'serif'],
                outfit: ['var(--font-outfit)', 'sans-serif'],
                bebas: ['var(--font-bebas)', 'cursive'],
                poppins: ['var(--font-poppins)', 'sans-serif'],
                lexend: ['var(--font-lexend)', 'sans-serif'],
            },
            keyframes: {
                "accordion-down": {
                    from: { height: 0 },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: 0 },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
}
