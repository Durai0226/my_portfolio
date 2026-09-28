import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { projectBySlug, projects } from '@/data/projects'
import { caseHTML } from '@/lib/editorial/caseHTML'
import Engine from '@/components/editorial/Engine'

type Props = { params: { slug: string } }

export const dynamicParams = false
export const generateStaticParams = () => projects.map((p) => ({ slug: p.slug }))

export function generateMetadata({ params }: Props): Metadata {
	const p = projectBySlug[params.slug]
	if (!p) return {}
	return {
		title: `${p.title} — ${p.what} · Durai Singh`,
		description: `${p.sum} ${p.role} at ${p.company}, ${p.dur}. Built with ${p.stack}.`,
		openGraph: { title: `${p.title} — case study`, description: p.deck, type: 'article' },
	}
}

/** A case study as its own page (the same filmstrip the home page opens as an overlay). */
export default function CaseStudyPage({ params }: Props) {
	const p = projectBySlug[params.slug]
	if (!p) notFound()
	return (
		<>
			<main className="case is-page" id="case" aria-labelledby="caseTitle">
				<div className="case__scroll" id="caseScroll" data-lenis-prevent tabIndex={-1} dangerouslySetInnerHTML={{ __html: caseHTML(p) }} />
			</main>
			<Engine caseId={p.id} />
		</>
	)
}
