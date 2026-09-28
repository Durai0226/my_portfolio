import { projects } from '@/data/projects'
import { Browser, Device, Floater, cssVars } from './mockups'

/** Non-breaking spaces inside a value (a date range), or inside each comma-separated item (a stack). */
const keep = (s: string) => s.replace(/ /g, ' ')
const keepItems = (s: string) => s.split(', ').map(keep).join(', ')

const FILTERS = ['All', 'React', 'Next.js', 'Angular', 'Vue']

/** 6. Selected work — a horizontal feature gallery of three products, then all seven as a filterable grid or list. */
export default function Work() {
	const featured = projects.slice(0, 3)
	return (
		<section className="work panel panel--round" id="work">
			<div className="container">
				<div className="sec-head">
					<span className="brace">{'{ work }'}</span>
					<h2 className="display h2">
						Selected <span className="serif">work</span>
					</h2>
					<p className="lead">Three products in depth, shown the way they ship, one after another. All seven follow below.</p>
				</div>
			</div>
			<div className="hg" id="hg">
				<div className="hg__pin">
					<div className="hg__track" id="hgTrack" data-lenis-prevent-touch>
						{featured.map((p, i) => (
							<article key={p.id} className="hp" style={cssVars({ '--sbg': p.bg, '--c1': p.c1, '--c2': p.c2 })}>
								<div className="hp__bg" />
								<div className="hp__info">
									<p className="hp__num">
										<b>0{i + 1}</b>/ 03 · {p.what}
									</p>
									<h3 className="hp__t display">{p.title}</h3>
									<p className="hp__deck">{p.deck}</p>
									<dl className="hp__meta">
										<div>
											<dt>Role</dt>
											<dd>{p.role}</dd>
										</div>
										<div>
											<dt>Company</dt>
											<dd>{p.company}</dd>
										</div>
										<div>
											<dt>Timeline</dt>
											<dd>{keep(p.dur)}</dd>
										</div>
										<div>
											<dt>Stack</dt>
											<dd>{keepItems(p.stack)}</dd>
										</div>
									</dl>
									<button className="btn" type="button" data-open={p.id} data-cursor="Open">
										Open case study <span className="arrow">↗</span>
									</button>
								</div>
								<div className="hp__stage">
									<div className="hp__dev" data-open={p.id} data-cursor="Open">
										<Device id={p.id} />
									</div>
									{p.flts.map((f, k) => (
										<Floater key={k} f={f} k={k} />
									))}
								</div>
								<span className="hp__note">Illustrative UI · sample data</span>
							</article>
						))}
					</div>
					<div className="hg__foot">
						<span className="hg__count" id="hgCount">
							<b>01</b> / 03
						</span>
						<span className="hg__bar" aria-hidden="true">
							<i id="hgBar" />
						</span>
						<span className="hg__hint">
							<span className="d">Scroll to browse</span>
							<span className="m">Swipe to browse</span>
						</span>
					</div>
				</div>
			</div>
			<div className="container index">
				<div className="index__head">
					<h3 className="display">All projects</h3>
					<p className="lead" style={{ maxWidth: '44ch' }}>
						Seven products across security, Web3, CRM and HR. Filter by technology, switch to the list, open any case study.
					</p>
				</div>
				<div className="pgrid__bar">
					<div className="filters" id="filters" role="group" aria-label="Filter projects by technology">
						{FILTERS.map((f, i) => (
							<button key={f} type="button" aria-pressed={i === 0} data-f={f}>
								{f}
								<sup>{f === 'All' ? projects.length : projects.filter((p) => p.tags.includes(f)).length}</sup>
							</button>
						))}
					</div>
					<div className="view" role="group" aria-label="Layout">
						<button type="button" aria-pressed="true" data-view="grid">
							▦ Grid
						</button>
						<button type="button" aria-pressed="false" data-view="list">
							☰ List
						</button>
					</div>
				</div>
				<div className="pgrid" id="pgrid">
					{projects.map((p, i) => (
						<article key={p.id} className="gcard" data-tags={p.tags.join(' ')}>
							<button className="gcard__btn" type="button" data-open={p.id} aria-label={`Open the ${p.title} case study`}>
								<span className="gcard__vis" style={cssVars({ '--c1': p.c1, '--c2': p.c2 })}>
									<span className="gcard__n">P/0{i + 1}</span>
									<span className="gcard__view">View case study ↗</span>
									<span className="inner">
										<Browser id={p.id} />
									</span>
								</span>
								<span className="gcard__row">
									<span className="gcard__t">{p.title}</span>
									<span className="gcard__y">{p.year}</span>
								</span>
								<span className="gcard__w">
									{p.what} · {p.company}
								</span>
								<span className="gcard__tags">
									{p.stack
										.split(', ')
										.slice(0, 3)
										.map((t) => (
											<span key={t}>{t}</span>
										))}
								</span>
							</button>
						</article>
					))}
				</div>
				<ol className="plist" id="plist" hidden>
					{projects.map((p, i) => (
						<li key={p.id}>
							<button className="prow" type="button" data-open={p.id} data-pv={p.id} data-tags={p.tags.join(' ')} style={cssVars({ '--pbg': p.bg })}>
								<span className="prow__thumb" aria-hidden="true">
									<Browser id={p.id} />
								</span>
								<span className="prow__n">P/0{i + 1}</span>
								<span className="prow__t">{p.title}</span>
								<span className="prow__w">{p.what}</span>
								<span className="prow__c">{p.company}</span>
								<span className="prow__y">{p.year}</span>
								<span className="prow__a" aria-hidden="true">
									↗
								</span>
							</button>
						</li>
					))}
				</ol>
			</div>
			<div className="pv" id="pv" aria-hidden="true" />
		</section>
	)
}
