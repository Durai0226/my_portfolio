'use client'
import { useEffect, useState } from "react"

export default function ThemeSwitch() {
	const [theme, setTheme] = useState<string>("dark")
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
		// Access localStorage only on the client-side after mounting
		const savedTheme = localStorage?.getItem("theme") || "dark"
		setTheme(savedTheme)
		applyTheme(savedTheme)
	}, [])

	useEffect(() => {
		if (mounted) {
			// Update localStorage and HTML tag when theme changes
			localStorage.setItem("theme", theme)
			applyTheme(theme)
		}
	}, [theme, mounted])

	const applyTheme = (themeValue: string) => {
		// Apply Bootstrap theme attributes
		document.documentElement.setAttribute("data-bs-theme", themeValue)
		document.documentElement.setAttribute("data-theme", themeValue)
		document.body.setAttribute("data-bs-theme", themeValue)
		
		// Apply fallback CSS class for production
		if (themeValue === "dark") {
			document.body.classList.add("dark-theme-active")
		} else {
			document.body.classList.remove("dark-theme-active")
		}
	}

	const toggleTheme = () => {
		setTheme(prevTheme => (prevTheme === "dark" ? "light" : "dark"))
	}

	// Prevent hydration mismatch by not rendering until mounted
	if (!mounted) {
		return (
			<div className="dark-light-switcher pe-10 pe-lg-0 pe-0 ps-md-5 ps-0 ps-lg-4 pe-lg-4 d-flex justify-content-center align-items-center icon_80">
				<i className="bi theme-icon ri-sun-line text-warning" />
			</div>
		)
	}

	return (
		<>
			<div
				className="dark-light-switcher pe-10 pe-lg-0 pe-0 ps-md-5 ps-0 ps-lg-4 pe-lg-4 d-flex justify-content-center align-items-center icon_80"
				onClick={toggleTheme}
				style={{ cursor: "pointer" }}
			>
				<i className={`bi theme-icon ${theme === "dark" ? "ri-sun-line text-warning" : "ri-contrast-2-line text-white"}`} />
			</div>

			
		</>
	)
}
