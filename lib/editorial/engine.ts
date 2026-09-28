/* The Issue — client motion and behaviour for the editorial home page, ported from the approved design preview (v13).
 * `startEditorial()` wires everything to the server-rendered markup and returns a cleanup that removes every listener,
 * observer, timer, split, ScrollTrigger and Lenis instance (React strict mode re-runs effects in development).
 *
 * Rules learned while building the preview (see the plan's Verification section):
 * - never CSS-transition a property GSAP animates; never put filter/transform on an ancestor of a pinned element;
 * - ScrollTrigger.sort() + refresh() once every trigger exists, and again after fonts load;
 * - Lenis must ignore the case and contents scrollers (data-lenis-prevent), or their wheel events are swallowed. */
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { CustomEase } from 'gsap/CustomEase'
import { Flip } from 'gsap/Flip'
import Lenis from 'lenis'
import { projects, projectById, projectBySlug, type Project } from '@/data/projects'
import { roles } from '@/data/experience'
import { services, skills } from '@/data/site'
import { SCREENS, SCREEN_OF, browserDev } from './screens'
import { caseHTML } from './caseHTML'

type El = HTMLElement
type Any = any

const $ = <T extends Element = El>(s: string, r: ParentNode = document) => r.querySelector(s) as T
const $$ = <T extends Element = El>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll(s)) as T[]

export type EditorialMode = { page: 'home' } | { page: 'case'; id: string }

/** The dock's pages: section, name. */
const SECS: [string, string][] = [['#top', 'Cover'], ['#about', 'About'], ['#numbers', 'Numbers'], ['#services', 'What I do'], ['#experience', 'Experience'], ['#work', 'Selected work'], ['#skills', 'Toolbox'], ['#contact', 'Contact']]

export function startEditorial(mode: EditorialMode = { page: 'home' }) {
	gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, Flip)
	const root = document.documentElement
	const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches
	const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches
	const MOTION = !REDUCED
	const HOME = mode.page === 'home'

	/* ---------- bookkeeping: everything registered here is undone by the returned cleanup ---------- */
	const ac = new AbortController()
	const on = (t: EventTarget, type: string, fn: Any, opts: AddEventListenerOptions = {}) => t.addEventListener(type, fn, { ...opts, signal: ac.signal })
	const timers = new Set<number>()
	/* whether the last input was the keyboard: focus handed back after a tap or a click draws no focus ring */
	let kbd = false
	on(window, 'keydown', () => { kbd = true }, { capture: true }); on(window, 'pointerdown', () => { kbd = false }, { capture: true })
	/** Keeps Tab and Shift+Tab inside a dialog: moves through the visible focusable elements and wraps at both ends. */
	const trapTab = (e: KeyboardEvent, list: El[]) => {
		const f = list.filter((el) => el.tabIndex >= 0 && !(el as HTMLButtonElement).disabled && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden')
		if (!f.length) return
		e.preventDefault()
		const i = f.indexOf(document.activeElement as El)
		f[i < 0 ? (e.shiftKey ? f.length - 1 : 0) : (i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus()
	}
	/** Undoes the scrolling a browser does inside overflow-hidden boxes to reveal a focused element (our motion places it instead). */
	const unscroll = (el: El, until: El) => { for (let n: El | null = el.parentElement; n && n !== until.parentElement; n = n.parentElement) { n.scrollLeft = 0; n.scrollTop = 0 } }
	const later = (fn: () => void, ms: number) => { const id = window.setTimeout(() => { timers.delete(id); fn() }, ms); timers.add(id); return id }
	const clearLater = (id?: number) => { if (id) { clearTimeout(id); timers.delete(id) } }
	const intervals: number[] = []
	const observers: { disconnect(): void }[] = []
	const splits: SplitText[] = []
	const split = (el: Any, vars: Any) => { const s = new SplitText(el, vars); splits.push(s); return s }
	const ctx = gsap.context(() => {})
	/* Record tweens made later (in event handlers) into ctx so cleanup reverts them. If a context is already active (a
	 * matchMedia breakpoint, say) the tweens belong to it: calling ctx.add from inside another context would make the two
	 * contexts contain each other and revert() would recurse forever. */
	const record = (fn: () => void) => { if ((gsap as Any).context()) fn(); else ctx.add(fn) }
	const add = <A extends unknown[]>(fn: (...a: A) => void) => (...a: A) => record(() => fn(...a))
	/* ScrollTrigger runs each callback inside the context its trigger was made in; refreshing while another context is
	 * active would push that one into it (the same recursion), so every explicit refresh runs outside all contexts. */
	const refresh = () => { const c = (gsap as Any).context(); if (c) c.ignore(() => ScrollTrigger.refresh()); else ScrollTrigger.refresh() }
	const mm = gsap.matchMedia()
	let lenis: Lenis | null = null
	const tickers: ((t: number) => void)[] = []
	const scrollTargets: Record<string, () => number> = {}
	const refreshListeners: (() => void)[] = [], scrollEndListeners: (() => void)[] = []

	/* ================= Product screens: scaled to their frames, built when they come near ================= */
	const fitRO = new ResizeObserver((entries) => entries.forEach((en) => { const s = en.target.firstElementChild as El | null; if (s) (en.target as El).style.setProperty('--k', String(Math.ceil((en.contentRect.width / (s.classList.contains('scr--p') ? 390 : 1280)) * 1e4) / 1e4)) }))
	observers.push(fitRO)
	const fillScreen = (f: El) => { const id = f.dataset.lazy; if (!id) return; (f.firstElementChild as El).innerHTML = SCREENS[SCREEN_OF[id][1]](); f.removeAttribute('data-lazy') }
	/* Screens are heavy (hundreds of nodes each): build them one per frame within a small budget so a burst of screens
	 * coming into range (the numbers fan, a case study) never costs one long frame. */
	const fillQ: El[] = []
	let fillRaf = 0
	const pump = () => { fillRaf = 0; const t = performance.now(); while (fillQ.length) { fillScreen(fillQ.shift()!); if (performance.now() - t > 6) break } if (fillQ.length) fillRaf = requestAnimationFrame(pump) }
	const queueFill = (f: El) => { fillQ.push(f); if (!fillRaf) fillRaf = requestAnimationFrame(pump) }
	const lazyIO = new IntersectionObserver((es) => es.forEach((e) => { if (!e.isIntersecting) return; queueFill(e.target as El); lazyIO.unobserve(e.target) }), { rootMargin: '100% 100%' })
	observers.push(lazyIO)
	const fitted = new WeakSet<Element>()
	const fitAll = (r: ParentNode = document) => $$('.fit', r).forEach((f) => { if (fitted.has(f)) return; fitted.add(f); fitRO.observe(f); if (f.dataset.lazy) lazyIO.observe(f) })
	fitAll()

	/* ================= Copy buttons ================= */
	$$('[data-copy]').forEach((b) => on(b, 'click', async (e: Event) => {
		e.preventDefault(); e.stopPropagation()
		const label = b.textContent
		try { await navigator.clipboard.writeText(b.dataset.copy || ''); b.textContent = 'Copied' } catch { b.textContent = 'Select the text to copy' }
		later(() => { b.textContent = label }, 2000)
	}))

	/* ================= Theme: dark (lime cover) / light (paper cover); the new theme opens in a circle from the button ================= */
	const isDark = () => (root.dataset.theme ? root.dataset.theme === 'dark' : !matchMedia('(prefers-color-scheme: light)').matches)
	const themeBtn = $('#themeBtn')
	const syncTheme = () => {
		$$('[data-theme-set]').forEach((b) => b.setAttribute('aria-pressed', String((b.dataset.themeSet === 'dark') === isDark())))
		if (themeBtn) { themeBtn.setAttribute('aria-label', isDark() ? 'Switch to light theme' : 'Switch to dark theme'); themeBtn.textContent = isDark() ? '◐' : '◑' }
	}
	function setTheme(next: 'dark' | 'light', from?: El) {
		if ((next === 'dark') === isDark() && root.dataset.theme) return
		const apply = () => { root.dataset.theme = next; try { localStorage.setItem('ds-theme', next) } catch {} syncTheme() }
		const r = from ? from.getBoundingClientRect() : { left: innerWidth / 2, top: 0, width: 0, height: 0 }
		const x = r.left + r.width / 2, y = r.top + r.height / 2
		const doc = document as Any
		if (!doc.startViewTransition || REDUCED) { apply(); return }
		const t = doc.startViewTransition(apply)
		t.ready.then(() => root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))}px at ${x}px ${y}px)`] }, { duration: 750, easing: 'cubic-bezier(.65,.05,0,1)', pseudoElement: '::view-transition-new(root)' })).catch(() => {})
	}
	$$('[data-theme-set]').forEach((b) => on(b, 'click', () => setTheme(b.dataset.themeSet as 'dark' | 'light', b)))
	if (themeBtn) on(themeBtn, 'click', (e: Event) => setTheme(isDark() ? 'light' : 'dark', e.currentTarget as El))
	syncTheme()

	/* ================= India clock ================= */
	const fmtTime = () => new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }).format(new Date())
	const tickClock = () => {
		const t = fmtTime(), set = (id: string, s: string) => { const el = document.getElementById(id); if (el) el.textContent = s }
		set('clock', 'India ' + t); set('bcClock', 'India · ' + t + ' IST'); set('sheetClock', 'India · ' + t + ' IST')
	}
	tickClock(); intervals.push(window.setInterval(tickClock, 20000))

	/* ================= Case study (home overlay, or the whole page on /work/[slug]) ================= */
	const caseEl = $('#case'), caseScroll = $('#caseScroll')
	let caseOpen: string | null = null, caseReturn: El | null = null, caseCtx: gsap.Context | null = null, caseLenis: Lenis | null = null, caseTick: ((t: number) => void) | null = null, caseSize: (() => void) | null = null
	let cxIO: IntersectionObserver | null = null
	function layoutCx(r: ParentNode) {
		$$('.cx', r).forEach((el) => {
			const [x, y, w, h] = (el.dataset.crop || '').split(',').map(Number), W = el.clientWidth, H = el.clientHeight; if (!W) return
			const fit = el.classList.contains('cx--fit'), s0 = el.firstElementChild as El
			const sc = fit ? Math.min(W / w, H / h, W / (s0.offsetWidth * 0.28)) : Math.max(W / w, H / h), SW = s0.offsetWidth * sc, SH = s0.offsetHeight * sc
			let tx = -x * sc + (W - w * sc) / 2, ty = -y * sc + (H - h * sc) / 2
			if (fit) { tx = SW > W ? Math.min(0, Math.max(W - SW, tx)) : (W - SW) / 2; ty = SH > H ? Math.min(0, Math.max(H - SH, ty)) : (H - SH) / 2 }
			s0.style.transform = `translate(${tx}px, ${ty}px) scale(${sc})`
		})
	}
	const cxFill = (el: El) => { if (!el.dataset.sk) return; (el.firstElementChild as El).innerHTML = SCREENS[el.dataset.sk](); el.removeAttribute('data-sk'); layoutCx(el.parentElement as El) }
	const cxWatch = () => {
		cxIO?.disconnect()
		cxIO = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { cxFill(e.target as El); cxIO?.unobserve(e.target) } }), { root: caseScroll, rootMargin: '120% 0px' })
		$$('.cx[data-sk]', caseScroll).forEach((el) => cxIO!.observe(el))
	}
	function renderCase(id: string) {
		const p = projectById[id]
		caseScroll.innerHTML = caseHTML(p)
		wireCase()
	}
	function wireCase() {
		fitAll(caseScroll)
		requestAnimationFrame(() => { layoutCx(caseScroll); cxWatch() })
		$$('[data-close]', caseScroll).forEach((b) => b.addEventListener('click', () => closeCaseStudy()))
		$$('[data-go]', caseScroll).forEach((b) => b.addEventListener('click', () => (HOME ? openCaseStudy(b.dataset.go!, true) : location.assign(`/work/${projectById[b.dataset.go!].slug}`))))
	}
	function caseMotionKill() {
		if (caseSize) { ScrollTrigger.removeEventListener('refreshInit', caseSize); caseSize = null }
		const lx = $('.lx', caseScroll)
		if (lx) { lx.classList.remove('is-h', 'is-light'); lx.style.height = ''; $('.case__bar', caseScroll)?.classList.remove('is-float') }
		if (caseCtx) { caseCtx.revert(); caseCtx = null }
		if (caseLenis) { if (caseTick) gsap.ticker.remove(caseTick); caseLenis.destroy(); caseLenis = null; caseTick = null }
	}
	function caseMotion() {
		if (!MOTION) return
		caseMotionKill()
		const lx = $('.lx', caseScroll), track = $('.lx__track', lx), items = $$('.lx__item', track), H = innerWidth > 900
		caseLenis = new Lenis({ wrapper: caseScroll, content: caseScroll.firstElementChild as El, autoRaf: false, lerp: 0.09, smoothWheel: FINE })
		caseLenis.on('scroll', ScrollTrigger.update)
		caseTick = (t: number) => caseLenis?.raf(t * 1000); gsap.ticker.add(caseTick)
		caseCtx = gsap.context(() => {
			const EASE = 'expo.out', q = (sel: string) => caseScroll.querySelectorAll(sel)
			let S: Any = { scroller: caseScroll }
			if (H) {
				/* the filmstrip: vertical wheel moves one track sideways; the pin is CSS sticky, so it never jitters */
				lx.classList.add('is-h'); $('.case__bar', caseScroll)?.classList.add('is-float')
				const dist = () => track.scrollWidth - innerWidth
				const size = () => { lx.style.height = dist() + innerHeight + 'px' }
				size(); ScrollTrigger.addEventListener('refreshInit', size); caseSize = size
				const boxes = () => items.map((el) => { const pn = $('.lx__panel', el), inn = pn && $('.in', pn); return { c: el.offsetLeft + el.offsetWidth / 2, rot: pn ? gsap.quickSetter(el, 'rotationY', 'deg') : null, sc: pn ? gsap.quickSetter(el, 'scale') : null, ix: inn ? gsap.quickSetter(inn, 'x', 'px') : null, tint: el.dataset.tint } })
				let B = boxes(), cur = -1
				const foot = $('.lx__foot', lx), num = $('.n', foot), bar = $('.bar i', foot), hint = $('.hint', foot)
				/* the counter names the item under a reading line that travels from a quarter to three quarters of the screen as
				 * the strip goes from start to end, so it reads 01 on the opening screen and 12 once the last panel has arrived */
				const bend = (x: number) => {
					const vw = innerWidth, D = dist(), line = vw * (0.25 + 0.5 * (D > 0 ? Math.min(1, Math.max(0, -x / D)) : 0)); let best = 0, bd = 1e9
					B.forEach((b, k) => {
						const d = (b.c + x - vw / 2) / vw, dl = Math.abs(b.c + x - line)
						if (dl < bd) { bd = dl; best = k }
						if (!b.rot || Math.abs(d) > 1.6) return
						b.rot(gsap.utils.clamp(-26, 26, -d * 20)); b.sc!(1 - Math.min(0.07, Math.abs(d) * 0.06)); b.ix?.(d * -42)
					})
					if (best !== cur) { cur = best; num.textContent = String(best + 1).padStart(2, '0') + ' / ' + String(B.length).padStart(2, '0'); lx.classList.toggle('is-light', B[best].tint === 'light') }
				}
				const film = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { ...S, trigger: lx, start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true, onRefresh: () => { B = boxes() }, onUpdate: (st: Any) => { gsap.set(bar, { scaleX: st.progress }); gsap.set(hint, { opacity: st.progress > 0.02 ? 0 : 1 }) } }, onUpdate: () => bend(gsap.getProperty(track, 'x') as number) })
				bend(0)
				S = { ...S, containerAnimation: film }
			}
			const at = (trigger: Any, extra = 0) => (H ? { ...S, trigger, start: 'left ' + (88 + extra) + '%' } : { ...S, trigger, start: 'top ' + (88 + extra) + '%' })
			/* reveal 1 — text: lines rise out of masks (intro on open, the rest as they arrive) */
			q('[data-lines]').forEach((el) => { const sp = new SplitText(el, { type: 'lines', mask: 'lines' }), intro = el.closest('.lx__intro'); gsap.from(sp.lines, { yPercent: 105, duration: 1.1, stagger: 0.07, ease: EASE, delay: intro ? 0.35 : 0, scrollTrigger: intro ? undefined : at(el) }) })
			q('[data-rv]').forEach((el) => { const intro = el.closest('.lx__intro'); gsap.from(el, { y: 24, opacity: 0, duration: 1, ease: EASE, delay: intro ? 0.55 : 0, scrollTrigger: intro ? undefined : at(el, 4) }) })
			q('[data-row]').forEach((li) => { gsap.from(li, { y: 24, opacity: 0, duration: 1, ease: EASE, scrollTrigger: at(li, 4) }); gsap.fromTo(li, { '--rule': 0 }, { '--rule': 1, duration: 1.2, ease: EASE, scrollTrigger: at(li, 4) }) })
			/* reveal 2 — media: every panel opens from an inset and settles from a slight zoom */
			q('[data-media]').forEach((m, k) => {
				const first = k === 0 && H
				gsap.fromTo(m, { clipPath: 'inset(9% 9% 9% 9% round 22px)' }, { clipPath: 'inset(0% 0% 0% 0% round 22px)', duration: 1.4, ease: EASE, delay: first ? 0.3 : 0, scrollTrigger: first ? undefined : at(m, 8) })
				const pic = m.querySelector('.in > *'); if (pic) gsap.fromTo(pic, { scale: 1.1 }, { scale: 1, duration: 1.6, ease: EASE, delay: first ? 0.3 : 0, scrollTrigger: first ? undefined : at(m, 8) })
				const inn = m.querySelector('.in'); if (!H && inn) gsap.fromTo(inn, { y: 24 }, { y: -24, ease: 'none', scrollTrigger: { ...S, trigger: m, start: 'top bottom', end: 'bottom top', scrub: true } })
			})
			q('.lx__panel--stage .flt').forEach((f, k) => gsap.from(f, { y: 30, opacity: 0, duration: 1.1, ease: EASE, delay: 0.8 + k * 0.1 }))
			gsap.from(q('.lx__next b, .lx__next .go'), { yPercent: 50, opacity: 0, duration: 1.1, stagger: 0.08, ease: EASE, scrollTrigger: at($('.lx__next', caseScroll), 4) })
		}, caseScroll)
		/* re-measure only the case study's own triggers; the ~60 home-page triggers behind the overlay haven't moved */
		ScrollTrigger.getAll().filter((t) => (t as Any).scroller === caseScroll).forEach((t) => t.refresh())
	}
	const setHash = (h: string) => { try { history.replaceState(history.state, '', h) } catch {} }
	function openCaseStudy(id: string, swap?: boolean, src?: El | null) {
		if (!projectById[id]) return
		if (!caseOpen) caseReturn = document.activeElement as El
		caseOpen = id; caseMotionKill(); renderCase(id); caseScroll.scrollTop = 0
		setHash('#work/' + projectById[id].slug)
		caseEl.style.visibility = 'visible'; root.style.overflow = 'hidden'; lenis?.stop()
		if (MOTION) {
			const sr = src?.getBoundingClientRect()
			if (!swap && src && sr && sr.width) {
				gsap.fromTo(caseEl, { clipPath: `inset(${sr.top}px ${innerWidth - sr.right}px ${innerHeight - sr.bottom}px ${sr.left}px round ${src.classList.contains('hp') ? 32 : 18}px)` }, { clipPath: 'inset(0px 0px 0px 0px round 0px)', duration: 1.1, ease: 'expo.inOut' })
				/* shared element: a copy of the clicked card sits exactly on it, then dissolves while the page grows open */
				const ghost = src.cloneNode(true) as El
				ghost.removeAttribute('id'); ghost.classList.add('case__ghost'); ghost.setAttribute('aria-hidden', 'true')
				Object.assign(ghost.style, { left: sr.left + 'px', top: sr.top + 'px', width: sr.width + 'px', height: sr.height + 'px' }); caseEl.appendChild(ghost)
				gsap.to(ghost, { opacity: 0, duration: 0.6, delay: 0.2, ease: 'power1.inOut', onComplete: () => ghost.remove() })
			} else if (!swap) gsap.fromTo(caseEl, { clipPath: 'inset(100% 0% 0% 0% round 40px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 0.9, ease: 'expo.inOut' })
			else gsap.fromTo(caseScroll, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out', clearProps: 'transform' })
		}
		requestAnimationFrame(() => requestAnimationFrame(caseMotion))
		later(() => ($('.back', caseScroll) as El | null)?.focus({ preventScroll: true }), swap ? 0 : 500)
	}
	function closeCaseStudy() {
		if (!HOME) { location.assign('/#work'); return }
		if (!caseOpen) return
		caseOpen = null; setHash('#work')
		caseMotionKill()
		const done = () => { caseEl.style.visibility = 'hidden'; caseScroll.innerHTML = ''; root.style.overflow = ''; lenis?.start(); caseReturn?.focus({ preventScroll: true, focusVisible: kbd } as Any) }
		if (MOTION) gsap.to(caseEl, { clipPath: 'inset(0% 0% 100% 0% round 40px)', duration: 0.7, ease: 'expo.inOut', onComplete: done }); else done()
	}
	on(document, 'click', (e: Event) => { const t = (e.target as El).closest<El>('[data-open]'); if (t && !t.closest('.case')) openCaseStudy(t.dataset.open!, false, t.closest<El>('.hp') || t.querySelector<El>('.gcard__vis, .pcard__vis, .cvw__screen, .dev') || t) })
	on(window, 'keydown', (e: KeyboardEvent) => {
		if (!caseOpen) return
		if (e.key === 'Escape') closeCaseStudy()
		if (e.key === 'Tab') trapTab(e, $$('button, a[href]', caseScroll))
	})
	let caseH = innerWidth > 900
	on(window, 'resize', () => { if (!caseOpen) return; layoutCx(caseScroll); if ((innerWidth > 900) !== caseH) { caseH = innerWidth > 900; caseMotion() } })

	/* ================= /work/[slug]: the case study is the page ================= */
	if (!HOME) {
		caseOpen = mode.id
		wireCase()
		requestAnimationFrame(() => requestAnimationFrame(caseMotion))
		return cleanup
	}

	/* ================= Home ================= */
	const byId = projectById
	const hgCount = $('#hgCount'), setHg = (k: number) => { hgCount.innerHTML = `<b>0${k + 1}</b> / 03` }
	on($('#hgTrack'), 'scroll', (e: Event) => { const t = e.currentTarget as El; const f = t.scrollLeft / (t.scrollWidth - t.clientWidth || 1); setHg(Math.round(f * 2)); $('#hgBar').style.transform = `scaleX(${Math.max(0.02, f)})` }, { passive: true })

	/* ---- Work index: filter pills (GSAP Flip) and the grid / list switch ---- */
	function applyFilter(f: string) {
		$$('#filters button').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.f === f)))
		const cards = $$('.gcard'), match = (el: El) => f === 'All' || (el.dataset.tags || '').split(' ').includes(f)
		/* animate only a visible grid: a Flip (or any tween) that runs while the grid is display:none measures zero boxes and
		 * leaves stuck transforms behind (a card shifted up by half its height after List → Grid) */
		const gridOn = !$('#pgrid').hidden
		if (gridOn && MOTION) { Flip.killFlipsOf(cards, true); gsap.killTweensOf(cards) }
		const state = gridOn && MOTION ? Flip.getState(cards) : null
		cards.forEach((c) => c.classList.toggle('is-hidden', !match(c)))
		$$('.prow').forEach((r) => r.classList.toggle('is-hidden', !match(r)))
		if (state) record(() => Flip.from(state, { duration: 0.7, ease: 'expo.inOut', scale: true, absolute: true, stagger: 0.03, onComplete: () => refresh(), onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out' }), onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.85, duration: 0.4 }) }))
	}
	$$('#filters button').forEach((b) => on(b, 'click', () => applyFilter(b.dataset.f!)))
	$$('.view button').forEach((b) => on(b, 'click', add(() => {
		const list = b.dataset.view === 'list'
		$$('.view button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)))
		/* finish every card animation (filter Flip, reveal) and clear what it left inline before the other view shows */
		const cards = $$('.gcard'), rows = $$('.prow')
		Flip.killFlipsOf(cards, true); gsap.killTweensOf([...cards, ...rows]); gsap.set([...cards, ...rows], { clearProps: 'transform,opacity,translate,rotate,scale' })
		$('#pgrid').hidden = list; $('#plist').hidden = !list
		if (MOTION) gsap.fromTo(list ? '.prow:not(.is-hidden)' : '.gcard:not(.is-hidden)', { opacity: 0, y: 24 }, { opacity: 1, y: 0, stagger: 0.05, duration: 0.6, ease: 'expo.out', clearProps: 'transform,opacity' })
		refresh()
	})))

	/* ---- Cover: the featured card cycles through the three featured projects (pauses on hover and focus) ---- */
	;(() => {
		const card = $('#cvwCard'), dots = $('#cvwDots'), bar = $('#cvwBar'), F = projects.slice(0, 3)
		let i = 0, paused = false
		const html = (p: Project) => `<span class="cvw__screen" style="--pbg:${p.bg}">${browserDev(p.id)}</span><span class="cvw__meta"><b>${p.title}</b><small><span>${p.what}</span><span class="nw">${p.dur}</span></small><span class="go" aria-hidden="true">↗</span></span>`
		const show = add((k: number, anim: boolean) => {
			i = (k + F.length) % F.length; const p = F[i]
			card.dataset.open = p.id; card.setAttribute('aria-label', `Open the ${p.title} case study`)
			const put = () => { card.innerHTML = html(p); fitAll(card) }
			if (anim && MOTION) gsap.to(card, { clipPath: 'inset(0% 0% 100% 0% round 22px)', duration: 0.4, ease: 'power3.in', overwrite: true, onComplete: () => { put(); gsap.fromTo(card, { clipPath: 'inset(100% 0% 0% 0% round 22px)' }, { clipPath: 'inset(0% 0% 0% 0% round 22px)', duration: 0.7, ease: 'expo.out' }) } })
			else if (anim) put()
			$$('button', dots).forEach((d, n) => d.setAttribute('aria-current', String(n === i)))
			if (MOTION) { gsap.killTweensOf(bar); gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 4.5, ease: 'none', onComplete: () => show(i + 1, true) }); if (paused) gsap.getTweensOf(bar).forEach((t) => t.pause()) }
		})
		$$('button', dots).forEach((d, n) => on(d, 'click', () => show(n, true)))
		const cvw = $('#cvw')
		on(cvw, 'pointerenter', () => { paused = true; gsap.getTweensOf(bar).forEach((t) => t.pause()) })
		on(cvw, 'pointerleave', () => { paused = false; gsap.getTweensOf(bar).forEach((t) => t.resume()) })
		on(cvw, 'focusin', () => { paused = true; gsap.getTweensOf(bar).forEach((t) => t.pause()) })
		show(0, false)
	})()

	/* ---- Deep link: /#work/<slug> opens that case study ---- */
	const deepLink = () => { const m = location.hash.match(/^#work\/([\w-]+)/); return m && projectBySlug[m[1]] ? projectBySlug[m[1]].id : null }
	const deep = deepLink()
	if (deep) later(() => openCaseStudy(deep), 300)
	/* typing or following a #work/<slug> link on the page opens (or closes) the case study too */
	on(window, 'hashchange', () => { const id = deepLink(); if (id && id !== caseOpen) openCaseStudy(id); else if (!id && caseOpen) closeCaseStudy() })

	/* ---- Toolbox: facts per tool are looked up from the projects and roles ---- */
	const toolFacts = (name: string) => {
		const k = name.toLowerCase().replace(/ apis?$/, ' api').replace('git & actions', 'git').replace('.js', '')
		const hit = (str: string) => str.toLowerCase().replace(/\.js/g, '').split(/,\s*/).some((t) => t === k || t.startsWith(k))
		const projs = projects.filter((p) => hit(p.stack)).map((p) => p.title)
		const cos = roles.filter((j) => j.tags.some((t) => hit(t))).map((j) => j.full || j.co)
		if (projs.length) return `Used in ${projs.length} project${projs.length > 1 ? 's' : ''}: ${projs.join(', ')}`
		if (cos.length) return `In my stack at ${cos.join(', ')}`
		return null
	}
	const CATS = ['Languages', 'Frameworks', 'Styling & UI', 'Real-time & data', 'Tools']
	const TOOLS: Record<string, { f: string; mono?: string; cat: string }> = {}
	skills.forEach(([, , list], r) => list.forEach(([f, n, mono]) => { TOOLS[n] = { f, mono, cat: CATS[r] } }))
	const toolIcon = (f: string, mono?: string) => (f ? `<img src="/assets/imgs/editorial/logos/${f}.svg" alt="" loading="lazy">` : `<b>${mono}</b>`)
	const tbCard = $('#tbCard')
	const cardFor = (n: string) => { const t = TOOLS[n], f = toolFacts(n); tbCard.innerHTML = `<span class="ci">${toolIcon(t.f, t.mono)}</span><strong>${n}</strong><small>${t.cat}</small>${f ? `<p>${f}</p>` : '<p>Part of my everyday toolkit.</p>'}` }
	let tbTimer = 0
	if (!FINE) on($('#tbRows'), 'click', (e: Event) => { const w = (e.target as El).closest<El>('.tb__w'); if (!w) return; cardFor(w.dataset.tool!); tbCard.style.opacity = '1'; clearLater(tbTimer); tbTimer = later(() => { tbCard.style.opacity = '0' }, 3200) })

	/* ---- Contents sheet + dock (works with or without motion) ---- */
	const dock = $('#dock'), sheetWrap = $('#contents'), sheet = $('#sheet'), dim = $('#contentsDim'), menuBtn = $('#dockMenu')
	let sheetOpen = false, sheetReturn: El | null = null
	const insetFromDock = () => { const s = sheet.getBoundingClientRect(), d = dock.getBoundingClientRect(); return `inset(${d.top - s.top}px ${s.right - d.right}px ${s.bottom - d.bottom}px ${d.left - s.left}px round 999px)` }
	const setSheet = add((open: boolean) => {
		if (open === sheetOpen) return
		sheetOpen = open
		menuBtn.setAttribute('aria-expanded', String(open))
		if (open) { sheetReturn = document.activeElement as El; sheetWrap.style.visibility = 'visible' }
		if (MOTION) {
			gsap.killTweensOf([sheet, dim])
			gsap.to(dim, { opacity: open ? 1 : 0, duration: 0.5 })
			if (open) {
				gsap.fromTo(sheet, { clipPath: insetFromDock() }, { clipPath: 'inset(0px 0px 0px 0px round 30px)', duration: 0.9, ease: 'expo.out' })
				gsap.fromTo('.toc li', { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.04, ease: 'expo.out', delay: 0.12 })
				gsap.fromTo(['.contents__head', '.contents__foot'], { opacity: 0 }, { opacity: 1, duration: 0.6, delay: 0.3 })
			} else gsap.to(sheet, { clipPath: insetFromDock(), duration: 0.55, ease: 'power3.inOut', onComplete: () => { if (!sheetOpen) sheetWrap.style.visibility = 'hidden' } })
		} else { dim.style.opacity = open ? '1' : '0'; if (!open) sheetWrap.style.visibility = 'hidden' }
		if (open) later(() => ($('.toc a.is-here, .toc a', sheet) as El | null)?.focus({ preventScroll: true }), 60)
		else sheetReturn?.focus({ preventScroll: true, focusVisible: kbd } as Any)
	})
	on(menuBtn, 'click', () => setSheet(!sheetOpen))
	on(dim, 'click', () => setSheet(false))
	on(window, 'keydown', (e: KeyboardEvent) => {
		if (!sheetOpen) return
		if (e.key === 'Escape') { setSheet(false); return }
		if (e.key === 'Tab') trapTab(e, [...$$('a[href], button', sheet), menuBtn])
	})
	$$('.toc a').forEach((a) => on(a, 'click', () => setSheet(false)))
	/* keyboard focus is never left under the dock (the browser only brings a focused element into the viewport) */
	on(document, 'focusin', (e: FocusEvent) => {
		const el = e.target as El
		if ((e as Any).placed || !el.matches?.(':focus-visible') || el.closest('#dock, #contents, .case')) return
		requestAnimationFrame(() => {
			const r = el.getBoundingClientRect(), d = dock.getBoundingClientRect(), limit = d.top - 16
			if (r.bottom <= limit || r.top < 0 || r.right < d.left || r.left > d.right) return
			const y = scrollY + Math.min(r.bottom - limit, r.top - 16)
			if (lenis) lenis.scrollTo(y, { immediate: true, force: true }); else scrollTo(0, y)
		})
	})

	/* ---- Masthead fit: DURAI and SINGH sized so each word fills its share of the column ---- */
	const w1 = $('.mast__w--1'), w2 = $('.mast__w--2')
	function fitMast() {
		const W = root.clientWidth, mob = W <= 900
		root.style.setProperty('--mfs', '100px')
		const word = Math.max(w1.getBoundingClientRect().width, w2.getBoundingClientRect().width)
		if (mob) { const g = parseFloat(getComputedStyle($('.cv__top')).paddingLeft) || 16; root.style.setProperty('--mfs', Math.min(((W - g * 2) / word) * 100, innerHeight * (innerHeight < 720 ? 0.19 : 0.24)).toFixed(1) + 'px'); return }
		const L = $('#cvLeft'), cs = getComputedStyle(L), intro = $('#cvIntro')
		const used = intro.offsetHeight + parseFloat(getComputedStyle(intro).marginTop) + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom)
		const byW = (L.clientWidth / word) * 100, byH = (L.clientHeight - used) / 1.64
		root.style.setProperty('--mfs', Math.max(90, Math.min(byW, byH)).toFixed(1) + 'px')
	}
	/* Keep the featured card below the face: measure the drawn portrait and place the card under the chin */
	function placeCard() {
		const cvw = $('#cvw'), pt = $('#pt'), vis = $('.cv__visual')
		if (!cvw) return
		if (innerWidth <= 900) { cvw.style.top = ''; cvw.classList.remove('is-compact'); return }
		cvw.classList.remove('is-compact'); cvw.style.top = ''
		const r = pt.getBoundingClientRect(), sc = Math.min(r.width / 513, r.height / 462), ih = 462 * sc, faceBottom = r.bottom - ih + ih * 0.6
		const floor = $('#front').getBoundingClientRect().bottom - 96, v = vis.getBoundingClientRect()
		let h = cvw.offsetHeight
		if (faceBottom + 10 + h > floor) { cvw.classList.add('is-compact'); h = cvw.offsetHeight }
		const top = Math.min(faceBottom + 10, floor - h)
		cvw.style.top = Math.round(top - v.top) + 'px'; cvw.style.bottom = 'auto'
	}
	fitMast(); placeCard(); document.fonts?.ready.then(() => { if (!ac.signal.aborted) { fitMast(); placeCard() } })
	let pcT = 0, fitT = 0, htT = 0
	on(window, 'resize', () => { clearLater(pcT); pcT = later(placeCard, 180); clearLater(fitT); fitT = later(fitMast, 120) })

	/* ---- Halftone portrait: the photo re-drawn as print dots (crisp at any size) ---- */
	const pt = $('#pt'), ht = $<HTMLCanvasElement>('#ht'), ptImg = $<HTMLImageElement>('.pt__img')
	const HT: { dots: number[][]; p: number; ready: boolean } = { dots: [], p: 1, ready: false }
	function buildHalftone() {
		const r = pt.getBoundingClientRect(); if (!r.width || !ptImg.naturalWidth) return
		const dpr = Math.min(devicePixelRatio || 1, 2), pw = pt.clientWidth, ph = pt.clientHeight, sc = Math.min(pw / 513, ph / 462), W = Math.round(513 * sc), H = Math.round(462 * sc)
		Object.assign(ht.style, { width: W + 'px', height: H + 'px', left: Math.round((pw - W) / 2) + 'px', top: Math.round(ph - H) + 'px' })
		ht.width = Math.round(W * dpr); ht.height = Math.round(H * dpr)
		const pitch = W < 520 ? 3 : 3.8, rowH = pitch * 0.866, cols = Math.ceil(W / pitch) + 1, rows = Math.ceil(H / rowH) + 1
		const off = document.createElement('canvas'); off.width = cols; off.height = rows
		const o = off.getContext('2d', { willReadFrequently: true })!; o.drawImage(ptImg, 0, 0, cols, rows)
		let data: Uint8ClampedArray; try { data = o.getImageData(0, 0, cols, rows).data } catch { return }
		const dots: number[][] = []
		for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
			const k = (j * cols + i) * 4, a = data[k + 3] / 255; if (a < 0.05) continue
			const Lm = (0.2126 * data[k] + 0.7152 * data[k + 1] + 0.0722 * data[k + 2]) / 255
			const tn = Math.min(1, Math.max(0, (Lm - 0.06) / 0.62)), yN = j / rows, fade = yN < 0.66 ? 1 : Math.max(0, 1 - (yN - 0.66) / 0.3)
			const rad = (pitch / 2) * 1.14 * Math.pow(1 - tn, 0.7) * a * fade; if (rad < 0.3) continue
			const x = (i + (j % 2 ? 0.5 : 0)) * pitch, y = j * rowH
			dots.push([x * dpr, y * dpr, rad * dpr, yN * 0.85 + (x / W) * 0.15 + Math.random() * 0.06])
		}
		HT.dots = dots; HT.ready = true
		drawHalftone(HT.p)
	}
	const backOut = (t: number) => { const s = 1.7; t -= 1; return t * t * ((s + 1) * t + s) + 1 }
	function drawHalftone(p: number) {
		HT.p = p; if (!HT.ready) return
		const c = ht.getContext('2d')!; c.clearRect(0, 0, ht.width, ht.height)
		c.fillStyle = '#14160e'; c.beginPath()
		for (const [x, y, r, t] of HT.dots) {
			let s = 1
			if (p < 1) { const lp = (p * 1.35 - t) / 0.35; if (lp <= 0) continue; s = lp >= 1 ? 1 : backOut(lp) }
			const rr = r * s; c.moveTo(x + rr, y); c.arc(x, y, rr, 0, 6.2832)
		}
		c.fill()
	}
	const idle = (fn: () => void) => ((window as Any).requestIdleCallback ? (window as Any).requestIdleCallback(fn) : later(fn, 60))
	if (ptImg.complete) idle(buildHalftone); else on(ptImg, 'load', () => idle(buildHalftone))
	on(window, 'resize', () => { clearLater(htT); htT = later(buildHalftone, 160) })

	/* ================= Reduced motion: the same information, nothing moves =================
	 * The dock names the section under the reading line and fills its ring; the services stage shows the item being read;
	 * the numbers story steps through its four facts. Class and text changes only, from one rAF-throttled scroll handler. */
	if (!MOTION) {
		const dockN = $('#dockN'), dockT = $('#dockT'), dockRing = $('#dockRing'), tocLinks = $$('.toc a')
		const demos = $$('#stage .demo'), items = $$('.svc__item'), nx = $('#nx'), nxVis = $$('.nx__v'), nxLis = $$('#nxList li')
		let where = -1, active = 0, step = 0, raf = 0
		const track = () => {
			raf = 0
			if (ac.signal.aborted) return
			const mid = innerHeight * 0.55
			let i = 0
			for (let k = SECS.length - 1; k >= 1; k--) if ($(SECS[k][0]).getBoundingClientRect().top <= mid) { i = k; break }
			if (i !== where) {
				where = i
				const n = String(i + 1).padStart(2, '0')
				dockN.innerHTML = `<span>${n}</span>`; dockT.innerHTML = `<span>${SECS[i][1]}<small>p.${n}</small></span>`
				tocLinks.forEach((a, j) => a.classList.toggle('is-here', j === i))
			}
			const max = root.scrollHeight - innerHeight
			dockRing.style.strokeDashoffset = String(88 * (1 - (max > 0 ? Math.min(1, scrollY / max) : 0)))
			if (innerWidth > 900) {
				let k = 0
				items.forEach((it, j) => { if (it.getBoundingClientRect().top <= mid) k = j })
				if (k !== active) { active = k; items.forEach((it, j) => it.classList.toggle('is-on', j === k)); demos.forEach((d, j) => d.classList.toggle('is-on', j === k)) }
			}
			const r = nx.getBoundingClientRect(), a0 = innerHeight * 0.7 - r.top, span = r.height - innerHeight * 0.4
			const k = Math.max(0, Math.min(3, Math.floor((a0 / (span > 0 ? span : 1)) * 4)))
			if (k !== step) {
				step = k
				$('#nxRoll').style.transform = `translateY(${-25 * k}%)`; $('#nxStep').textContent = `0${k + 1} / 04`
				nxLis.forEach((li, j) => li.classList.toggle('is-on', j === k)); nxVis.forEach((v, j) => v.classList.toggle('is-on', j === k))
			}
		}
		const onScroll = () => { if (!raf) raf = requestAnimationFrame(track) }
		on(window, 'scroll', onScroll, { passive: true }); on(window, 'resize', onScroll)
		track()
		/* toolbox: pointing at or focusing a word shows its card beside it (touch taps are handled above) */
		const tbRows = $('#tbRows')
		const tbShow = (w: El) => { cardFor(w.dataset.tool!); const r = w.getBoundingClientRect(); tbCard.style.transform = `translate(${Math.max(12, Math.min(r.left, innerWidth - 312))}px, ${Math.max(12, r.top - tbCard.offsetHeight - 14)}px)`; tbCard.style.opacity = '1' }
		const tbHide = () => { tbCard.style.opacity = '0' }
		if (FINE) { on(tbRows, 'pointerover', (e: Event) => { const w = (e.target as El).closest<El>('.tb__w'); if (w) tbShow(w) }); on(tbRows, 'pointerleave', tbHide) }
		on(tbRows, 'focusin', (e: Event) => { const w = (e.target as El).closest<El>('.tb__w'); if (w) tbShow(w) })
		on(tbRows, 'focusout', (e: FocusEvent) => { if (!(e.relatedTarget as El | null)?.closest?.('.tb__w')) tbHide() })
		return cleanup
	}

	/* ================= Motion ================= */
	CustomEase.create('snap', '0.65,0.05,0,1')
	gsap.defaults({ ease: 'snap', duration: 0.8 })
	lenis = new Lenis({ autoRaf: false, lerp: 0.1, smoothWheel: FINE, prevent: (node: El) => node.id === 'caseScroll' || node.id === 'sheet' })
	;(window as Any).__lenis = lenis
	lenis.on('scroll', ScrollTrigger.update)
	const tick = (t: number) => lenis?.raf(t * 1000); gsap.ticker.add(tick); tickers.push(tick); gsap.ticker.lagSmoothing(0)
	document.fonts?.ready.then(() => { if (!ac.signal.aborted) refresh() })
	on(window, 'load', () => refresh())
	$$<HTMLAnchorElement>('a[href^="#"]').forEach((a) => on(a, 'click', (e: Event) => { const h = a.getAttribute('href')!, t = h.length > 1 ? $(h) : null; if (!t) return; e.preventDefault(); const f = scrollTargets[h]; lenis?.scrollTo(f ? f() : t, { duration: 1.4 }) }))

	ctx.add(() => {
		$$('[data-split]').forEach((el) => split(el, { type: 'chars', charsClass: 'char' }))

		if (FINE) {
			const cur = $('.cursor'), label = $('.cursor span')
			const xTo = gsap.quickTo(cur, 'x', { duration: 0.35, ease: 'power3' }), yTo = gsap.quickTo(cur, 'y', { duration: 0.35, ease: 'power3' })
			on(window, 'pointermove', (e: PointerEvent) => { xTo(e.clientX); yTo(e.clientY) })
			on(document, 'pointerover', (e: Event) => { const t = (e.target as El).closest<El>('[data-cursor]'); cur.classList.toggle('is-big', !!t); label.textContent = t ? t.dataset.cursor! : '' })
			$$('.btn, .hdr__cta').forEach((b) => { const bx = gsap.quickTo(b, 'x', { duration: 0.5, ease: 'power2.out' }), by = gsap.quickTo(b, 'y', { duration: 0.5, ease: 'power2.out' }); on(b, 'pointermove', (e: PointerEvent) => { const r = b.getBoundingClientRect(); bx((e.clientX - r.left - r.width / 2) * 0.25); by((e.clientY - r.top - r.height / 2) * 0.25) }); on(b, 'pointerleave', () => { bx(0); by(0) }) })
		}

		const aboutWords = split('#aboutText', { type: 'words', wordsClass: 'w' })

		/* ---- Dock: section name + page number roll like a split-flap; the ring shows how far through the issue you are ---- */
		const dockN = $('#dockN'), dockT = $('#dockT'), dockRing = $('#dockRing'), tocLinks = $$('.toc a')
		let where = 0
		const setWhere = add((i: number) => {
			if (i === where) return
			const dir = i > where ? 1 : -1; where = i
			const n = String(i + 1).padStart(2, '0')
			;([[dockN, n], [dockT, `${SECS[i][1]}<small>p.${n}</small>`]] as [El, string][]).forEach(([box, html], k) => {
				while (box.children.length > 1) { gsap.killTweensOf(box.firstElementChild); box.firstElementChild!.remove() }
				const old = box.lastElementChild as El, nu = document.createElement('span'); nu.innerHTML = html; box.appendChild(nu)
				gsap.fromTo(nu, { yPercent: 100 * dir }, { yPercent: 0, duration: 0.6, delay: k * 0.04, ease: 'expo.out' })
				gsap.to(old, { yPercent: -100 * dir, duration: 0.6, delay: k * 0.04, ease: 'expo.out', onComplete: () => { if (old.isConnected && old !== box.lastElementChild) old.remove() } })
			})
			tocLinks.forEach((a, j) => a.classList.toggle('is-here', j === i))
		})
		tocLinks[0].classList.add('is-here')
		/* after any refresh (filtering, resizing, fonts) name the section from the scroll position itself; trigger callbacks
		 * only fire on changes, so a layout change could otherwise leave the dock on the wrong page */
		let coverST: ScrollTrigger | null = null
		const syncWhere = () => {
			const mid = innerHeight * 0.55
			for (let i = SECS.length - 1; i >= 1; i--) {
				if (i === 1 && root.classList.contains('cover3d')) continue
				const r = $(SECS[i][0]).getBoundingClientRect()
				if (r.top <= mid && r.bottom >= mid) { setWhere(i); return }
			}
			setWhere(coverST && coverST.isActive && coverST.progress >= 0.6 ? 1 : 0)
		}
		ScrollTrigger.addEventListener('refresh', syncWhere)
		refreshListeners.push(syncWhere)
		/* and once any scroll settles (a jump, a scrollbar drag): trigger callbacks only fire on crossings */
		ScrollTrigger.addEventListener('scrollEnd', syncWhere)
		scrollEndListeners.push(syncWhere)
		ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => { dockRing.style.strokeDashoffset = String(88 * (1 - s.progress)) } })

		/* ---- Cover intro: the issue goes to print. Plates register, dots print, coverlines set, sticker stamps ---- */
		const front = $('#front'), mast = $('#mast')
		const introSel = { top: '.cv__top > *', lines: '.cvw', head: '.cv__intro > *', marks: '.marks svg' }
		gsap.set(mast, { '--cx': '-.09em', '--cy': '.05em', '--mx': '.08em', '--my': '-.04em' })
		gsap.set('.mast__w', { color: 'rgba(20,22,14,0)' })
		gsap.set([introSel.top, introSel.lines, introSel.head], { opacity: 0, y: 24 })
		gsap.set(introSel.marks, { opacity: 0, scale: 0.4 })
		gsap.set('#sticker', { opacity: 0, scale: 2.6, rotation: -60 })
		gsap.set('#bars rect', { scaleY: 0 })
		gsap.set('#barcode span', { opacity: 0 })
		gsap.set(dock, { yPercent: 160 })
		gsap.set('.mast__w', { '--halo': 'rgba(168,255,83,0)' })
		drawHalftone(1)
		const intro = gsap.timeline({ delay: 0.15 })
			.fromTo('.mast__w', { clipPath: 'inset(100% -30% -30% -30%)' }, { clipPath: 'inset(-30% -30% -30% -30%)', duration: 0.9, stagger: 0.12, ease: 'expo.out' }, 0)
			.to(mast, { '--cx': '0em', '--cy': '0em', '--mx': '0em', '--my': '0em', duration: 1.1, ease: 'expo.inOut' }, 0.25)
			.to('.mast__w', { color: 'rgba(20,22,14,1)', duration: 0.45, ease: 'power2.in' }, 0.8)
			.to('.mast__w', { '--halo': 'rgba(168,255,83,1)', duration: 0.3 }, 1)
			.set('.mast__w', { clipPath: 'none' }, 1.3)
			.to(introSel.marks, { opacity: 0.55, scale: 1, duration: 0.7, stagger: 0.05, ease: 'back.out(2)' }, 0)
			.fromTo('.pt__ht', { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'power2.inOut' }, 0.3)
			.fromTo('.pt__img', { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'expo.inOut' }, 0.95)
			.fromTo('.pt__ht', { '--sx': '0%', '--sy': '0%' }, { '--sx': '1.6%', '--sy': '1.4%', duration: 1, ease: 'expo.out' }, 1.5)
			.to(introSel.top, { opacity: 1, y: 0, duration: 0.8, stagger: 0.06, ease: 'expo.out' }, 0.55)
			.to(introSel.lines, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'expo.out' }, 1.0)
			.to(introSel.head, { opacity: 1, y: 0, duration: 0.8, stagger: 0.07, ease: 'expo.out' }, 1.05)
			.to('#sticker', { opacity: 1, scale: 1, rotation: -12, duration: 0.7, ease: 'back.out(1.8)' }, 1.45)
			.to('#bars rect', { scaleY: 1, duration: 0.5, stagger: { amount: 0.45, from: 'random' }, ease: 'expo.out' }, 1.4)
			.to('#barcode span', { opacity: 1, duration: 0.4 }, 1.7)
			.to(dock, { yPercent: 0, duration: 1, ease: 'expo.out' }, 1.6)
		const skip = () => { if (intro.progress() < 1) intro.progress(1) }
		on(window, 'wheel', skip, { once: true, passive: true }); on(window, 'touchstart', skip, { once: true, passive: true }); on(window, 'keydown', skip, { once: true })
		on(front, 'click', skip, { once: true })
		on($('#replayBtn'), 'click', () => { lenis?.scrollTo(0, { immediate: true }); intro.restart() })

		/* ---- Living cover: plates drift out of register with scroll speed and pointer; the sticker spins faster when you scroll ---- */
		const ring = gsap.to('#sticker svg', { rotation: 360, duration: 16, ease: 'none', repeat: -1 })
		const plate = { v: 0, mx: 0, my: 0 }
		const applyPlates = () => { if (intro.isActive()) return; const v = plate.v; gsap.set(mast, { '--cx': `${(-v * 0.0016 - plate.mx * 0.03).toFixed(4)}em`, '--cy': `${(v * 0.0008 - plate.my * 0.02).toFixed(4)}em`, '--mx': `${(v * 0.0014 + plate.mx * 0.03).toFixed(4)}em`, '--my': `${(-v * 0.0007 + plate.my * 0.02).toFixed(4)}em` }) }
		const vTo = gsap.quickTo(plate, 'v', { duration: 0.5, ease: 'power3', onUpdate: applyPlates })
		let vT = 0
		lenis!.on('scroll', ({ velocity }: Any) => { const v = gsap.utils.clamp(-40, 40, velocity); vTo(v); gsap.to(ring, { timeScale: 1 + Math.abs(v) / 3, duration: 0.3, overwrite: true }); clearLater(vT); vT = later(() => { vTo(0); gsap.to(ring, { timeScale: 1, duration: 1 }) }, 120) })
		if (FINE) {
			const mxTo = gsap.quickTo(plate, 'mx', { duration: 0.8, ease: 'power3', onUpdate: applyPlates }), myTo = gsap.quickTo(plate, 'my', { duration: 0.8, ease: 'power3', onUpdate: applyPlates })
			const pX = gsap.quickTo('#pt', 'x', { duration: 1, ease: 'power3' }), wX = gsap.quickTo('.mast__w', 'x', { duration: 1, ease: 'power3' })
			const sx = gsap.quickTo('.pt__ht', '--sx', { duration: 0.8, ease: 'power3', unit: '%' } as Any), sy = gsap.quickTo('.pt__ht', '--sy', { duration: 0.8, ease: 'power3', unit: '%' } as Any)
			on(front, 'pointermove', (e: PointerEvent) => { const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5; mxTo(nx); myTo(ny); pX(nx * 18); wX(nx * -10); sx(1.6 - nx * 3); sy(1.4 - ny * 3) })
			on(front, 'pointerleave', () => { mxTo(0); myTo(0); pX(0); wX(0) })
		}
		/* Barcode hover: a scan line sweeps the bars */
		on($('#barcode'), 'pointerenter', add(() => { gsap.fromTo('#bars rect', { opacity: 0.25 }, { opacity: 1, duration: 0.25, stagger: 0.008, ease: 'none' }) }))

		/* ---- Desktop: the cover closes into a printed issue, opens like a magazine, and you step into page 1 ---- */
		mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
			root.classList.add('cover3d')
			refresh()
			const S = 0.46, faces = ['.face--front', '.face--back', '.page1']
			const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '.cover', start: 'top top', end: 'bottom bottom', scrub: 0.6, onUpdate: (s) => { if (!s.isActive) return; setWhere(s.progress < 0.6 ? 0 : 1) } } })
			tl.to('#mag', { scale: S, duration: 2.4, ease: 'power2.inOut' }, 0)
				.to(faces, { borderRadius: 26, duration: 2.4 }, 0)
				.to('.mag__shadow', { opacity: 1, duration: 2.4 }, 0)
				.to('#openHint', { opacity: 1, duration: 0.8 }, 1.6)
				.to('#flap', { rotationY: -180, duration: 2.8, ease: 'power2.inOut' }, 2.4)
				.to('#mag', { x: () => (innerWidth * S) / 2, duration: 2.8, ease: 'power2.inOut' }, 2.4)
				.to('#openHint', { opacity: 0, duration: 0.6 }, 2.4)
				.to('.face--front .shade', { opacity: 1, duration: 1.4, ease: 'power1.in' }, 2.4)
				.fromTo('.face--back .shade', { opacity: 1 }, { opacity: 0, duration: 1.4, ease: 'power1.out' }, 3.8)
				.fromTo('.page1 .shade', { opacity: 0 }, { opacity: 1, duration: 1.4 }, 2.4)
				.to('.page1 .shade', { opacity: 0, duration: 1.4 }, 3.8)
				.fromTo('.tp__list li', { opacity: 0, x: -30 }, { opacity: 1, x: 0, stagger: 0.12, duration: 0.6 }, 4.2)
				.to('#mag', { scale: 1, x: 0, duration: 2.4, ease: 'power2.inOut' }, 6.2)
				.to(faces, { borderRadius: 0, duration: 2.4, ease: 'power2.inOut' }, 6.2)
				.to('.mag__shadow', { opacity: 0, duration: 2.4 }, 6.2)
				.fromTo('#aboutText .w', { opacity: 0.22 }, { opacity: 1, stagger: 0.05, duration: 0.3 }, 8.2)
				.fromTo('#about .bx__l, #about .bx__r', { '--s': 0, opacity: 0 }, { '--s': 1, opacity: 1, duration: 0.4, stagger: 0.2, ease: 'back.out(3)' }, 9.4)
				.set({}, {}, 10.4)
			scrollTargets['#about'] = () => { const st = tl.scrollTrigger!; return st.start + (st.end - st.start) * 0.97 }
			coverST = tl.scrollTrigger!
			/* keyboard: focusing the front cover shows it flat, the contents page opens the spread, page 1 zooms in */
			const coverEl = $('.cover')
			const onFocus = (e: FocusEvent) => {
				const t = e.target as El, at = t.closest('.face--front') ? 0 : t.closest('.face--back') ? 5.8 / 10.4 : t.closest('.page1') ? 0.97 : -1
				if (at < 0) return
				;(e as Any).placed = true
				requestAnimationFrame(() => {
					unscroll(t, coverEl)
					const st = tl.scrollTrigger!, y = st.start + (st.end - st.start) * at
					if (Math.abs(scrollY - y) > 2) { if (lenis) lenis.scrollTo(y, { immediate: true, force: true }); else scrollTo(0, y) }
				})
			}
			coverEl.addEventListener('focusin', onFocus)
			return () => { coverEl.removeEventListener('focusin', onFocus); coverST = null; root.classList.remove('cover3d'); delete scrollTargets['#about']; gsap.set(['#mag', '#flap', ...faces], { clearProps: 'all' }) }
		})
		/* Section tracking for the dock */
		/* measured after every pin (refreshPriority -1): a tracker measured before the pin inside its section missed the pin's
		 * spacer and left dead zones (the second half of Numbers, the All projects grid) where the dock kept an old name */
		SECS.forEach(([sel], i) => { if (i < 1) return; ScrollTrigger.create({ trigger: $(sel), start: 'top 55%', end: 'bottom 55%', refreshPriority: -1, onToggle: (s) => { if (s.isActive && !(i === 1 && root.classList.contains('cover3d'))) setWhere(i) } }) })
		ScrollTrigger.create({ trigger: '.cover', start: 'top top', end: 'top -40%', onEnterBack: () => setWhere(0) })

		/* ---- Panels slide over the one before ---- */
		$$('.panel--round').forEach((panel) => { const prev = panel.previousElementSibling as El | null; if (!prev || prev.classList.contains('cover') || prev.classList.contains('work')) return; const d = document.createElement('span'); d.className = 'dim'; d.setAttribute('aria-hidden', 'true'); prev.appendChild(d); gsap.to(d, { opacity: 0.35, ease: 'none', scrollTrigger: { trigger: panel, start: 'top bottom', end: 'top top', scrub: true } }) })

		/* ---- Section headings: masked words rise once ---- */
		$$('.h2').forEach((h) => { const s = split(h, { type: 'words', mask: 'words' }); gsap.from(s.words, { yPercent: 105, duration: 1, stagger: 0.06, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 85%' } }) })
		$$('.sec-head .lead').forEach((el) => gsap.from(el, { y: 36, opacity: 0, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' } }))

		/* ---- About (phone): words fill as they reach reading height; braces snap around the key phrases ---- */
		mm.add('(max-width: 900px)', () => {
			gsap.to(aboutWords.words, { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: '#aboutText', start: 'top 85%', end: 'top 30%', scrub: true } })
			$$('[data-bx]').forEach((b) => gsap.fromTo(b.querySelectorAll('.bx__l, .bx__r'), { '--s': 0, opacity: 0 }, { '--s': 1, opacity: 1, duration: 0.6, ease: 'back.out(3)', scrollTrigger: { trigger: b, start: 'top 55%' } }))
		})

		/* ---- Services: the sticky stage switches to the item under the reading line ---- */
		const demos = $$('#stage .demo'), items = $$('.svc__item')
		let active = 0
		const playDemo = add((d: El) => {
			const kind = services[+(d.dataset.i || 0)].demo
			if (kind === 'tree') { gsap.fromTo(d.querySelectorAll('rect, text'), { opacity: 0, scale: 0.8, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, stagger: 0.05, duration: 0.5, ease: 'back.out(2)' }); gsap.fromTo(d.querySelector('path'), { strokeDasharray: 900, strokeDashoffset: 900 }, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut' }) }
			if (kind === 'split') gsap.fromTo(d.querySelector('.built'), { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: 'expo.out' })
			if (kind === 'chat') gsap.fromTo(d.querySelectorAll('.b'), { y: 16, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.35, duration: 0.5, ease: 'back.out(2)' })
			if (kind === 'curve') {
				const dot = d.querySelector('circle')!, path = d.querySelector<SVGPathElement>('path:not(.grid)')!, len = path.getTotalLength(), o = { t: 0 }
				gsap.fromTo(o, { t: 0 }, { t: 1, duration: 1.4, ease: 'power3.inOut', repeat: -1, repeatDelay: 0.6, onUpdate: () => { const p = path.getPointAtLength(o.t * len); dot.setAttribute('cx', String(p.x)); dot.setAttribute('cy', String(p.y)) } })
			}
			if (kind === 'matrix') gsap.fromTo(d.querySelectorAll('.y'), { scale: 0 }, { scale: 1, stagger: 0.08, duration: 0.4, ease: 'back.out(3)' })
			if (kind === 'pipe') gsap.fromTo(d.querySelectorAll('.step'), { x: 30, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.18, duration: 0.5, ease: 'expo.out' })
		})
		const activate = add((i: number) => {
			if (i === active) return
			const prev = active; active = i
			items.forEach((it, j) => it.classList.toggle('is-on', j === i))
			gsap.to(demos[prev], { opacity: 0, y: -24, duration: 0.35, ease: 'power2.in', onComplete: () => demos[prev].classList.remove('is-on') })
			demos[i].classList.add('is-on')
			gsap.fromTo(demos[i], { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.15, ease: 'expo.out' })
			playDemo(demos[i])
		})
		mm.add('(min-width: 901px)', () => {
			/* the last item takes over a little earlier, so it is shown before the section scrolls away */
			items.forEach((it, i) => ScrollTrigger.create({ trigger: it, start: i === items.length - 1 ? 'top 70%' : 'top 55%', end: 'bottom 55%', onToggle: (s) => { if (s.isActive) activate(i) } }))
			playDemo(demos[0])
		})

		/* ---- Experience: the career graph draws, milestones drop in; chapters rise and light up their bar ---- */
		gsap.from('.tline__bar', { scaleX: 0, duration: 1.3, stagger: 0.15, ease: 'expo.inOut', scrollTrigger: { trigger: '#tline', start: 'top 80%' } })
		gsap.from('.tline__mark', { y: -18, opacity: 0, duration: 0.7, stagger: 0.12, delay: 0.6, ease: 'back.out(2)', scrollTrigger: { trigger: '#tline', start: 'top 80%' } })
		gsap.from('.tline__axis span', { opacity: 0, y: 8, duration: 0.6, stagger: 0.05, scrollTrigger: { trigger: '#tline', start: 'top 80%' } })
		$$('.chap').forEach((ch, i) => {
			gsap.from(ch.querySelectorAll('.chap__co .char'), { yPercent: 105, duration: 1, stagger: 0.035, ease: 'expo.out', scrollTrigger: { trigger: ch, start: 'top 75%' } })
			gsap.from(ch.querySelectorAll('.chap__no, .chap__head, .chap__role, .chap__facts'), { y: 24, opacity: 0, duration: 0.8, stagger: 0.06, ease: 'expo.out', scrollTrigger: { trigger: ch, start: 'top 75%' } })
			gsap.from(ch.querySelectorAll('.chap__list li, .pcard'), { y: 30, opacity: 0, duration: 0.8, stagger: 0.07, ease: 'expo.out', scrollTrigger: { trigger: ch.querySelector('.chap__body'), start: 'top 80%' } })
			ScrollTrigger.create({ trigger: ch, start: 'top 50%', end: 'bottom 50%', onToggle: (s) => $$(`.tline__row[data-ch="${i}"]`).forEach((r) => r.classList.toggle('is-on', s.isActive)) })
		})

		/* ---- Work: vertical scroll drives the feature gallery sideways; devices and cards drift at their own depth ---- */
		mm.add('(min-width: 901px)', () => {
			/* travel until the last panel ends one gutter from the right edge, like the first starts (a flex row's end padding is
			 * not part of its scrollWidth, which left the last panel flush against the screen edge) */
			const track = $('#hgTrack'), panels = $$('.hp'), dist = () => { const last = panels[panels.length - 1]; return Math.max(0, last.offsetLeft + last.offsetWidth + parseFloat(getComputedStyle(track).paddingLeft) - innerWidth) }
			const tw = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '#hg', start: 'top top', end: () => '+=' + dist(), pin: '.hg__pin', scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1, onUpdate: (st) => { $('#hgBar').style.transform = `scaleX(${Math.max(0.02, st.progress)})`; setHg(Math.min(2, Math.round(st.progress * 2))) } } })
			panels.forEach((p) => {
				gsap.fromTo(p.querySelector('.hp__dev'), { xPercent: 10, rotationY: -18 }, { xPercent: -6, rotationY: -4, ease: 'none', scrollTrigger: { trigger: p, containerAnimation: tw, start: 'left right', end: 'right left', scrub: true } })
				/* cards drift symmetrically around their anchor, so a panel at rest (about halfway through its trigger) shows them
				 * where they are placed; the old +2×/−1× range left right-anchored cards past the panel's edge */
				p.querySelectorAll<El>('.flt').forEach((f) => gsap.fromTo(f, { x: +(f.dataset.depth || 0) * 1.5 }, { x: -(f.dataset.depth || 0) * 1.5, ease: 'none', scrollTrigger: { trigger: p, containerAnimation: tw, start: 'left right', end: 'right left', scrub: true } }))
			})
			/* one reveal per panel: the first as the gallery arrives, the others as they slide in (two from-tweens on one element would leave it hidden) */
			panels.slice(1).forEach((p) => gsap.from(p.querySelectorAll('.hp__info > *'), { y: 40, opacity: 0, stagger: 0.06, duration: 0.8, ease: 'expo.out', scrollTrigger: { trigger: p, containerAnimation: tw, start: 'left 70%' } }))
			gsap.from(panels[0].querySelectorAll('.hp__info > *'), { y: 40, opacity: 0, stagger: 0.06, duration: 0.8, ease: 'expo.out', scrollTrigger: { trigger: '#hg', start: 'top 60%' } })
			/* keyboard: the track only moves with the page, so focusing a panel scrolls the page to where that panel is shown */
			const pin = $('.hg__pin')
			const onFocus = (e: FocusEvent) => {
				const i = panels.findIndex((p) => p.contains(e.target as Node)), st = tw.scrollTrigger
				if (i < 0 || !st) return
				;(e as Any).placed = true
				requestAnimationFrame(() => {
					unscroll(e.target as El, pin)
					const y = st.start + ((st.end - st.start) * i) / (panels.length - 1)
					if (lenis) lenis.scrollTo(y, { immediate: true, force: true }); else scrollTo(0, y)
				})
			}
			track.addEventListener('focusin', onFocus)
			return () => track.removeEventListener('focusin', onFocus)
		})
		/* ---- Work grid: cards rise in ---- */
		ScrollTrigger.batch('.gcard', { start: 'top 88%', once: true, onEnter: (b) => record(() => { const vis = b.filter((c) => c.getClientRects().length > 0); if (vis.length) gsap.from(vis, { y: 50, opacity: 0, stagger: 0.08, duration: 0.9, ease: 'expo.out', clearProps: 'transform,opacity' }) }) })

		/* ---- Work index: a preview window follows the cursor with the project's screen ---- */
		if (FINE) {
			const pv = $('#pv'), list = $('#plist')
			const px = gsap.quickTo(pv, 'x', { duration: 0.6, ease: 'power3' }), py = gsap.quickTo(pv, 'y', { duration: 0.6, ease: 'power3' })
			let cur = ''
			on(list, 'pointermove', (e: PointerEvent) => { px(e.clientX + 30); py(e.clientY - pv.offsetHeight / 2) })
			on(list, 'pointerover', add((e: Event) => { const row = (e.target as El).closest<El>('.prow'); if (!row || row.dataset.pv === cur) return; cur = row.dataset.pv!; const p = byId[cur]; pv.innerHTML = `<div class="pv__in" style="--pbg:${p.bg}">${browserDev(cur)}</div><span class="pv__go">View</span>`; fitAll(pv); gsap.fromTo(pv, { clipPath: 'inset(40% 40% 40% 40% round 18px)' }, { clipPath: 'inset(0% 0% 0% 0% round 18px)', duration: 0.55, ease: 'expo.out', overwrite: true }) }))
			on(list, 'pointerleave', add(() => { cur = ''; gsap.to(pv, { clipPath: 'inset(50% 50% 50% 50% round 18px)', duration: 0.35, ease: 'power2.in', overwrite: true }) }))
		}

		ScrollTrigger.sort(); refresh()

		/* ---- By the numbers: pinned; the big number rolls 5+ → 7 → 3 → 1 and each fact brings its own visual ---- */
		const nxVis = $$('.nx__v'), nxLis = $$('#nxList li'), fanCards = $$('#nxFan .card')
		gsap.set(fanCards, { xPercent: -50, rotation: 0, y: 40, opacity: 0 })
		let nxCur = -1
		const nxGo = add((k: number) => {
			if (k === nxCur) return; nxCur = k
			gsap.to('#nxRoll', { yPercent: -25 * k, duration: 0.9, ease: 'expo.inOut', overwrite: true })
			nxLis.forEach((li, j) => li.classList.toggle('is-on', j === k)); $('#nxStep').textContent = `0${k + 1} / 04`
			nxVis.forEach((v, j) => { if (j === k) { v.classList.add('is-on'); gsap.fromTo(v, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }) } else v.classList.remove('is-on') })
			if (k === 0) gsap.fromTo('#nxFill', { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'expo.inOut' })
			if (k === 1) gsap.to(fanCards, { rotation: (i) => (i - 3) * 9, x: (i) => (i - 3) * 22, y: (i) => Math.abs(i - 3) * 6, opacity: 1, duration: 1, stagger: 0.05, ease: 'expo.out' })
			else gsap.to(fanCards, { rotation: 0, x: 0, y: 40, opacity: 0, duration: 0.4 })
			if (k === 2) gsap.fromTo('.nx__co', { y: 30, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, stagger: 0.1, duration: 0.7, ease: 'back.out(1.8)' })
			if (k === 3) gsap.fromTo('.nx__medal svg', { rotation: -30, scale: 0.4 }, { rotation: 0, scale: 1, duration: 1, ease: 'elastic.out(1, .6)' })
		})
		mm.add('(min-width: 901px)', () => {
			ScrollTrigger.create({ trigger: '#nx', start: 'top top', end: '+=240%', pin: '.nx__pin', scrub: true, anticipatePin: 1, onUpdate: (st) => { $('#nxBar').style.transform = `scaleX(${st.progress})`; nxGo(Math.min(3, Math.floor(st.progress * 4))) }, onEnter: () => nxGo(0) })
			return () => { nxCur = -1 }
		})
		mm.add('(max-width: 900px)', () => { ScrollTrigger.create({ trigger: '#nx', start: 'top 70%', end: 'bottom 30%', onUpdate: (st) => nxGo(Math.min(3, Math.floor(st.progress * 4))) }) })

		/* ---- Toolbox: the title sharpens out of a blur; rows run in alternating directions, faster (and leaning) with scroll speed; a row pauses under the pointer ---- */
		gsap.fromTo('.tb__title .char', { yPercent: 60, opacity: 0, filter: 'blur(14px)' }, { yPercent: 0, opacity: 1, filter: 'blur(0px)', stagger: 0.04, ease: 'power2.out', scrollTrigger: { trigger: '.tb__title', start: 'top 92%', end: 'top 45%', scrub: true } })
		$$('.tb__bg i').forEach((b, k) => gsap.to(b, { xPercent: k % 2 ? -18 : 22, yPercent: k === 1 ? 20 : -16, duration: 9 + k * 3, ease: 'sine.inOut', repeat: -1, yoyo: true }))
		const rows = $$('.tb__row').map((row, r) => {
			const tr = $('.tb__track', row), dir = +(row.dataset.dir || 1)
			const tw = gsap.fromTo(tr, { xPercent: dir > 0 ? 0 : -50 }, { xPercent: dir > 0 ? -50 : 0, duration: 46 + r * 6, ease: 'none', repeat: -1 })
			const sk = gsap.quickTo(tr, 'skewX', { duration: 0.5, ease: 'power3' })
			on(row, 'pointerenter', () => gsap.to(tw, { timeScale: 0, duration: 0.6, overwrite: true }))
			on(row, 'pointerleave', () => gsap.to(tw, { timeScale: 1, duration: 0.8, overwrite: true }))
			return { tw, sk, dir }
		})
		ScrollTrigger.create({ trigger: '.tb', start: 'top bottom', end: 'bottom top', onToggle: (st) => rows.forEach((x) => (st.isActive ? x.tw.resume() : x.tw.pause())) })
		let tbT = 0
		lenis!.on('scroll', ({ velocity }: Any) => {
			const v = gsap.utils.clamp(-30, 30, velocity)
			rows.forEach((x) => { if (x.tw.timeScale() > 0.05) gsap.to(x.tw, { timeScale: 1 + Math.abs(v) / 4, duration: 0.3, overwrite: true }); x.sk(-v * 0.35 * x.dir) })
			clearLater(tbT); tbT = later(() => rows.forEach((x) => { gsap.to(x.tw, { timeScale: 1, duration: 0.9 }); x.sk(0) }), 140)
		})
		gsap.from('.tb__row', { xPercent: (k) => (k % 2 ? 12 : -12), opacity: 0, duration: 1.2, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: '.tb__rows', start: 'top 85%' } })
		if (FINE) {
			const cx = gsap.quickTo(tbCard, 'x', { duration: 0.45, ease: 'power3' }), cy = gsap.quickTo(tbCard, 'y', { duration: 0.45, ease: 'power3' })
			on($('#tbRows'), 'pointermove', (e: PointerEvent) => { cx(Math.min(e.clientX + 24, innerWidth - 320)); cy(e.clientY - 40) })
			on($('#tbRows'), 'pointerover', add((e: Event) => { const w = (e.target as El).closest<El>('.tb__w'); if (!w) return; cardFor(w.dataset.tool!); gsap.to(tbCard, { opacity: 1, scale: 1, duration: 0.35, ease: 'expo.out', overwrite: true }) }))
			on($('#tbRows'), 'pointerleave', add(() => { gsap.to(tbCard, { opacity: 0, scale: 0.9, duration: 0.25, overwrite: true }) }))
		}
		/* keyboard: a focused word stops its row with the word centred, and shows its card above it (the focusable copy of
		 * each word is the one in the second half of the first set, so the row can always be moved to centre it) */
		const rowEls = $$('.tb__row')
		on($('#tbRows'), 'focusin', add((e: Event) => {
			const w = (e.target as El).closest<El>('.tb__w'), rowEl = w?.closest<El>('.tb__row')
			if (!w || !rowEl) return
			const x = rows[rowEls.indexOf(rowEl)], tr = $('.tb__track', rowEl), W = tr.scrollWidth / 2
			unscroll(w, rowEl); x.sk(0)
			const L = w.getBoundingClientRect().left - tr.getBoundingClientRect().left, target = innerWidth / 2 - L - w.offsetWidth / 2
			const xx = Math.min(0, Math.max(-W, target))
			x.tw.pause().progress(x.dir > 0 ? -xx / W : 1 + xx / W)
			requestAnimationFrame(() => requestAnimationFrame(() => {
				unscroll(w, rowEl)
				cardFor(w.dataset.tool!)
				const r = w.getBoundingClientRect()
				gsap.set(tbCard, { x: Math.max(12, Math.min(r.left, innerWidth - 312)), y: Math.max(12, r.top - tbCard.offsetHeight - 14) })
				gsap.to(tbCard, { opacity: 1, scale: 1, duration: 0.35, ease: 'expo.out', overwrite: true })
			}))
		}))
		on($('#tbRows'), 'focusout', add((e: FocusEvent) => {
			const rowEl = (e.target as El).closest<El>('.tb__row'), next = e.relatedTarget as El | null
			if (rowEl && !(next && rowEl.contains(next))) rows[rowEls.indexOf(rowEl)].tw.resume()
			if (!(next && next.closest('.tb__w'))) gsap.to(tbCard, { opacity: 0, scale: 0.9, duration: 0.25, overwrite: true })
		}))

		/* ---- Let's talk: the grid draws in, the disc spins up from small, words roll; the disc is magnetic and tilts toward the pointer ---- */
		const ltPaths = $$<SVGPathElement>('#ltGrid path')
		ltPaths.forEach((pa) => { const L = pa.getTotalLength(); pa.style.strokeDasharray = String(L); pa.style.strokeDashoffset = String(L) })
		/* the paths use non-scaling strokes, so the dash only matches the drawn length on a 1440×900 box: clear it once drawn */
		gsap.to(ltPaths, { strokeDashoffset: 0, duration: 1.6, stagger: 0.015, ease: 'power2.inOut', scrollTrigger: { trigger: '#lt', start: 'top 70%' }, onComplete: () => ltPaths.forEach((pa) => { pa.style.strokeDasharray = 'none' }) })
		gsap.fromTo('#ltDisc', { scale: 0.45, rotation: -50 }, { scale: 1, rotation: 0, ease: 'none', scrollTrigger: { trigger: '#lt', start: 'top bottom', end: 'top 15%', scrub: true } })
		gsap.from('.lt__big .char', { yPercent: 110, stagger: 0.05, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '#lt', start: 'top 45%' } })
		gsap.from('.lt__c', { opacity: 0, x: (k) => (k % 2 ? 40 : -40), duration: 0.9, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: '#lt', start: 'top 40%' } })
		const ringSpin = gsap.to('#ltRing', { rotation: 360, duration: 22, ease: 'none', repeat: -1 })
		lenis!.on('scroll', ({ velocity }: Any) => { gsap.to(ringSpin, { timeScale: 1 + Math.min(Math.abs(velocity) / 3, 6), duration: 0.3, overwrite: true }) })
		if (FINE) {
			const disc = $('#ltDisc'), dx = gsap.quickTo(disc, 'x', { duration: 0.7, ease: 'power3' }), dy = gsap.quickTo(disc, 'y', { duration: 0.7, ease: 'power3' }), rx = gsap.quickTo(disc, 'rotationX', { duration: 0.7, ease: 'power3' }), ry = gsap.quickTo(disc, 'rotationY', { duration: 0.7, ease: 'power3' })
			gsap.set(disc, { transformPerspective: 900 })
			on($('#lt'), 'pointermove', (e: PointerEvent) => { const r = disc.getBoundingClientRect(), nx = (e.clientX - (r.left + r.width / 2)) / innerWidth, ny = (e.clientY - (r.top + r.height / 2)) / innerHeight; dx(nx * 60); dy(ny * 40); ry(nx * 18); rx(-ny * 14) })
			on($('#lt'), 'pointerleave', () => { dx(0); dy(0); rx(0); ry(0) })
			on(disc, 'pointerenter', add(() => { gsap.to(ringSpin, { timeScale: 5, duration: 0.4 }); gsap.fromTo('.lt__big .char', { yPercent: 0 }, { yPercent: -110, duration: 0.35, stagger: 0.02, ease: 'power2.in', onComplete: () => { gsap.fromTo('.lt__big .char', { yPercent: 110 }, { yPercent: 0, duration: 0.5, stagger: 0.02, ease: 'expo.out' }) } }) }))
			on(disc, 'pointerleave', add(() => { gsap.to(ringSpin, { timeScale: 1, duration: 0.8 }) }))
		}
		gsap.fromTo('.foot__mark .char', { yPercent: 100, '--w': 62 }, { yPercent: 0, '--w': 76, stagger: 0.04, ease: 'power2.out', scrollTrigger: { trigger: '.foot', start: 'top bottom', end: 'bottom bottom', scrub: true } })
		gsap.fromTo('.foot__chip', { scale: 0, rotation: -30 }, { scale: 1, rotation: 0, ease: 'back.out(2)', scrollTrigger: { trigger: '.foot', start: 'top 90%', end: 'bottom bottom', scrub: true } })
	})

	/* every trigger exists now: order them by page position so pins that add scroll length are measured first */
	ScrollTrigger.sort(); refresh()

	/* Landing: the browser jumps to a #section (or restores a reload's position) before the 3D cover and the pins add their
	 * height, so it lands sections too early. Take over: once everything is measured, go to the hash target, or on a reload
	 * or back/forward visit to where the reader was; again after fonts and images settle, unless the reader has moved. */
	ScrollTrigger.clearScrollMemory('manual') /* ScrollTrigger restores its recorded value after every refresh; tell it instead */
	const navType = (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined)?.type
	let savedY = NaN
	try { if (navType === 'reload' || navType === 'back_forward') savedY = Number(sessionStorage.getItem('ds-y') ?? NaN) } catch {}
	on(window, 'pagehide', () => { try { sessionStorage.setItem('ds-y', String(Math.round(scrollY))) } catch {} })
	let landed = -1
	const land = () => {
		if (ac.signal.aborted || (landed >= 0 && Math.abs(scrollY - landed) > 2)) return
		const h = location.hash, t = h.length > 1 && !h.startsWith('#work/') ? document.getElementById(decodeURIComponent(h.slice(1))) : null
		const y = Number.isFinite(savedY) ? savedY : t ? (scrollTargets[h] ? scrollTargets[h]() : t.getBoundingClientRect().top + scrollY) : -1
		if (y < 0) return
		/* Lenis caps scrollTo at the page height it last measured (before the pins added theirs), so measure again first */
		lenis?.resize(); lenis?.scrollTo(y, { immediate: true, force: true }); landed = Math.round(scrollY)
	}
	land()
	document.fonts?.ready.then(land)
	on(window, 'load', () => requestAnimationFrame(land))
	return cleanup

	function cleanup() {
		ac.abort()
		cancelAnimationFrame(fillRaf); fillQ.length = 0
		timers.forEach((id) => clearTimeout(id)); timers.clear()
		intervals.forEach((id) => clearInterval(id))
		observers.forEach((o) => o.disconnect()); cxIO?.disconnect()
		caseMotionKill()
		mm.revert()
		ctx.revert()
		splits.reverse().forEach((s) => s.revert())
		refreshListeners.forEach((f) => ScrollTrigger.removeEventListener('refresh', f))
		scrollEndListeners.forEach((f) => ScrollTrigger.removeEventListener('scrollEnd', f))
		ScrollTrigger.getAll().forEach((t) => t.kill())
		tickers.forEach((t) => gsap.ticker.remove(t))
		lenis?.destroy(); lenis = null
		if ((window as Any).__lenis) delete (window as Any).__lenis
		$$('.dim').forEach((d) => d.remove())
		root.style.overflow = ''
		root.classList.remove('cover3d')
	}
}
