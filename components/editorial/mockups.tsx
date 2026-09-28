import type { CSSProperties } from 'react'
import type { Floater as FloaterT } from '@/data/projects'
import { SCREEN_OF } from '@/lib/editorial/screens'

/** Inline CSS custom properties. */
export const cssVars = (o: Record<string, string | number>) => o as CSSProperties

/** A product screen scaled to its frame. The screen itself is filled in on the client when it comes near. */
export function ScreenFit({ id }: { id: string }) {
	const [k] = SCREEN_OF[id]
	return (
		<div className="fit" data-lazy={id}>
			<div className={`scr scr--${k}`} />
		</div>
	)
}

export function Laptop({ id }: { id: string }) {
	return (
		<div className="dev dev--laptop" aria-hidden="true">
			<div className="dev__lid">
				<ScreenFit id={id} />
			</div>
			<div className="dev__base" />
		</div>
	)
}

export function Phone({ id }: { id: string }) {
	return (
		<div className="dev dev--phone" aria-hidden="true">
			<span className="dev__island" />
			<ScreenFit id={id} />
		</div>
	)
}

export const Device = ({ id }: { id: string }) => (SCREEN_OF[id][0] === 'p' ? <Phone id={id} /> : <Laptop id={id} />)

export function Browser({ id }: { id: string }) {
	if (SCREEN_OF[id][0] === 'p') return <Phone id={id} />
	return (
		<div className="dev dev--browser" aria-hidden="true">
			<div className="dev__bar">
				<i />
				<i />
				<i />
				<span>Illustrative UI</span>
			</div>
			<ScreenFit id={id} />
		</div>
	)
}

/** Cards placed past the middle are anchored to the right edge instead, so they stay inside narrow stages. */
export const fltPos = (f: FloaterT) => (parseFloat(f[4]) >= 50 ? { right: '4%', top: f[5] } : { left: f[4], top: f[5] })

/** A floating UI card that drifts at its own depth next to a device. */
export function Floater({ f, k }: { f: FloaterT; k: number }) {
	return (
		<div className={`flt ${f[0] === 'dark' ? 'flt--dark' : ''}`} data-depth={k ? 40 : 80} style={fltPos(f)}>
			<small>{f[1]}</small>
			<b>{f[2]}</b>
			<span>{f[3]}</span>
		</div>
	)
}
