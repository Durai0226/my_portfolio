import { Atmosphere, CaseOverlay, Contents, Dock } from './Chrome'
import Cover from './Cover'
import { Experience, Numbers, Services } from './Sections'
import Work from './Work'
import { Contact, Toolbox } from './Closing'
import Engine from './Engine'

/** The Issue: the portfolio as a magazine. Cover → contents → editor's letter → numbers → services → experience →
 * selected work → toolbox → back cover. Everything is server-rendered; <Engine> adds motion on the client. */
export default function Editorial() {
	return (
		<>
			<Atmosphere />
			<Dock />
			<Contents />
			<main>
				<Cover />
				<Numbers />
				<Services />
				<Experience />
				<Work />
				<Toolbox />
				<Contact />
			</main>
			<CaseOverlay />
			<Engine />
		</>
	)
}
