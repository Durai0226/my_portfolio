'use client'
import { useEffect } from 'react'
import { startEditorial } from '@/lib/editorial/engine'

/** Runs the editorial motion and behaviour on the server-rendered markup; undone on unmount. */
export default function Engine({ caseId }: { caseId?: string }) {
	useEffect(() => startEditorial(caseId ? { page: 'case', id: caseId } : { page: 'home' }), [caseId])
	return null
}
