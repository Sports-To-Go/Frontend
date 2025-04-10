import React, { createContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
	theme: Theme
	toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextType>({
	theme: 'light',
	toggleTheme: () => {},
})

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [theme, setTheme] = useState<Theme>(() => {
		return (localStorage.getItem('theme') as Theme) || 'light'
	})

	const toggleTheme = () => {
		setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
	}

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', theme)
		localStorage.setItem('theme', theme)
	}, [theme])

	return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}
