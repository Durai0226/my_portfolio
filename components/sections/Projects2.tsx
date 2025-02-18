'use client'
import Link from 'next/link'
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

const swiperOptions = {
  modules: [Autoplay, Pagination, Navigation],
  slidesPerView: 1,
  slidesPerGroup: 1,
  centeredSlides: false,
  loop: true,
  autoplay: {
    delay: 4000,
  },
  pagination: {
    el: '.swiper-pagination',
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
}

const projects = [
	{
	  title: "D2Defense",
	  duration: "April 2024 - Present",
	  description: "Modern device management platform with advanced security features and real-time monitoring capabilities.",
	  client: "DataSirpi",
	  technologies: "React, SASS, React Query, Redux",
	  features: [
		"Led development using React, SASS, React Query, and Redux",
		"Implemented secure remote desktop access feature",
		"Designed real-time activity tracking dashboard",
		"Developed script management system with validation",
		"Enhanced device management capabilities"
	  ]
	},
	{
	  title: "DS Integra (CRM)",
	  duration: "Aug 2022 - Apr 2023",
	  description: "Comprehensive CRM and omni-channel platform for enhanced customer relationship management.",
	  client: "DataSirpi",
	  technologies: "Vue.js, SASS, REST API",
	  features: [
		"Developed comprehensive CRM platform",
		"Implemented multi-channel communication features",
		"Created user-friendly interface with Vue.js",
		"Enhanced customer relationship management capabilities",
		"Integrated scalable solutions for team collaboration"
	  ]
	},
	{
	  title: "HRMS System",
	  duration: "Mar 2022 - Aug 2022",
	  description: "Complete HR management system with role-based access and employee lifecycle management.",
	  client: "DataSirpi",
	  technologies: "Angular, TypeScript, Bootstrap",
	  features: [
		"Implemented employee onboarding/offboarding system",
		"Developed role-based access control",
		"Created responsive and maintainable codebase",
		"Enhanced data security measures",
		"Streamlined HR operations workflow"
	  ]
	},
	{
	  title: "Trojan",
	  duration: "Mar 2022 - Aug 2022",
	  description: "Equipment rental platform with comprehensive management and tracking capabilities.",
	  client: "DataSirpi",
	  technologies: "Angular, TypeScript, REST API",
	  features: [
		"Built equipment rental management system",
		"Implemented role-based data access structure",
		"Developed admin oversight capabilities",
		"Created secure data management system",
		"Enhanced user experience with intuitive interface"
	  ]
	},
	{
	  title: "AVIS NFT Platform",
	  duration: "Mar 2022 - Aug 2022",
	  description: "Blockchain-based platform for NFT creation, buying, and selling.",
	  client: "Accubits Technologies",
	  technologies: "React, Next.js, TypeScript, Styled Components",
	  features: [
		"Built NFT platform with blockchain integration",
		"Implemented clean UI design and code",
		"Developed NFT creation and trading features",
		"Received Accu Star Award for timely completion",
		"Ensured seamless module integration"
	  ]
	},
	{
	  title: "Viva-Vita",
	  duration: "Oct 2021 - Jan 2022",
	  description: "Static website for coconut product showcase with modern animations.",
	  client: "Accubits Technologies",
	  technologies: "React, GSAP, CSS3",
	  features: [
		"Developed static website with React",
		"Integrated GSAP animations",
		"Ensured responsive design across devices",
		"Implemented pixel-perfect Figma design",
		"Enhanced user experience with animations"
	  ]
	},
	{
	  title: "FutureGril NFT",
	  duration: "2022",
	  description: "NFT platform with comprehensive user and admin functionalities.",
	  client: "XNOVAA DIGITAL CONSULTING",
	  technologies: "React, TypeScript, Web3",
	  features: [
		"Developed SignIn/SignUp functionality",
		"Created UserProfile management system",
		"Implemented TransferNFT feature",
		"Built BulkUpload capability",
		"Enhanced Admin and User modules"
	  ]
	}
];


export default function Projects2() {
  return (
    <div className="section-projects-2 pt-5">
      <div className="container">
        <div className="rounded-3 border border-1 position-relative overflow-hidden">
          <div className="box-linear-animation position-relative z-1">
            <div className="p-lg-8 p-md-6 p-3 position-relative z-1">
              <div className="d-flex align-items-center">
                <svg className="text-primary-2 me-2" xmlns="http://www.w3.org/2000/svg" width={5} height={6} viewBox="0 0 5 6" fill="none">
                  <circle cx="2.5" cy={3} r="2.5" fill="#A8FF53" />
                </svg>
                <span className="text-linear-4 d-flex align-items-center"> Experience </span>
              </div>
              <h3>Professional Journey</h3>
              <div className="position-relative">
                <Swiper {...swiperOptions} className="swiper slider-two pb-3 position-relative">
                  <div className="swiper-wrapper">
                    {projects.map((project, index) => (
                      <SwiperSlide key={index}>
                        <div className="p-lg-5 p-md-4 p-3 border border-1 mt-5 bg-3">
                          <div className="row">
                            <div className="col-lg-5">
                              <img className="w-100" src="assets/imgs/home-page-2/projects/img-1.png" alt="project" />
                            </div>
                            <div className="col-lg-7 ps-lg-5 mt-5 mt-lg-0">
                              <h4 className="text-linear-4">
                                {project.title}
                              </h4>
                              <p>{project.description}</p>
                              <ul className="mt-4 list-unstyled">
                                <li className="text-secondary-2 mb-3 border-bottom pb-3">Project Details</li>
                                <li className="text-dark mb-3 border-bottom pb-3">
                                  <div className="d-flex justify-content-between">
                                    <p className="text-dark mb-0 text-end">Company</p>
                                    <p className="text-300 mb-0 text-end">{project.client}</p>
                                  </div>
                                </li>
                                <li className="text-dark mb-3 border-bottom pb-3">
                                  <div className="d-flex justify-content-between">
                                    <p className="text-dark mb-0 text-end">Duration</p>
                                    <p className="text-300 mb-0 text-end">{project.duration}</p>
                                  </div>
                                </li>
                                <li className="text-dark mb-3 border-bottom pb-3">
                                  <div className="d-flex justify-content-between">
                                    <p className="text-dark mb-0 text-end">Technologies</p>
                                    <p className="text-300 mb-0 text-end">{project.technologies}</p>
                                  </div>
                                </li>
                                {project.features.map((feature, idx) => (
                                  <li key={idx} className="text-dark mb-2">
                                    <p className="text-300 mb-0">• {feature}</p>
                                  </li>
                                ))}
                              </ul>
                              <div className="d-flex flex-wrap align-items-center gap-3 mt-7">
                                <Link href="#contact" className="text-300 border-bottom border-1 px-2 pb-2 link-hover">
                                  Contact Me
                                  <svg xmlns="http://www.w3.org/2000/svg" width={13} height={13} viewBox="0 0 13 13" fill="none">
                                    <path d="M11.0037 3.91421L2.39712 12.5208L0.98291 11.1066L9.5895 2.5H2.00373V0.5H13.0037V11.5H11.0037V3.91421Z" fill="#8F8F92" />
                                  </svg>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </div>
                </Swiper>
                <div className="position-absolute bottom-0 end-0 gap-2 pb-7 pe-5 d-none d-md-flex">
                  <div className="swiper-button-prev end-0 shadow position-relative">
                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
                      <path d="M7.82843 10.9999H20V12.9999H7.82843L13.1924 18.3638L11.7782 19.778L4 11.9999L11.7782 4.22168L13.1924 5.63589L7.82843 10.9999Z" fill="white" />
                    </svg>
                  </div>
                  <div className="swiper-button-next end-0 shadow position-relative">
                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
                      <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" fill="#A8FF53" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <img className="position-absolute top-0 start-0 z-0" src="assets/imgs/home-page-2/projects/bg.png" alt="background" />
          </div>
        </div>
      </div>
    </div>
  )
}