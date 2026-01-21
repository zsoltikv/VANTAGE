// -----------------------------------------------------
// TAILWIND CONFIGURATION
// -----------------------------------------------------
tailwind.config = {

    // -------------------------------------------------
    // THEME EXTENSIONS
    // -------------------------------------------------
    theme: {
        extend: {

            // -------------------------------------------------
            // CUSTOM COLORS
            // -------------------------------------------------
            colors: {
                'gold': {
                    50: '#faf8f0',
                    100: '#f5efd8',
                    200: '#e8d9a8',
                    300: '#dbc378',
                    400: '#d4b158',
                    500: '#c5a059',
                    600: '#a68241',
                    700: '#876534',
                    800: '#6d512d',
                    900: '#5a4328',
                },
            },

            // -------------------------------------------------
            // CUSTOM FONT FAMILIES
            // -------------------------------------------------
            fontFamily: {
                display: ['"Playfair Display"', 'serif'],
                sans: ['Inter', 'sans-serif'],
            },

            // -------------------------------------------------
            // CUSTOM ANIMATIONS
            // -------------------------------------------------
            animation: {
                'fadeIn': 'fadeIn 0.8s ease-out forwards',
                'slideUp': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'slideDown': 'slideDown 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'scaleIn': 'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'shimmer': 'shimmer 2.5s linear infinite',
            },

            // -------------------------------------------------
            // KEYFRAMES FOR ANIMATIONS
            // -------------------------------------------------
            keyframes: {

                // FADE IN ANIMATION
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                },

                // SLIDE UP ANIMATION
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(40px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                },

                // SLIDE DOWN ANIMATION
                slideDown: {
                    '0%': { opacity: '0', transform: 'translateY(-40px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                },

                // SCALE IN ANIMATION
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' }
                },

                // SHIMMER EFFECT ANIMATION
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' }
                }

            }
        } 
    } 
} 