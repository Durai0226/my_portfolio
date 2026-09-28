import Editorial from '@/components/editorial/Editorial'

/* Tenure, the career graph's "now" line and the years count are computed on the server; rebuild daily so they stay current. */
export const revalidate = 86400

export default function Home() {
	return <Editorial />
}
