/* Projects: the single source of truth for the home page (gallery, grid, list, chapters, numbers) and the case-study
 * routes (/work/[slug]). Screens are illustrative UI drawn in code with sample data (see lib/editorial/screens.ts).
 *
 * TODO(Durai): DS Integra, HRMS and Trojan list DataSirpi as the client but are dated before Aug 2023 (the DataSirpi
 * role starts then) — please confirm. Viva-Vita (Oct 2021 – Jan 2022) is listed under Accubits, whose role starts
 * Mar 2022. Real product screenshots can replace the illustrative screens without layout changes. */

/** A floating UI card around a device: [tone, label, title, meta, left, top]. */
export type Floater = ['dark' | 'light', string, string, string, string, string]
/** A highlight crop of the product screen: [x, y, w, h, caption, index of the matching feature]. */
export type Crop = [number, number, number, number, string, number]

export type Project = {
	id: string
	slug: string
	title: string
	what: string
	year: string
	dur: string
	company: string
	role: string
	stack: string
	tags: string[]
	c1: string
	c2: string
	bg: string
	sum: string
	deck: string
	feats: string[]
	flts: Floater[]
	pal: [string, string][]
	crops: Crop[]
}

export const projects: Project[] = [

	{ id: 'd2', slug: 'd2defense', title: 'D2Defense', what: 'Device management & security platform', year: '2024', dur: 'Apr 2024 – Present', company: 'DataSirpi', role: 'Frontend lead', stack: 'React, SASS, React Query, Redux', tags: ['React'], c1: '#7c3aed', c2: '#db2777', bg: '#1a0f33', sum: 'A modern device management platform with advanced security features and real-time monitoring.', deck: 'Securing every device, with the session in the browser.', feats: ['Led development using React, SASS, React Query and Redux', 'Implemented secure remote desktop access', 'Designed the real-time activity tracking dashboard', 'Developed a script management system with validation', 'Enhanced device management capabilities'],
		flts: [['dark', 'Live session', 'Rohan K. → ENG-MB-0087', '● View only · REC 12:41', '8%', '6%'], ['light', 'Script validation', 'patch-kb503 passed', '0 errors · 3 checks', '70%', '74%']], pal: [['Console', '#0c0a12'], ['Violet', '#7c3aed'], ['Magenta', '#db2777'], ['Safe', '#34d399'], ['Risk', '#fb7185']], crops: [[906, 322, 374, 220, 'Remote desktop in the browser', 1], [240, 160, 1040, 150, 'Real-time activity at a glance', 2], [240, 300, 690, 420, 'Device management table', 4]] },
	{ id: 'nft', slug: 'avis-nft', title: 'AVIS NFT', what: 'NFT marketplace', year: '2022', dur: 'Mar 2022 – Aug 2022', company: 'Accubits Technologies', role: 'Frontend developer', stack: 'React, Next.js, TypeScript, Styled Components', tags: ['React', 'Next.js'], c1: '#6d28d9', c2: '#f472b6', bg: '#170a2e', sum: 'A blockchain-based platform for creating, buying and selling NFTs, delivered on time and recognised with the Accu Star Award.', deck: 'Mint, list and trade, with an award for shipping on time.', feats: ['Built the NFT platform with blockchain integration', 'Implemented a clean UI design and codebase', 'Developed NFT creation and trading features', 'Received the Accu Star Award for timely completion', 'Ensured seamless module integration'],
		flts: [['light', 'Bid placed', 'Aurora Drift #12', '1.25 ETH · confirmed', '4%', '10%'], ['dark', 'Mint NFT', 'Royalties 10%', 'Ready to mint', '74%', '70%']], pal: [['Night', '#0f0a1c'], ['Violet', '#6d28d9'], ['Pink', '#f472b6'], ['Lilac', '#a78bfa'], ['Frost', '#efeaff']], crops: [[0, 60, 700, 280, 'Marketplace hero and wallet connect', 0], [700, 70, 580, 280, 'Live auction card', 2], [0, 390, 1280, 400, 'Collection grid with bids', 1]] },
	{ id: 'integra', slug: 'ds-integra', title: 'DS Integra', what: 'CRM & omnichannel inbox', year: '2022', dur: 'Aug 2022 – Apr 2023', company: 'DataSirpi', role: 'Frontend developer', stack: 'Vue.js, SASS, REST API', tags: ['Vue'], c1: '#0f766e', c2: '#2dd4bf', bg: '#052a26', sum: 'A CRM and omnichannel platform that brings customer conversations into one place for the whole team.', deck: 'Every customer conversation, in one inbox.', feats: ['Developed the CRM platform', 'Implemented multi-channel communication features', 'Created a user-friendly interface with Vue.js', 'Enhanced customer relationship management capabilities', 'Integrated scalable solutions for team collaboration'],
		flts: [['light', 'WhatsApp', 'New message from Priya', '“Hi, my order hasn’t…”', '6%', '8%'], ['dark', 'Assigned to you', 'Order #1042', 'Priority · open', '72%', '72%']], pal: [['Forest', '#0b2b27'], ['Teal', '#0f766e'], ['Mint', '#2dd4bf'], ['Mist', '#f4f7f6'], ['Amber', '#f59e0b']], crops: [[64, 0, 300, 520, 'Channels and conversations', 1], [364, 0, 636, 800, 'Conversation with order context', 3], [1000, 0, 280, 560, 'Customer profile and timeline', 2]] },
	{ id: 'hrms', slug: 'hrms', title: 'HRMS', what: 'HR management system', year: '2022', dur: 'Mar 2022 – Aug 2022', company: 'DataSirpi', role: 'Frontend developer', stack: 'Angular, TypeScript, Bootstrap', tags: ['Angular'], c1: '#1d4ed8', c2: '#60a5fa', bg: '#0a1a3d', sum: 'A complete HR management system with role-based access and employee lifecycle management.', deck: 'The employee lifecycle, from offer to offboarding.', feats: ['Implemented the employee onboarding and offboarding system', 'Developed role-based access control', 'Created a responsive, maintainable codebase', 'Enhanced data security measures', 'Streamlined HR operations workflow'], flts: [], pal: [['Navy', '#0b1b40'], ['Blue', '#1d4ed8'], ['Sky', '#60a5fa'], ['Cloud', '#f5f7fb'], ['Green', '#16a34a']], crops: [[220, 0, 1060, 280, 'Headcount at a glance', 4], [220, 250, 760, 480, 'People directory', 1], [960, 250, 320, 420, 'Onboarding checklist', 0]] },
	{ id: 'trojan', slug: 'trojan', title: 'Trojan', what: 'Equipment rental platform', year: '2022', dur: 'Mar 2022 – Aug 2022', company: 'DataSirpi', role: 'Frontend developer', stack: 'Angular, TypeScript, REST API', tags: ['Angular'], c1: '#ea580c', c2: '#fbbf24', bg: '#34160a', sum: 'An equipment rental platform with management, booking and tracking capabilities.', deck: 'Rentals, bookings and oversight in one board.', feats: ['Built the equipment rental management system', 'Implemented a role-based data access structure', 'Developed admin oversight capabilities', 'Created a secure data management system', 'Enhanced the user experience with an intuitive interface'], flts: [], pal: [['Clay', '#2a1608'], ['Orange', '#ea580c'], ['Amber', '#fbbf24'], ['Sand', '#fbf7f2'], ['Slate', '#64748b']], crops: [[0, 60, 1280, 250, 'Equipment availability', 0], [0, 290, 1280, 300, 'Weekly booking board', 2], [0, 0, 640, 480, 'Fleet overview', 1]] },
	{ id: 'viva', slug: 'viva-vita', title: 'Viva-Vita', what: 'Product website', year: '2021', dur: 'Oct 2021 – Jan 2022', company: 'Accubits Technologies', role: 'Frontend developer', stack: 'React, GSAP, CSS3', tags: ['React'], c1: '#2f7d32', c2: '#a3d977', bg: '#10301a', sum: 'A website showcasing a coconut product range, built pixel-perfect from Figma with GSAP animation.', deck: 'A coconut brand, brought to life with GSAP.', feats: ['Developed the website in React', 'Integrated GSAP animations', 'Ensured responsive design across devices', 'Implemented the Figma design pixel-perfect', 'Enhanced the experience with animation'], flts: [], pal: [['Leaf', '#143018'], ['Green', '#2f7d32'], ['Lime', '#a3d977'], ['Cream', '#f6f1e6'], ['Husk', '#6b4226']], crops: [[0, 0, 700, 520, 'Hero typography', 3], [600, 60, 680, 480, 'Illustrated product hero', 1], [0, 480, 1280, 320, 'Product range', 2]] },
	{ id: 'fg', slug: 'futuregril-nft', title: 'FutureGril NFT', what: 'NFT platform', year: '2022', dur: '2022', company: 'Xnovaa Digital', role: 'Frontend developer', stack: 'React, TypeScript, Web3', tags: ['React'], c1: '#db2777', c2: '#fb923c', bg: '#330a1f', sum: 'An NFT platform with complete user and admin functionality.', deck: 'Profiles, transfers and bulk uploads for collectors.', feats: ['Developed sign-in and sign-up', 'Created user profile management', 'Implemented the NFT transfer feature', 'Built bulk upload', 'Enhanced the admin and user modules'], flts: [], pal: [['Plum', '#14080f'], ['Pink', '#db2777'], ['Orange', '#fb923c'], ['Blush', '#fbe8f1'], ['Violet', '#7c3aed']], crops: [[0, 0, 390, 420, 'Collector profile', 1], [0, 380, 390, 300, 'Owned collection', 4], [0, 600, 390, 244, 'Transfer flow', 2]] },
]

export const projectById: Record<string, Project> = Object.fromEntries(projects.map((p) => [p.id, p]))
export const projectBySlug: Record<string, Project> = Object.fromEntries(projects.map((p) => [p.slug, p]))
