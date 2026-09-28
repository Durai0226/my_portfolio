/* The case study (v13 filmstrip) as one HTML string, shared by the home overlay (injected on open) and the static
 * /work/[slug] routes (rendered on the server). Motion is added by lib/editorial/engine.ts (caseMotion). */
import { projects, type Crop, type Floater, type Project } from '@/data/projects'
import { SCREEN_OF, browserDev, device } from './screens'

/** Multi-word tool names (from every project's stack) never break inside the name: "React Query", "Styled Components". */
const TOOL_NAMES = projects.flatMap((p) => p.stack.split(', ')).filter((t, i, all) => t.includes(' ') && all.indexOf(t) === i)
const keepTools = (s: string) => TOOL_NAMES.reduce((out, t) => out.split(t).join(t.replace(/ /g, '\u00a0')), s)

export const fltHTML = (f: Floater, k: number) =>
	`<div class="flt ${f[0] === 'dark' ? 'flt--dark' : ''}" data-depth="${k ? 40 : 80}" style="${parseFloat(f[4]) >= 50 ? 'right:4%' : `left:${f[4]}`};top:${f[5]}"><small>${f[1]}</small><b>${f[2]}</b><span>${f[3]}</span></div>`

/** A lazily filled, "contain"-fitted crop of the product screen (filled by the engine when it comes near). */
export const cropBox = (p: Project, r: Crop, cls = '') => {
	const [k, sk] = SCREEN_OF[p.id]
	return `<div class="cx ${cls}" aria-hidden="true" data-crop="${r.slice(0, 4).join(',')}" data-sk="${sk}"><div class="scr scr--${k}"></div></div>`
}

/** Black or white text for a swatch, by luminance. */
const tone = (h: string) => {
	const n = parseInt(h.slice(1), 16), l = 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)
	return l > 150 ? '#14160e' : '#fff'
}

export function caseHTML(p: Project) {
	const i = projects.indexOf(p), nx = projects[(i + 1) % projects.length], pr = projects[(i + projects.length - 1) % projects.length]
	const N = projects.length
	const chip = (fig: number, t: string, d: string, cls = '') => `<p class="lx__chip${cls}" data-rv><small>Fig. ${fig}</small><b>${t}</b>${d ? `<span>${d}</span>` : ''}</p>`
	const crop = (c: Crop, k: number) => `<figure class="lx__item" style="margin:0"><div class="lx__panel lx__panel--crop" data-media><div class="in">${cropBox(p, c, 'cx--fit')}</div></div>${chip(k + 2, c[4], p.feats[c[5]] || '')}</figure>`
	return `<div class="case__content cz lx" style="--cz-c:${p.c1};--cz-c1:${p.c1};--cz-c2:${p.c2};--sbg:${p.bg};--c1:${p.c1};--c2:${p.c2}">
	<div class="case__bar"><button type="button" class="back" data-close>← All work</button><span class="t">P/0${i + 1} · ${p.title} · ${p.what}</span><button type="button" class="prev" data-go="${pr.id}">← ${pr.title}</button><button type="button" data-go="${nx.id}">${nx.title} →</button><button type="button" class="x" data-close aria-label="Close case study">Close ✕</button></div>
	<div class="lx__pin"><div class="lx__track">
		<header class="lx__item lx__intro" data-tint="base"><p class="hp__num" data-rv><b>0${i + 1}</b>/ 0${N} · ${p.what}</p><h2 class="lx__t display" id="caseTitle" data-lines>${p.title}</h2>
			<div class="lx__cols"><div><p class="deck" data-lines>${p.deck}</p><p data-lines>${p.sum}</p></div>
			<dl class="lx__dl" data-rv><div><dt>Role</dt><dd>${p.role}</dd></div><div><dt>Company</dt><dd>${p.company}</dd></div><div><dt>Timeline</dt><dd>${p.dur}</dd></div><div><dt>Stack</dt><dd>${keepTools(p.stack)}</dd></div></dl></div></header>
		<figure class="lx__item" style="margin:0"><div class="lx__panel lx__panel--stage" data-media><div class="hp__bg"></div><div class="in"><div class="hp__stage"><div class="hp__dev">${device(p.id)}</div>${p.flts.map(fltHTML).join('')}</div></div></div></figure>
		<section class="lx__item lx__text"><p class="cz__lab" data-rv><b>01</b>What I did</p><h3 class="cz__h" data-lines>My role on the project</h3><ol class="cz__list">${p.feats.map((f) => `<li data-row>${keepTools(f)}</li>`).join('')}</ol></section>
		<figure class="lx__item" style="margin:0"><div class="lx__panel lx__panel--screen" data-media><div class="in">${browserDev(p.id)}</div></div>${chip(1, p.title + ', main screen', 'Illustrative UI with sample data')}</figure>
		<figure class="lx__item" style="margin:0" data-tint="light"><div class="lx__panel lx__panel--sq" data-media><div class="lx__lock"><b>${p.title}</b><i></i><span>${p.company}</span><small>${p.year} · ${p.what}</small></div></div></figure>
		${p.crops.map(crop).join('')}
		<figure class="lx__item" style="margin:0"><div class="lx__panel lx__panel--sq" data-media><div class="lx__pal">${p.pal.map(([n, h]) => `<div style="--c:${h};--t:${tone(h)}">${n}<code>${h}</code></div>`).join('')}</div></div>${chip(p.crops.length + 2, 'Interface palette', 'Colours of the illustrative UI', ' lx__chip--top')}</figure>
		<figure class="lx__item" style="margin:0"><div class="lx__panel lx__panel--floor" data-media><div class="in">${device(p.id)}</div></div></figure>
		<section class="lx__item lx__text"><p class="cz__lab" data-rv><b>02</b>Built with</p><h3 class="cz__h" data-lines>The tools behind it</h3><div class="cz__chips">${p.stack.split(', ').map((x) => `<span class="chip" data-rv>${x}</span>`).join('')}</div><p class="lx__note" data-rv style="margin-top:22px">Screens are illustrative recreations with sample data, drawn in code for this portfolio. Real product screenshots can replace them.</p></section>
		<button class="lx__item lx__next" type="button" data-go="${nx.id}" style="--n1:${nx.c1}"><small>Next project · 0${((i + 1) % N) + 1} / 0${N}</small><b>${nx.title}</b><span class="go">Next project <i></i><span class="ar" aria-hidden="true">→</span></span></button>
	</div><div class="lx__foot" aria-hidden="true"><span class="n">01 / 12</span><span class="bar"><i></i></span><span class="hint">Scroll to explore ››</span></div></div>
</div>`
}
