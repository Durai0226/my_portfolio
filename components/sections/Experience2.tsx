'use client'
import Link from 'next/link'
import Image from 'next/image'

export default function Experience2() {
  return (
    <>
      <section id="portfolio" className="section-experience pt-5">
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
                <h3>
                  +3.5
                  <span className="text-300">years of </span>
                  expertise
                  <span className="text-300">
                    in <br />
                    React development
                  </span>
                </h3>
                <div className="row mt-5">
                  <div className="col-lg-4">
                    <div className="d-flex flex-column gap-2">
                      <Link href="#" className="technology border border-1 rounded-3 p-3 hover-effect">
                        <div className="d-flex align-items-center gap-2">
                          <div className="company-logo-wrapper">
                            <Image
                              src="/assets/imgs/home-page-2/experience/Ds.svg"
                              alt="DataSirpi"
                              width={50}
                              height={50}
                              className="company-logo-img"
                            />
                          </div>
                          <div className="d-flex flex-column ms-2">
                            <h5 className="mb-1">DataSirpi</h5>
                            <span className="text-300">Aug 2023 - Present</span>
                          </div>
                        </div>
                      </Link>
                      <Link href="#" className="technology border border-1 rounded-3 p-3 hover-effect">
                        <div className="d-flex align-items-center gap-2">
                          <div className="company-logo-wrapper">
                            <Image
                              src="/assets/imgs/home-page-2/experience/accubits.png"
                              alt="Accubits"
                              width={50}
                              height={50}
                              className="company-logo-img"
                            />
                          </div>
                          <div className="d-flex flex-column ms-2">
                            <h5 className="mb-1">Accubits Technologies</h5>
                            <span className="text-300">Mar 2022 - Apr 2023</span>
                          </div>
                        </div>
                      </Link>
                      <Link href="#" className="technology border border-1 rounded-3 p-3 hover-effect">
                        <div className="d-flex align-items-center gap-2">
                          <div className="company-logo">XD</div>
                          <div className="d-flex flex-column ms-2">
                            <h5 className="mb-1">XNOVAA DIGITAL</h5>
                            <span className="text-300">Apr 2021 - Mar 2022</span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                  <div className="col-lg-8 ps-lg-5 mt-5 mt-lg-0">
                    <h6 className="text-linear-4">React Frontend Developer</h6>
                    <ul className="mt-4">
                      <li className="text-dark mb-3">Developed and maintained multiple projects using <span className="highlight">React and Angular</span>, creating dynamic, responsive web applications.</li>
                      <li className="text-dark mb-3">Led development of D2Defense platform using React, SASS, React Query, and Redux.</li>
                      <li className="text-dark mb-3">Implemented remote desktop features and real-time activity monitoring dashboards.</li>
                    </ul>
                    <div className="d-flex flex-wrap align-items-center gap-3 mt-7">
                      <Link href="#" className="tech-tag">React</Link>
                      <Link href="#" className="tech-tag">TypeScript</Link>
                      <Link href="#" className="tech-tag">Redux</Link>
                      <Link href="#" className="tech-tag">Next.js</Link>
                      <Link href="#" className="tech-tag">Docker</Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="background-image">
                <Image
                  src="/assets/imgs/home-page-2/services/bg.png"
                  alt="background"
                  fill
                  sizes="100vw"
                  style={{ objectFit: 'cover' }}
                  className="position-absolute top-0 start-0 z-0"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .company-logo-wrapper {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .company-logo-img {
          max-width: 100%;
          height: auto;
          object-fit: contain;
        }

        .company-logo {
          width: 50px;
          height: 50px;
          background: linear-gradient(45deg, #A8FF53, #00C6FF);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 1.2rem;
        }

        .hover-effect {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .hover-effect:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .highlight {
          color: #A8FF53;
          font-weight: 600;
        }

        .tech-tag {
          background: linear-gradient(45deg, rgba(168,255,83,0.1), rgba(0,198,255,0.1));
          border: 1px solid rgba(168,255,83,0.3);
          padding: 8px 16px;
          border-radius: 20px;
          color: #333;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .tech-tag:hover {
          background: linear-gradient(45deg, rgba(168,255,83,0.2), rgba(0,198,255,0.2));
          transform: translateY(-1px);
        }

        .background-image {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
        }
      `}</style>
    </>
  )
}