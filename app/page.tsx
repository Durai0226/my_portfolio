import Layout from "@/components/layout/Layout"
import Home2 from "@/components/sections/Home2"
import Static2 from "@/components/sections/Static2"
import Service2 from "@/components/sections/Service2"
import Projects2 from "@/components/sections/Projects2"
import Skills2 from "@/components/sections/Skills2"
import Contact2 from "@/components/sections/Contact2"
import Experience2 from "@/components/sections/Experience2"

export default function Home() {

	return (
		<>
			<Layout headerStyle={2} footerStyle={2}>
				<Home2 />
				<Static2 />
				<Service2 />
				<Experience2 />
				<Projects2 />
				<Skills2 />
				<Contact2 />
			</Layout>
		</>
	)
}