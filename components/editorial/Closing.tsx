/* eslint-disable @next/next/no-img-element -- small same-origin logos and the footer chip */
import { CONTACT, skills } from '@/data/site'

const LOGOS = '/assets/imgs/editorial/logos'
const CATS = ['Languages', 'Frameworks', 'Styling & UI', 'Real-time & data', 'Tools']

/** 7. Toolbox — five rows of tool names running in alternating directions; point at one to see where it was used. */
export function Toolbox() {
	const total = skills.reduce((n, [, , list]) => n + list.length, 0)
	return (
		<section className="skills tb panel panel--round" id="skills">
			<div className="tb__bg" aria-hidden="true">
				<i />
				<i />
				<i />
			</div>
			<div className="container">
				<div className="tb__head">
					<span className="brace">{'{ toolbox }'}</span>
					<h2 className="tb__title display" aria-label="Toolbox">
						<span data-split>Tool</span>
						<span className="serif" data-split>
							box
						</span>
					</h2>
					<p className="lead">The {total} languages, frameworks and tools I build with, in five rows. Point at or tap any of them to see where I used it.</p>
				</div>
			</div>
			<div className="tb__rows" id="tbRows">
				{skills.map(([, , list], r) => (
					<div key={r} className="tb__row" data-dir={r % 2 ? -1 : 1}>
						<span className="tb__label">
							0{r + 1} · {CATS[r]}
						</span>
						<div className="tb__track">
							{[false, true].map((hid) => (
								<div key={String(hid)} className="tb__set" aria-hidden={hid || undefined}>
									{[...list, ...list].map(([f, n, mono], k) => [
										<button key={`w${k}`} className={`tb__w${k % 2 ? ' is-out' : ''}`} type="button" data-tool={n} tabIndex={hid || k < list.length ? -1 : undefined} aria-hidden={(!hid && k < list.length) || undefined}>
											<span className="tb__ico">{f ? <img src={`${LOGOS}/${f}.svg`} alt="" loading="lazy" /> : <b>{mono}</b>}</span>
											<span className="tb__t">{n}</span>
										</button>,
										<span key={`s${k}`} className="tb__sep" aria-hidden="true">
											✦
										</span>,
									])}
								</div>
							))}
						</div>
					</div>
				))}
			</div>
			<div className="container tb__foot">
				<span>Scroll faster and the rows run faster</span>
				<span>Facts come from the projects and roles on this site</span>
			</div>
			<div className="tb__card" id="tbCard" aria-hidden="true" />
		</section>
	)
}

const vLines = Array.from({ length: 17 }, (_, i) => i * 90)
const hLines = Array.from({ length: 13 }, (_, i) => i * 75)

/** 8. Contact — the back cover: a giant "Let's talk" disc with the four ways to reach me in the corners; footer. */
export function Contact() {
	return (
		<section className="contact panel panel--round" id="contact">
			<div className="lt" id="lt">
				<svg className="lt__grid" id="ltGrid" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true">
					{vLines.map((x) => (
						<path key={`v${x}`} d={`M${x} 0 L${x} 900`} />
					))}
					{hLines.map((y) => (
						<path key={`h${y}`} d={`M0 ${y} Q720 ${y < 450 ? y + 40 : y - 40} 1440 ${y}`} />
					))}
				</svg>
				<div className="lt__top">
					<span>Back cover · Issue Nº 05</span>
					<span>Next issue: yours</span>
					<span id="bcClock">India</span>
				</div>
				<div className="lt__stage">
					<a className="lt__disc" id="ltDisc" href={`mailto:${CONTACT.email}?subject=Let%27s%20talk`} data-cursor="Mail" aria-label="Email Durai: let's talk">
						<svg className="lt__ring" id="ltRing" viewBox="0 0 200 200" aria-hidden="true">
							<defs>
								<path id="ltPath" d="M100 100m-88 0a88 88 0 1 1 176 0a88 88 0 1 1-176 0" />
							</defs>
							<text>
								<textPath href="#ltPath" textLength="548" lengthAdjust="spacing">
									Start a project · Say hello · Open to roles · Start a project · Say hello ·
								</textPath>
							</text>
						</svg>
						<span className="lt__big" aria-hidden="true">
							<span className="w1" data-split>
								Let&apos;s
							</span>
							<span className="w2" data-split>
								talk
							</span>
						</span>
						<span className="lt__hint" aria-hidden="true">
							<span className="d">
								<span>Click to email</span>
								<span>{CONTACT.email}</span>
							</span>
							<span className="m">Tap to email</span>
						</span>
					</a>
				</div>
				<div className="lt__corners">
					<div className="lt__c tl">
						<span className="label">Email</span>
						<a href={`mailto:${CONTACT.email}`} data-cursor="Mail">
							{CONTACT.email}
						</a>
						<button className="copy" type="button" data-copy={CONTACT.email}>
							Copy email
						</button>
					</div>
					<div className="lt__c tr">
						<span className="label">Phone</span>
						<a href={`tel:${CONTACT.phone}`}>{CONTACT.phoneLabel}</a>
						<button className="copy" type="button" data-copy={CONTACT.phone}>
							Copy number
						</button>
					</div>
					<div className="lt__c bl">
						<span className="label">Elsewhere</span>
						<a href={CONTACT.linkedin} target="_blank" rel="noopener">
							LinkedIn ↗
						</a>
						<a href={CONTACT.github} target="_blank" rel="noopener">
							GitHub ↗
						</a>
					</div>
					<div className="lt__c br">
						<span className="label">Status</span>
						<span className="st">
							<span className="pulse" aria-hidden="true" />
							Available for work · 2026
						</span>
						<span>Full-time frontend roles and freelance projects</span>
					</div>
				</div>
			</div>
			<footer className="foot">
				<div className="foot__mark display" aria-hidden="true">
					<span data-split>Durai</span>
					<span className="foot__chip">
						<img src="/assets/imgs/editorial/durai.png" alt="" />
					</span>
					<span data-split>Singh</span>
				</div>
				<div className="foot__row">
					<span>© 2026 Durai Singh · Frontend Developer · India</span>
					<span>Built with Next.js, GSAP and Lenis</span>
					<button id="replayBtn" type="button">
						Replay intro
					</button>
				</div>
				<p className="note">Project screens are illustrative UI drawn in code with sample data. Real product screenshots can replace them.</p>
			</footer>
		</section>
	)
}
