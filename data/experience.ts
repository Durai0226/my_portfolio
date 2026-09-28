/* Roles, newest first. Dates are YYYY-MM; `to: null` means present.
 * TODO(Durai): the Accubits and Xnovaa bullets were drafted from the projects list — please review. */

export type Role = {
	co: string
	full?: string
	title: string
	from: string
	to: string | null
	cc: string
	/** `dark`: the artwork is light, so it sits on an ink tile */
	logo: { src?: string; monogram?: string; dark?: boolean }
	note: string
	bullets: string[]
	tags: string[]
}

export const roles: Role[] = [

	{ co: 'DataSirpi', title: 'React Frontend Developer', from: '2023-08', to: null, cc: '#7c3aed', logo: { src: '/assets/imgs/editorial/logos/ds.svg', dark: true }, note: 'Platform engineering & cybersecurity', bullets: ['Developed and maintained multiple projects using React and Angular, creating dynamic, responsive web applications.', 'Led development of the D2Defense platform using React, SASS, React Query and Redux.', 'Implemented remote desktop features and real-time activity monitoring dashboards.'], tags: ['React', 'TypeScript', 'Redux', 'Next.js', 'Docker'] },
	{ co: 'Accubits', full: 'Accubits Technologies', title: 'Frontend Developer', from: '2022-03', to: '2023-04', cc: '#0ea5e9', logo: { src: '/assets/imgs/editorial/logos/accubits.png' }, note: 'Blockchain & AI technology company', bullets: ['Built the AVIS NFT platform with React, Next.js and TypeScript, integrating blockchain flows for creating and trading NFTs.', 'Developed the Viva-Vita product site in React with GSAP animations from pixel-perfect Figma designs.', 'Received the Accu Star Award for delivering on schedule.'], tags: ['React', 'Next.js', 'TypeScript', 'Styled Components', 'GSAP'] },
	{ co: 'Xnovaa', full: 'Xnovaa Digital', title: 'Frontend Developer', from: '2021-04', to: '2022-03', cc: '#f97316', logo: { monogram: 'XD' }, note: 'Digital consulting', bullets: ['Developed sign-in, sign-up and user profile flows for the FutureGril NFT platform.', 'Built NFT transfer and bulk upload features in React and TypeScript with Web3 integration.', 'Enhanced the admin and user modules.'], tags: ['React', 'TypeScript', 'Web3'] },
]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** "YYYY-MM" for the current month. */
export const nowYM = (now: Date = new Date()) => `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

/** Months since Jan 2021 (the start of the career graph's axis). */
export const monthIndex = (ym: string) => {
	const [y, m] = ym.split('-').map(Number)
	return (y - 2021) * 12 + (m - 1)
}

export const formatMonth = (ym: string | null) => {
	if (!ym) return 'Present'
	const [y, m] = ym.split('-').map(Number)
	return `${MONTHS[m - 1]} ${y}`
}

/** Tenure between two months, inclusive, e.g. "3 yrs 2 mo". */
export const tenure = (from: string, to: string | null, now: Date = new Date()) => {
	const n = monthIndex(to || nowYM(now)) - monthIndex(from) + 1
	const y = Math.floor(n / 12), m = n % 12
	return [y && `${y} yr${y > 1 ? 's' : ''}`, m && `${m} mo`].filter(Boolean).join(' ')
}

/** Whole years since the earliest role started (so the number never goes stale). */
export function yearsOfExperience(now: Date = new Date()) {
	const [y, m] = roles.map((r) => r.from).sort()[0].split('-').map(Number)
	const months = (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m)
	return Math.floor(months / 12)
}
