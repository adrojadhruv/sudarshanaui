import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    // Initialize from localStorage or default to Dark (more premium)
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved ? saved === 'dark' : true;
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            document.body.style.backgroundColor = '#0f0f11'; // Deep Premium Black
            document.body.style.color = '#fdf7f7fd';
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            document.body.style.backgroundColor = '#ffffffdd';
            document.body.style.color = '#111827';
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    // THEME CONSTANTS - "Golden & Wise"
    const theme = {
        mode: darkMode ? 'dark' : 'light',
        toggle: (e) => {
            // VIEW TRANSITION API - CIRCULAR REVEAL
            if (!document.startViewTransition) {
                setDarkMode(!darkMode);
                return;
            }

            // Get click coordinates or center of screen
            const x = e?.clientX ?? window.innerWidth / 2;
            const y = e?.clientY ?? window.innerHeight / 2;
            const endRadius = Math.hypot(
                Math.max(x, window.innerWidth - x),
                Math.max(y, window.innerHeight - y)
            );

            const transition = document.startViewTransition(() => {
                setDarkMode(!darkMode);
            });

            transition.ready.then(() => {
                const clipPath = [
                    `circle(0px at ${x}px ${y}px)`,
                    `circle(${endRadius}px at ${x}px ${y}px)`,
                ];

                // Animate the new view (which is the one "revealing")
                document.documentElement.animate(
                    {
                        clipPath: darkMode ? [...clipPath].reverse() : clipPath,
                    },
                    {
                        duration: 500,
                        easing: "ease-in-out",
                        pseudoElement: darkMode ? "::view-transition-old(root)" : "::view-transition-new(root)",
                    }
                );
            });
        },
        colors: {
            background: darkMode ? '#0f0f11' : '#fff7f7ff',
            surface: darkMode ? 'rgba(255, 255, 255, 0.03)' : '#ffffff',
            text: darkMode ? '#f3f4f6' : '#111827',
            border: darkMode
                ? '1px solid rgba(251, 191, 36, 0.3)' // Golden for Dark
                : '1px solid rgba(217, 119, 6, 0.2)', // Golden/Amber for Light (subtle but golden)
            accent: '#fbbf24', // Amber-400 (Gold)
            glass: darkMode
                ? { background: 'rgba(20, 20, 20, 0.6)', backdropFilter: 'blur(20px)', border: '1px solid rgba(251, 191, 36, 0.25)' }
                : { background: 'rgba(244, 244, 244, 0.62)', backdropFilter: 'blur(20px)', border: '1px solid rgba(245, 158, 11, 0.2)' }
        }
    };

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
};
