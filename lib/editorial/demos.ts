/* The small live demos for "What I do" (static markup; lib/editorial/engine.ts plays them). */
import type { Service } from '@/data/site'

export const DEMOS: Record<Service['demo'], string> = {
	tree: `<svg class="tree" viewBox="0 0 420 300"><path d="M210 58 V88 M210 88 H90 V130 M210 88 H330 V130 M90 170 V200 H40 V232 M90 200 H150 V232 M330 170 V232"/><rect x="150" y="18" width="120" height="40" rx="10"/><text x="210" y="43" text-anchor="middle">&lt;App /&gt;</text><rect x="20" y="130" width="140" height="40" rx="10"/><text x="90" y="155" text-anchor="middle">&lt;Dashboard /&gt;</text><rect x="260" y="130" width="140" height="40" rx="10"/><text x="330" y="155" text-anchor="middle">&lt;Settings /&gt;</text><rect x="0" y="232" width="80" height="40" rx="10"/><text x="40" y="257" text-anchor="middle">&lt;Chart/&gt;</text><rect x="100" y="232" width="100" height="40" rx="10"/><text x="150" y="257" text-anchor="middle">&lt;Table/&gt;</text><rect x="270" y="232" width="120" height="40" rx="10"/><text x="330" y="257" text-anchor="middle">useQuery()</text></svg>`,
	split: `<div class="split"><div class="wire"><span class="label">Figma</span><i style="width:70%"></i><i style="width:90%"></i><i style="width:50%"></i><i style="width:35%;height:26px;border-radius:13px"></i></div><div class="built"><span class="label" style="color:#5e5e6e">Code</span><b>Upgrade your plan</b><span>Unlock live monitoring and remote sessions.</span><span class="btn-s">Get started</span></div></div>`,
	chat: `<div class="chat"><span class="live"><span class="pulse"></span>Live · WebSocket connected</span><div class="b">Is the remote session ready?</div><div class="b me">Yes, connecting now.</div><div class="b">Screen is streaming 👌</div><div class="b me">Latency 38 ms</div></div>`,
	curve: `<svg class="curve" viewBox="0 0 420 300"><path class="grid" d="M40 260 H400 M40 40 V260"/><path d="M40 260 C 170 260, 150 40, 400 40"/><circle id="curveDot" cx="40" cy="260" r="9"/><text x="40" y="285" class="mono" font-size="12" fill="currentColor">ease: "power3.inOut"</text></svg>`,
	matrix: `<table class="matrix"><thead><tr><th>Role</th><th>View</th><th>Edit</th><th>Admin</th></tr></thead><tbody><tr><td>Employee</td><td class="y">✓</td><td>—</td><td>—</td></tr><tr><td>Manager</td><td class="y">✓</td><td class="y">✓</td><td>—</td></tr><tr><td>HR</td><td class="y">✓</td><td class="y">✓</td><td class="y">✓</td></tr></tbody></table>`,
	pipe: `<div class="pipe"><div class="step"><i>✓</i><b>Install</b><span>12s</span></div><div class="step"><i>✓</i><b>Test</b><span>48s</span></div><div class="step"><i>✓</i><b>Build image</b><span>1m 06s</span></div><div class="step"><i>✓</i><b>Deploy</b><span>22s</span></div></div>`,
}

/** The email as a barcode: bar widths come from the characters (decorative; the text sits below it). */
export function barcode(text: string) {
	let x = 0
	const rects: [number, number][] = []
	const bar = (w: number) => { rects.push([x, w]); x += w }
	bar(2); x += 1.5; bar(1); x += 1.5
	for (const ch of text) {
		const c = ch.charCodeAt(0)
		for (let b = 0; b < 3; b++) { bar(1 + ((c >> (b * 2)) & 3) * 0.7); x += 1.2 + ((c >> (b + 1)) & 1) * 1.4 }
	}
	bar(1); x += 1.5; bar(2)
	return { width: +x.toFixed(1), rects }
}
