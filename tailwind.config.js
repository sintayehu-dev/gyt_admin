/**
 * Tailwind CSS Configuration
 * Colors reference CSS variables for automatic sync
 * Note: Tailwind is configured but not actively used - components use CSS variables from global.css
 */

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],

    theme: {
        extend: {
            // Colors - use CSS variables for automatic sync
            colors: {
                primary: {
                    DEFAULT: 'var(--color-primary)',
                    hover: 'var(--color-primary-hover)',
                },
                secondary: {
                    DEFAULT: 'var(--color-secondary)',
                    hover: 'var(--color-secondary-hover)',
                },
                error: 'var(--color-error)',
                success: 'var(--color-success)',
                warning: 'var(--color-warning)',
                info: 'var(--color-info)',
                sidebar: {
                    bg: 'var(--color-sidebar-background)',
                    text: 'var(--color-sidebar-text)',
                    hover: 'var(--color-sidebar-hover)',
                    active: 'var(--color-sidebar-active)',
                },
            },
            // Font family
            fontFamily: {
                sans: ['Gilroy', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
                mono: ['Courier New', 'Courier', 'monospace'],
            },
            // Breakpoints
            screens: {
                'xs': '320px',
                'sm': '768px',
                'md': '1024px',
                'lg': '1440px',
                'xl': '1920px',
            },
            // Font sizes
            fontSize: {
                xs: '0.75rem',
                sm: '0.875rem',
                base: '1rem',
                lg: '1.125rem',
                xl: '1.25rem',
                '2xl': '1.5rem',
                '3xl': '1.875rem',
                '4xl': '2.25rem',
                '5xl': '3rem',
            },
            // Font weights
            fontWeight: {
                light: 300,
                normal: 400,
                medium: 500,
                semibold: 600,
                bold: 700,
            },
            // Line heights
            lineHeight: {
                tight: 1.25,
                normal: 1.5,
                relaxed: 1.75,
            },
            // Border radius
            borderRadius: {
                none: '0',
                sm: '0.25rem',
                md: '0.5rem',
                lg: '0.75rem',
                xl: '1rem',
                '2xl': '1.25rem',
                full: '9999px',
            },
            // Spacing
            spacing: {
                xs: '0.25rem',
                sm: '0.5rem',
                md: '1rem',
                lg: '1.5rem',
                xl: '2rem',
                '2xl': '3rem',
                '3xl': '4rem',
            },
            // Box shadows
            boxShadow: {
                'admin': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                'admin-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
        },
    },
    plugins: [],
}
