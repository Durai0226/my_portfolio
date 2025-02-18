'use client'
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCode,
  faPaintBrush,
  faBolt,
  faCogs,
  faPuzzlePiece,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import '../../public/assets/css/vendors/service.css'; // Import the CSS file

export default function Service2() {
  const services = [
    {
      title: "React Development",
      icon: faCode,
      description:
        "Expertise in building dynamic web applications using React, Redux, and React Query with modern development practices.",
      tech: ["React", "Redux", "React Query"],
    },
    {
      title: "UI/UX Implementation",
      icon: faPaintBrush,
      description:
        "Creating responsive interfaces using Bootstrap, Ant Design, and Tailwind CSS with advanced styling using SASS.",
      tech: ["Bootstrap", "Ant Design", "Tailwind CSS", "SASS"],
    },
    {
      title: "Real-time Applications",
      icon: faBolt,
      description:
        "Implementation of real-time features using WebRTC, Websockets, and integration with various APIs.",
      tech: ["WebRTC", "Websockets", "REST API"],
    },
    {
      title: "DevOps & Automation",
      icon: faCogs,
      description:
        "Experience with Docker, Git, and Github actions for efficient deployment and automation.",
      tech: ["Docker", "Git", "Github Actions"],
    },
    {
      title: "Angular Development",
      icon: faPuzzlePiece,
      description:
        "Proficient in developing applications using Angular framework with TypeScript for enterprise-level solutions.",
      tech: ["Angular", "TypeScript"],
    },
    {
      title: "Animation & Interactivity",
      icon: faChartLine,
      description:
        "Creating engaging user experiences using GSAP animations and interactive features.",
      tech: ["GSAP", "Interactive UI"],
    },
  ];

  return (
    <section id="services" className="section-service-2 py-5">
      <div className="container ">
        <div className="rounded-3 border border-1 position-relative overflow-hidden ">
          <div className="box-linear-animation p-6">
            {/* Section Header */}
            <div className="text-center mb-5">
              <div className="badge-wrapper mb-3">
                <span className="custom-badge">
                  <svg
                    className="text-primary-2 me-2"
                    xmlns="http://www.w3.org/2000/svg"
                    width={5}
                    height={6}
                    viewBox="0 0 5 6"
                    fill="none"
                  >
                    <circle cx="2.5" cy={3} r="2.5" fill="#A8FF53" />
                  </svg>
                  Professional Expertise
                </span>
              </div>
              <h3 className="section-title">
                Transforming Ideas into{" "}
                <span className="highlight">Scalable</span> <br />
                <span className="gradient-text">Modern Web Solutions</span>
              </h3>
            </div>

            {/* Service Cards */}
            <div className="row g-4 mt-4">
              {services.map((service, index) => (
                <div key={index} className="col-lg-4 col-md-6">
                  <div className="service-card card-hover">
                    {/* Icon */}
                    <div className="icon-container icon-hover">
                      <FontAwesomeIcon
                        icon={service.icon}
                        className="service-icon"
                      />
                    </div>

                    {/* Content */}
                    <div className="card-content">
                      <h5 className="card-title">{service.title}</h5>
                      <p className="card-description">{service.description}</p>
                      
                      {/* Tech Stack */}
                      <div className="tech-stack">
                        {service.tech.map((tech, techIndex) => (
                          <span key={techIndex} className="tech-badge">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Call-to-Action */}
            <div className="cta-section">
              <p className="experience-text">
                Over <span className="highlight-text">3.5 years</span> of
                experience in creating{" "}
                <span className="highlight-text">modern web applications</span>
              </p>
              <Link href="#contact" className="cta-button">
                Let's Collaborate
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-arrow-right"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}