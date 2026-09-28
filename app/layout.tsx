import './editorial.css'
import type { Metadata, Viewport } from 'next'
import { Archivo, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import ThemeScript from './theme-script'

const archivo = Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--font-archivo', display: 'swap' })
/* next/font has no fallback metrics for Instrument Serif, so it falls back to Georgia without a size adjustment */
const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-serif', display: 'swap', adjustFontFallback: false, fallback: ['Georgia', 'serif'] })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jbm', display: 'swap' })

export const metadata: Metadata = {
	title: 'Durai Singh — Frontend Developer',
	description: 'Durai Singh is a frontend developer in India building clear, fast interfaces for security, CRM and Web3 products with React, Next.js and Angular.',
	openGraph: {
		title: 'Durai Singh — Frontend Developer',
		description: 'Clear, fast interfaces for security, CRM and Web3 products. Five years, seven products, one Accu Star Award.',
		type: 'website',
	},
}

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	viewportFit: 'cover',
	themeColor: [
		{ media: '(prefers-color-scheme: dark)', color: '#14160e' },
		{ media: '(prefers-color-scheme: light)', color: '#f0eee6' },
	],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={`${archivo.variable} ${serif.variable} ${mono.variable}`} suppressHydrationWarning>
			<head>
				<ThemeScript />
			</head>
			<body>{children}</body>
		</html>
	)
}
