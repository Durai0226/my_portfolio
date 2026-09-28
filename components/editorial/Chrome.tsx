import { CONTACT, SECTIONS } from '@/data/site'

/** Print grain and the custom cursor (both decorative). */
export function Atmosphere() {
	return (
		<>
			<div className="grain" aria-hidden="true" />
			<div className="cursor" aria-hidden="true">
				<span />
			</div>
		</>
	)
}

/** The dock: the site header lives at the bottom (thumb reach) and shows where you are in the issue. */
export function Dock() {
	return (
		<nav className="dock" id="dock" aria-label="Site">
			<a className="dock__where" href="#top" id="dockWhere" aria-label="Current section, back to top">
				<svg className="dock__ring" viewBox="0 0 34 34" aria-hidden="true">
					<circle className="bg" cx="17" cy="17" r="14" />
					<circle className="fg" id="dockRing" cx="17" cy="17" r="14" />
				</svg>
				<span className="dock__n roll" id="dockN">
					<span>01</span>
				</span>
				<span className="dock__t roll" id="dockT">
					<span>
						Cover<small>p.01</small>
					</span>
				</span>
			</a>
			<button className="dock__menu" id="dockMenu" type="button" aria-expanded="false" aria-controls="contents" aria-label="Contents">
				<span className="dock__menu-l">Contents</span>{' '}
				<span className="dock__ico" aria-hidden="true">
					<i />
					<i />
				</span>
			</button>
			<a className="dock__cta" href="#contact">
				Let&apos;s talk <span className="arrow">↗</span>
			</a>
		</nav>
	)
}

/** The contents sheet that grows out of the dock. */
export function Contents() {
	return (
		<div className="contents" id="contents" role="dialog" aria-modal="true" aria-labelledby="contentsTitle">
			<div className="contents__dim" id="contentsDim" />
			<div className="contents__sheet" id="sheet" data-lenis-prevent>
				<div className="contents__head">
					<span className="label" id="contentsTitle">
						Contents · Issue Nº 05
					</span>
					<span className="label" id="sheetClock">
						India
					</span>
				</div>
				<ol className="toc" id="toc">
					{SECTIONS.map(([href, name, desc], i) => (
						<li key={href}>
							<a href={href}>
								<span className="toc__n">{String(i + 1).padStart(2, '0')}</span>
								<span className="toc__t">{name}</span>
								<span className="toc__lead" />
								<span className="toc__d">{desc}</span>
							</a>
						</li>
					))}
				</ol>
				<div className="contents__foot">
					<div>
						<span className="label">Say hello</span>
						<a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
						<br />
						<button className="copy" type="button" data-copy={CONTACT.email}>
							Copy email
						</button>
					</div>
					<div>
						<span className="label">Elsewhere</span>
						<a href={CONTACT.linkedin} target="_blank" rel="noopener">
							LinkedIn
						</a>
						<a href={CONTACT.github} target="_blank" rel="noopener">
							GitHub
						</a>
						<a href={CONTACT.x} target="_blank" rel="noopener">
							X
						</a>
					</div>
					<div>
						<span className="label">Theme</span>
						<span className="theme-sw" role="group" aria-label="Colour theme">
							<button type="button" data-theme-set="dark">
								Dark
							</button>
							<button type="button" data-theme-set="light">
								Light
							</button>
						</span>
					</div>
				</div>
			</div>
		</div>
	)
}

/** The case-study overlay (filled on open by the engine). */
export function CaseOverlay() {
	return (
		<div className="case" id="case" role="dialog" aria-modal="true" aria-labelledby="caseTitle">
			<div className="case__scroll" id="caseScroll" data-lenis-prevent tabIndex={-1} />
		</div>
	)
}
