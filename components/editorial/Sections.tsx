/* eslint-disable @next/next/no-img-element -- small same-origin logos */
import { projects } from '@/data/projects'
import { formatMonth, monthIndex, nowYM, roles, tenure } from '@/data/experience'
import { services } from '@/data/site'
import { DEMOS } from '@/lib/editorial/demos'
import { Browser, cssVars } from './mockups'

const LOGOS = '/assets/imgs/editorial/logos'
const pad2 = (n: number) => String(n).padStart(2, '0')

/** 3. By the numbers — pinned on desktop; the big number rolls 5+ → 7 → 3 → 1 and each fact brings its own visual. */
export function Numbers() {
	return (
		<section className="nums3 panel panel--round" id="numbers">
			<div className="nx" id="nx">
				<div className="nx__pin">
					<div className="nx__head container">
						<h2 className="display">
							By the <span className="serif">numbers</span>
						</h2>
						<span className="nx__step" id="nxStep">
							01 / 04
						</span>
					</div>
					<div className="nx__grid container">
						<div className="nx__num" aria-hidden="true">
							<span className="nx__roll" id="nxRoll">
								<span>5+</span>
								<span>{projects.length}</span>
								<span>{roles.length}</span>
								<span>1</span>
							</span>
						</div>
						<div className="nx__side">
							<ol className="nx__list" id="nxList">
								<li className="is-on" data-n="01">
									<h3>5+ years in production</h3>
									<p>Shipping React, Angular and Vue frontends since April 2021.</p>
								</li>
								<li data-n="02">
									<h3>{projects.length} products shipped</h3>
									<p>Security, Web3, CRM, HR, rentals and a product website.</p>
								</li>
								<li data-n="03">
									<h3>{roles.length} companies</h3>
									<p>DataSirpi, Accubits Technologies and Xnovaa Digital.</p>
								</li>
								<li data-n="04">
									<h3>1 Accu Star Award</h3>
									<p>For delivering the AVIS NFT platform on schedule.</p>
								</li>
							</ol>
							<div className="nx__vis" aria-hidden="true">
								<div className="nx__v is-on">
									<div className="nx__tl">
										<div className="yrs">
											{[2021, 2022, 2023, 2024, 2025, 2026].map((y) => (
												<span key={y}>{y}</span>
											))}
										</div>
										<div className="track">
											<span className="fill" id="nxFill">
												Apr 2021 → today
											</span>
										</div>
										<span className="cap" id="nxCap">
											Counting from my first frontend role
										</span>
									</div>
								</div>
								<div className="nx__v">
									<div className="nx__fan" id="nxFan">
										{projects.map((p, i) => (
											<div key={p.id} className="card" style={cssVars({ '--i': i })}>
												<Browser id={p.id} />
											</div>
										))}
									</div>
								</div>
								<div className="nx__v">
									<div className="nx__cos">
										<div className="nx__co">
											<span className="lg is-dark">
												<img src={`${LOGOS}/ds.svg`} alt="" />
											</span>
											<b>DataSirpi</b>
											<small>2023 – now</small>
										</div>
										<div className="nx__co">
											<span className="lg">
												<img src={`${LOGOS}/accubits.png`} alt="" />
											</span>
											<b>Accubits</b>
											<small>2022 – 2023</small>
										</div>
										<div className="nx__co">
											<span className="lg">
												<span className="xd">XD</span>
											</span>
											<b>Xnovaa Digital</b>
											<small>2021 – 2022</small>
										</div>
									</div>
								</div>
								<div className="nx__v">
									<div className="nx__medal">
										<svg viewBox="0 0 120 150">
											<path d="M38 0h18l10 40H46z" fill="#7c3aed" />
											<path d="M82 0H64L54 40h20z" fill="#a8ff53" />
											<circle cx="60" cy="92" r="46" fill="#ffd166" />
											<circle cx="60" cy="92" r="36" fill="none" stroke="#14160e" strokeWidth="2" strokeDasharray="4 5" />
											<path id="nxStar" d="M60 66l7.6 15.4 17 2.5-12.3 12 2.9 16.9L60 104.8l-15.2 8 2.9-16.9-12.3-12 17-2.5z" fill="#14160e" />
										</svg>
										<div>
											<b>Accu Star Award</b>
											<span>Accubits Technologies · 2022 · for shipping AVIS NFT on schedule</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="nx__bar container" aria-hidden="true">
						<i id="nxBar" />
					</div>
				</div>
			</div>
		</section>
	)
}

/** 4. What I do — the sticky stage on the left plays each service's demo as its item reaches the reading line. */
export function Services() {
	return (
		<section className="svc panel panel--round" id="services">
			<div className="container">
				<div className="sec-head">
					<span className="brace">{'{ services }'}</span>
					<h2 className="display h2">
						What I <span className="serif">do</span>
					</h2>
					<p className="lead">Six things teams hire me for, each shown in a small live demo.</p>
				</div>
				<div className="svc__wrap">
					<div className="svc__stage" id="stage" aria-hidden="true">
						{services.map((s, i) => (
							<div key={s.t} className={`demo${i === 0 ? ' is-on' : ''}`} data-i={i} dangerouslySetInnerHTML={{ __html: `${DEMOS[s.demo]}<span class="demo__cap label">${s.t}</span>` }} />
						))}
					</div>
					<ol className="svc__list" id="svcList">
						{services.map((s, i) => (
							<li key={s.t} className={`svc__item${i === 0 ? ' is-on' : ''}`} data-i={i}>
								<div className="svc__inline" aria-hidden="true">
									<div className="demo" dangerouslySetInnerHTML={{ __html: DEMOS[s.demo] }} />
								</div>
								<span className="label">{pad2(i + 1)} / 06</span>
								<h3 className="display">{s.t}</h3>
								<p>{s.d}</p>
								<div className="chips">
									{s.tags.map((t) => (
										<span key={t} className="chip">
											{t}
										</span>
									))}
								</div>
							</li>
						))}
					</ol>
				</div>
			</div>
		</section>
	)
}

/** 5. Experience — career at a glance (a bar per company on a 2021 → 2026 axis) and one chapter per company. */
export function Experience() {
	const now = nowYM()
	const total = monthIndex('2026-12') + 1, pct = (ym: string) => (monthIndex(ym) / total) * 100
	const marks: [string, string, string, string][] = [
		['2022-08', 'Accu Star Award', '2022', ''],
		['2024-04', 'Leading D2Defense', 'Apr 2024', ''],
		[now, 'Now', 'open to roles', 'now'],
	]
	const short = (ym: string) => `${formatMonth(ym).slice(0, 3)}\u00a0’${ym.slice(2, 4)}`
	return (
		<section className="xp panel panel--paper panel--round" id="experience">
			<div className="container">
				<div className="sec-head">
					<span className="brace">{'{ experience }'}</span>
					<h2 className="display h2">
						Where I&apos;ve <span className="serif">worked</span>
					</h2>
					<p className="lead">Three companies since April 2021. Web3 marketplaces first, then CRM and HR tools, now zero‑trust security.</p>
				</div>
				<div className="tline" id="tline">
					<div className="tline__top">
						<h3>Career at a glance</h3>
						<span className="tot" id="tlTotal">
							<b>{tenure('2021-04', null)}</b> of frontend work
						</span>
					</div>
					<div className="tline__grid" id="tlGrid">
						<div className="tline__axis">
							{[2021, 2022, 2023, 2024, 2025, 2026].map((y) => (
								<span key={y} style={{ left: `${pct(`${y}-01`) + 100 / 12}%` }}>
									<b className="yl">{y}</b>
									<b className="ys">’{String(y).slice(2)}</b>
								</span>
							))}
						</div>
						{[...roles].reverse().map((j) => {
							/* a finished role fills its last month; the current one stops at the 'now' line (mid-month) */
							const i = roles.indexOf(j), l = pct(j.from), w = pct(j.to || now) - l + (j.to ? 100 : 50) / total
							return [
								<div key={`l${i}`} className="tline__lbl">
									<b>{j.full || j.co}</b>
									<small>
										{j.title} · {tenure(j.from, j.to).replace(/ /g, ' ')}
										<span className="tline__dates">
											{short(j.from)} – {j.to ? short(j.to) : 'now'}
										</span>
									</small>
								</div>,
								<div key={`r${i}`} className="tline__row tline__track" data-ch={i}>
									<a className="tline__bar" href={`#ch-${i}`} style={cssVars({ '--cc': j.cc, left: `${l}%`, width: `${w}%` })}>
										{short(j.from)} – {j.to ? short(j.to) : 'now'}
									</a>
								</div>,
							]
						})}
						<div className="tline__marks">
							{marks.map(([ym, t, s, c]) => (
								<span key={t} className={`tline__mark ${c}`} style={{ left: `${pct(ym) + 50 / total}%` }}>
									<i />
									{t}
									<small>{s}</small>
								</span>
							))}
						</div>
						<span className="tline__now" style={{ left: `calc(240px + (100% - 240px) * ${(pct(now) + 50 / total) / 100})` }} />
					</div>
					<div className="tline__legend" aria-hidden="true">
						<span>
							<i />
							Accu Star Award · 2022
						</span>
						<span>
							<i />
							Leading D2Defense · Apr 2024
						</span>
						<span>
							<i className="now" />
							Now · open to roles
						</span>
					</div>
				</div>
				<div id="chapters">
					{roles.map((j, i) => {
						const projs = projects.filter((p) => p.company === (j.full || j.co))
						return (
							<article key={j.co} className="chap" id={`ch-${i}`} style={cssVars({ '--cc': j.cc })}>
								<div className="chap__side">
									<span className="chap__no">
										Chapter 0{i + 1} · {j.from.slice(0, 4)} – {j.to ? j.to.slice(0, 4) : 'now'}
									</span>
									<div className="chap__head">
										<span className={`chap__logo${j.logo.dark ? ' is-dark' : ''}`}>{j.logo.src ? <img src={j.logo.src} alt="" /> : <span className="xd">{j.logo.monogram}</span>}</span>
									</div>
									<h3 className="chap__co display" data-split>
										{j.co}
									</h3>
									<p className="chap__role">{j.title}</p>
									<dl className="chap__facts">
										<dt>When</dt>
										<dd>
											{formatMonth(j.from)} – {formatMonth(j.to)}
										</dd>
										<dt>Tenure</dt>
										<dd>{tenure(j.from, j.to)}</dd>
										<dt>Company</dt>
										<dd>
											{j.full || j.co} · {j.note}
										</dd>
									</dl>
								</div>
								<div className="chap__body">
									<div>
										<h4>What I did</h4>
										<ul className="chap__list">
											{j.bullets.map((b) => (
												<li key={b}>{b}</li>
											))}
										</ul>
									</div>
									{projs.length > 0 && (
										<div>
											<h4>
												Shipped here · {projs.length} project{projs.length > 1 ? 's' : ''}
											</h4>
											<div className="chap__projects">
												{projs.map((p) => (
													<button key={p.id} className="pcard" type="button" data-open={p.id} style={cssVars({ '--pbg': p.bg })}>
														<span className="pcard__vis">
															<Browser id={p.id} />
														</span>
														<span>
															<b>{p.title}</b>
															<small>
																{p.what} · {p.year}
															</small>
														</span>
														<span className="go">Open case study ↗</span>
													</button>
												))}
											</div>
										</div>
									)}
									<div>
										<h4>Stack</h4>
										<div className="chips">
											{j.tags.map((t) => (
												<span key={t} className="chip">
													{t}
												</span>
											))}
										</div>
									</div>
								</div>
							</article>
						)
					})}
				</div>
			</div>
		</section>
	)
}
