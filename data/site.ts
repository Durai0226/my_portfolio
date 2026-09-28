/* Services, toolbox, contact details and the contents list for the dock. */

export type Service = { t: string; d: string; tags: string[]; demo: 'tree' | 'split' | 'chat' | 'curve' | 'matrix' | 'pipe' }
/** A tool: [logo file in /assets/imgs/editorial/logos ('' = monogram), name, monogram]. */
export type Tool = [string, string, string?]
export type SkillGroup = [string, string, Tool[]]

export const services: Service[] = [
	{ t: 'React development', d: 'Dynamic web apps with React, Redux and React Query, built on clean component architecture.', tags: ['React', 'Redux', 'React Query'], demo: 'tree' },
	{ t: 'UI implementation', d: 'Pixel-perfect, responsive interfaces from Figma with Tailwind CSS, Ant Design, Bootstrap and SASS.', tags: ['Tailwind', 'Ant Design', 'SASS'], demo: 'split' },
	{ t: 'Real-time apps', d: 'Live dashboards, chat and remote sessions using WebRTC, WebSockets and REST APIs.', tags: ['WebRTC', 'WebSockets', 'REST'], demo: 'chat' },
	{ t: 'Animation', d: 'Scroll storytelling and micro-interactions with GSAP, always with a reduced-motion fallback.', tags: ['GSAP', 'ScrollTrigger', 'SplitText'], demo: 'curve' },
	{ t: 'Angular apps', d: 'Enterprise applications in Angular and TypeScript with role‑based access and structured modules.', tags: ['Angular', 'TypeScript'], demo: 'matrix' },
	{ t: 'DevOps basics', d: 'Docker, Git and GitHub Actions for repeatable builds and smooth deployments.', tags: ['Docker', 'Git', 'GitHub Actions'], demo: 'pipe' },
]
export const skills: SkillGroup[] = [
	['Languages', 'What I write in', [['html', 'HTML'], ['', 'CSS', 'CSS'], ['js', 'JavaScript'], ['ts', 'TypeScript']]],
	['Frameworks', 'What I build with', [['react', 'React'], ['next', 'Next.js'], ['redux', 'Redux'], ['angular', 'Angular'], ['vue', 'Vue.js']]],
	['Styling & UI', 'How it looks', [['tailwind', 'Tailwind CSS'], ['sass', 'SASS'], ['bootstrap', 'Bootstrap'], ['', 'Ant Design', 'AD']]],
	['Real-time & data', 'How it talks', [['', 'WebRTC', 'RTC'], ['', 'WebSockets', 'WS'], ['', 'REST APIs', 'API'], ['', 'React Query', 'RQ'], ['firebase', 'Firebase']]],
	['Tools', 'How it ships', [['', 'GSAP', 'GS'], ['', 'Docker', 'DK'], ['', 'Git & Actions', 'GIT'], ['', 'Linux', 'SH']]],
]

export const CONTACT = {
	email: 'vduraisingh@gmail.com',
	phone: '+919788621632',
	phoneLabel: '+91 97886 21632',
	linkedin: 'https://www.linkedin.com/in/duraisinghpandi-v-320129116',
	github: 'https://github.com/Durai0226',
	x: 'https://x.com/DuraiSinghPandi',
}

/** The issue's contents: section id, name, page, descriptor (the dock and the contents sheet). */
export const SECTIONS: [string, string, string][] = [
	['#top', 'Cover', 'Hello'],
	['#about', 'About', "Editor's letter"],
	['#numbers', 'Numbers', '5+ years'],
	['#services', 'What I do', '6 services'],
	['#experience', 'Experience', '3 companies'],
	['#work', 'Selected work', '7 projects'],
	['#skills', 'Toolbox', '22 tools'],
	['#contact', 'Contact', "Let's talk"],
]
