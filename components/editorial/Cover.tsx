/* eslint-disable @next/next/no-img-element -- the portrait must be a plain same-origin <img> (the halftone canvas samples it) */
import { projects } from '@/data/projects'
import { CONTACT } from '@/data/site'
import { barcode } from '@/lib/editorial/demos'
import { Browser, cssVars } from './mockups'

const IMG = '/assets/imgs/editorial'

const Marks = () => (
	<div className="marks" aria-hidden="true">
		{['tl', 'tr', 'bl', 'br'].map((c) => (
			<svg key={c} className={c} viewBox="0 0 28 28">
				<path d="M0 10h8M10 0v8" />
			</svg>
		))}
		{['l', 'r'].map((c) => (
			<svg key={c} className={`reg ${c}`} viewBox="0 0 22 22">
				<circle cx="11" cy="11" r="6" />
				<path d="M11 0v22M0 11h22" />
			</svg>
		))}
	</div>
)

/** The first featured project, server-rendered so the card reads without JavaScript; the engine cycles it. */
function FeaturedCard() {
	const featured = projects.slice(0, 3), p = featured[0]
	return (
		<aside className="cvw" id="cvw" aria-label="Featured work">
			<div className="cvw__head">
				<span className="live">
					<span className="pulse" aria-hidden="true" />
					Featured work
				</span>
				<span className="cvw__dots" id="cvwDots">
					{featured.map((f, k) => (
						<button key={f.id} type="button" aria-label={`Show ${f.title}`} aria-current={k === 0} />
					))}
				</span>
			</div>
			<button className="cvw__card" id="cvwCard" type="button" data-cursor="Open" data-open={p.id} aria-label={`Open the ${p.title} case study`}>
				<span className="cvw__screen" style={cssVars({ '--pbg': p.bg })}>
					<Browser id={p.id} />
				</span>
				<span className="cvw__meta">
					<b>{p.title}</b>
					<small>
						<span>{p.what}</span>
						<span className="nw">{p.dur}</span>
					</small>
					<span className="go" aria-hidden="true">
						↗
					</span>
				</span>
			</button>
			<div className="cvw__bar" aria-hidden="true">
				<i id="cvwBar" />
			</div>
		</aside>
	)
}

function Barcode() {
	const { width, rects } = barcode(CONTACT.email)
	return (
		<button className="barcode" id="barcode" type="button" data-copy={CONTACT.email} aria-label={`Copy email address ${CONTACT.email}`}>
			<svg id="bars" viewBox={`0 0 ${width} 42`} preserveAspectRatio="none" aria-hidden="true">
				{rects.map(([x, w], i) => (
					<rect key={i} x={x} y="0" width={w} height="42" />
				))}
			</svg>
			<span>{CONTACT.email}</span>
		</button>
	)
}

const TP = [
	['#about', 'p.02', "Editor's letter", 'Who I am and how I work'],
	['#numbers', 'p.03', 'By the numbers', '5+ years, 7 products, 1 award'],
	['#services', 'p.04', 'What I do', 'Six services, each with a live demo'],
	['#experience', 'p.05', 'Experience', 'DataSirpi, Accubits, Xnovaa Digital'],
	['#work', 'p.06', 'Selected work', 'D2Defense, AVIS NFT, DS Integra and 4 more'],
	['#skills', 'p.07', 'Toolbox', '22 tools in motion'],
	['#contact', 'p.08', 'Contact', "Let's talk"],
]

/** 1. Cover — the portfolio as a magazine issue. On desktop it closes, opens like a magazine and you step inside. */
export default function Cover() {
	return (
		<section className="cover" id="top" aria-label="Cover">
			<div className="cover__stage">
				<p className="open-hint" id="openHint">
					Keep scrolling to open the issue
				</p>
				<div className="mag" id="mag">
					<span className="mag__shadow" aria-hidden="true" />
					<div className="flap" id="flap">
						<div className="face face--front" id="front">
							<Marks />
							<div className="cv__top">
								<a className="brand" href="#top">
									<span className="brand__mark" aria-hidden="true">
										DS
									</span>
									<span className="brand__txt">
										<b>Durai Singh</b>
										<small>Frontend Developer</small>
									</span>
								</a>
								<p className="cv__issue">
									<span className="lg">Portfolio ’26 · </span>Issue Nº 05 · The <em>{'{frontend}'}</em> issue
								</p>
								<div className="cv__right">
									<span className="avail">
										<span className="pulse" aria-hidden="true" />
										Available · <span id="clock">India</span>
									</span>
									<button className="cv__theme" id="themeBtn" type="button" aria-label="Switch between dark and light theme">
										◐
									</button>
								</div>
							</div>
							<div className="cv__grid">
								<div className="cv__left" id="cvLeft">
									<h1 className="mast" id="mast">
										<span className="mast__w mast__w--1" data-w="Durai">
											Durai
										</span>{' '}
										<span className="mast__w mast__w--2" data-w="Singh">
											Singh
										</span>
										<span className="sr-only">, Frontend Developer based in India</span>
									</h1>
									<div className="cv__intro" id="cvIntro">
										<p className="cv__kicker">
											<img src={`${IMG}/durai.png`} alt="" />
											{'{ frontend developer at DataSirpi · India }'}
										</p>
										<p className="cv__state">
											I build <em>clear, fast</em> interfaces for security, CRM and Web3 products.
										</p>
										<div className="cv__row">
											<div className="cv__ctas">
												<a className="btn btn--ink" href="#work" data-cursor="Go">
													See my work <span className="arrow">↗</span>
												</a>
												<a className="btn btn--line" href="#contact">
													Let&apos;s talk
												</a>
											</div>
										</div>
									</div>
									<div className="cv__foot" id="cvFoot">
										<Barcode />
									</div>
								</div>
								<div className="cv__visual">
									<figure className="pt" id="pt">
										<img className="pt__img" src={`${IMG}/durai@2x.png`} alt="Portrait of Durai Singh" width="1026" height="924" />
										<canvas className="pt__ht" id="ht" aria-hidden="true" />
									</figure>
									<FeaturedCard />
									<a className="sticker" id="sticker" href="#contact" aria-label="Available for work. Hire me">
										<svg viewBox="0 0 120 120" aria-hidden="true">
											<defs>
												<path id="stickerPath" d="M60 60m-47 0a47 47 0 1 1 94 0a47 47 0 1 1-94 0" />
											</defs>
											<g id="stickerRing">
												<text>
													<textPath href="#stickerPath" textLength="292" lengthAdjust="spacing">
														Available for work · Open to roles · 2026 ·
													</textPath>
												</text>
											</g>
										</svg>
										<b aria-hidden="true">
											Hire
											<br />
											me ↗
										</b>
									</a>
								</div>
							</div>
							<span className="shade" aria-hidden="true" />
						</div>
						<div className="face face--back" aria-label="Contents">
							<div className="tp__head">
								<span className="label">Contents</span>
								<span className="label">Issue Nº 05 · 2026</span>
							</div>
							<h2 className="display tp__title">
								Inside this <span className="serif">issue</span>
							</h2>
							<ol className="tp__list">
								{TP.map(([href, n, t, d]) => (
									<li key={href}>
										<a href={href}>
											<span className="n">{n}</span>
											<b>{t}</b>
											<span>{d}</span>
										</a>
									</li>
								))}
							</ol>
							<span className="shade" aria-hidden="true" />
						</div>
					</div>
					<article className="page1" id="about">
						<div className="container p1">
							<div className="p1__head">
								<span className="brace">{"{ about } · editor's letter"}</span>
								<span className="label">p.02</span>
							</div>
							<div className="p1__body">
								<div className="p1__main">
									<p className="about__text" id="aboutText">
										I&apos;m a frontend developer who turns complex products into{' '}
										<span className="bx" data-bx>
											<span className="bx__l" aria-hidden="true">
												{'{'}
											</span>
											clear, fast interfaces
											<span className="bx__r" aria-hidden="true">
												{'}'}
											</span>
										</span>{' '}
										that people enjoy using. For five years I&apos;ve shipped security dashboards, CRMs, HR tools and{' '}
										<span className="bx" data-bx>
											<span className="bx__l" aria-hidden="true">
												{'{'}
											</span>
											award-winning
											<span className="bx__r" aria-hidden="true">
												{'}'}
											</span>
										</span>{' '}
										NFT platforms.
									</p>
									<p className="p1__sign">
										<img src={`${IMG}/durai.png`} alt="" />
										<span className="serif">Durai</span>
										<span>Frontend Developer · India</span>
									</p>
								</div>
								<div className="about__grid">
									<div>
										<svg viewBox="0 0 36 36" aria-hidden="true">
											<path d="M20 3 8 20h9l-2 13 13-18h-9z" />
										</svg>
										<h3>Fast by default</h3>
										<p>Lean bundles, React Query for data, and pages that load quickly on real phones.</p>
									</div>
									<div>
										<svg viewBox="0 0 36 36" aria-hidden="true">
											<circle cx="18" cy="7" r="3" />
											<path d="M6 13l12 3 12-3M18 16v8l-6 9M18 24l6 9" />
										</svg>
										<h3>Usable by everyone</h3>
										<p>Semantic HTML, keyboard support and a reduced-motion mode for every animation.</p>
									</div>
									<div>
										<svg viewBox="0 0 36 36" aria-hidden="true">
											<path d="M3 30c8 0 8-24 15-24s7 24 15 24" />
										</svg>
										<h3>Motion with purpose</h3>
										<p>GSAP animation that guides attention and explains the interface instead of decorating it.</p>
									</div>
								</div>
							</div>
						</div>
						<span className="shade" aria-hidden="true" />
					</article>
				</div>
			</div>
		</section>
	)
}
