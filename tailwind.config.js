const colors = require('tailwindcss/colors');
const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: 'class', // Enable dark mode with class strategy
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#1E3A8A',
                    50: '#E9EDF8',
                    100: '#C5D1EA',
                    200: '#9DB2DC',
                    300: '#7594CF',
                    400: '#4D75C1',
                    500: '#3560B2',
                    600: '#1E3A8A', // PRIMARY
                    700: '#15276E',
                    800: '#0F1A52',
                    900: '#080D36',
                },
                secondary: {
                    DEFAULT: '#9333EA',
                    50: '#F5EBFD',
                    100: '#E9D2FA',
                    200: '#D3A5F6',
                    300: '#BD78F1',
                    400: '#A74BED',
                    500: '#9333EA', // SECONDARY
                    600: '#7B21CB',
                    700: '#65149E',
                    800: '#4F0D72',
                    900: '#380645',
                },
                accent: {
                    DEFAULT: '#F59E0B',
                    50: '#FEF5E7',
                    100: '#FEEAD0',
                    200: '#FDD5A0',
                    300: '#FCC071',
                    400: '#FBAA41',
                    500: '#F59E0B', // ACCENT
                    600: '#D18608',
                    700: '#9F6606',
                    800: '#6D4704',
                    900: '#3B2702',
                },
                success: colors.green,
                error: colors.red,
                warning: colors.amber,
                info: colors.sky,
            },
            spacing: {
                '72': '18rem',
                '80': '20rem',
                '96': '24rem',
                '128': '32rem',
                '144': '36rem',
            },
            fontSize: {
                'xs': '.75rem',
                'sm': '.875rem',
                'base': '1rem',
                'lg': '1.125rem',
                'xl': '1.25rem',
                '2xl': '1.5rem',
                '3xl': '1.875rem',
                '4xl': '2.25rem',
                '5xl': '3rem',
                '6xl': '3.75rem',
                '7xl': '4.5rem',
            },
            screens: {
                'xs': '475px',
                'sm': '640px',
                'md': '768px',
                'lg': '1024px',
                'xl': '1280px',
                '2xl': '1536px',
                'portrait': { 'raw': '(orientation: portrait)' },
                'landscape': { 'raw': '(orientation: landscape)' },
            },
            borderRadius: {
                'none': '0',
                'sm': '0.125rem',
                DEFAULT: '0.25rem',
                'md': '0.375rem',
                'lg': '0.5rem',
                'xl': '0.75rem',
                '2xl': '1rem',
                '3xl': '1.5rem',
                'full': '9999px',
            },
            boxShadow: {
                sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
                'glow-primary': '0 0 15px rgba(30, 58, 138, 0.5)',
                'glow-accent': '0 0 15px rgba(245, 158, 11, 0.5)',
                'none': 'none',
            },
            transitionTimingFunction: {
                'ease-in-out-quad': 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
                'ease-out-back': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            },
            transitionDuration: {
                '400': '400ms',
                '600': '600ms',
                '800': '800ms',
                '900': '900ms',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'fade-out': 'fadeOut 0.5s ease-in-out',
                'slide-in': 'slideIn 0.5s ease-in-out',
                'slide-out': 'slideOut 0.5s ease-in-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 },
                },
                fadeOut: {
                    '0%': { opacity: 1 },
                    '100%': { opacity: 0 },
                },
                slideIn: {
                    '0%': { transform: 'translateY(20px)', opacity: 0 },
                    '100%': { transform: 'translateY(0)', opacity: 1 },
                },
                slideOut: {
                    '0%': { transform: 'translateY(0)', opacity: 1 },
                    '100%': { transform: 'translateY(20px)', opacity: 0 },
                },
            },
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        color: theme('colors.gray.800'),
                        a: {
                            color: theme('colors.primary.600'),
                            '&:hover': {
                                color: theme('colors.primary.700'),
                            },
                        },
                        'h1, h2, h3, h4, h5, h6': {
                            color: theme('colors.gray.900'),
                        },
                    },
                },
                dark: {
                    css: {
                        color: theme('colors.gray.300'),
                        a: {
                            color: theme('colors.primary.400'),
                            '&:hover': {
                                color: theme('colors.primary.300'),
                            },
                        },
                        'h1, h2, h3, h4, h5, h6': {
                            color: theme('colors.gray.100'),
                        },
                    },
                },
            }),
            outline: {
                'focus-visible': '2px solid var(--color-primary-500)',
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/forms')({
            strategy: 'class',
        }),
        plugin(function ({ addUtilities, theme, variants }) {
            // Add custom utilities
            const newUtilities = {
                '.shadow-glow': {
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                },
                '.shadow-glow-primary': {
                    boxShadow: `0 0 15px ${theme('colors.primary.500')}`,
                },
                '.shadow-glow-accent': {
                    boxShadow: `0 0 15px ${theme('colors.accent.500')}`,
                },
                '.text-shadow': {
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                },
                '.backface-hidden': {
                    backfaceVisibility: 'hidden',
                },
                '.backdrop-blur': {
                    backdropFilter: 'blur(8px)',
                },
            };
            addUtilities(newUtilities, variants('customUtilities'));
        }),
        // Add dark mode variant
        plugin(function ({ addVariant }) {
            addVariant('dark-hover', '.dark &:hover');
            addVariant('dark-focus', '.dark &:focus');
            addVariant('dark-active', '.dark &:active');
            addVariant('dark-disabled', '.dark &:disabled');
            addVariant('dark-placeholder', '.dark &::placeholder');
        }),
    ],
};