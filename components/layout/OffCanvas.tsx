import Link from 'next/link'

export default function OffCanvas({ isOffCanvas, handleOffCanvas }: any) {
	return (
		<>
			{/* offCanvas-menu */}
			<div className={`offCanvas__info ${isOffCanvas ? 'active' : ''}`}>
					<div className="offCanvas__close-icon menu-close" onClick={handleOffCanvas}>
						<button><i className="ri-close-line" /></button>
					</div>
					<div className="offCanvas__logo mb-5">
						<h3 className="mb-0">Get in touch</h3>
					</div>
					<div className="offCanvas__side-info mb-30">
						<div className="contact-list mb-30">
							<p className="fs-6 fw-medium text-200 mb-5">I'm always excited to take on new projects and collaborate with innovative minds.</p>
							<div className="mb-3">
								<span className="text-400 fs-5">Phone Number</span>
								<p className="mb-0">+91 9788621632</p>
							</div>
							<div className="mb-3">
								<span className="text-400 fs-5">Email</span>
								<p className="mb-0">vduraisingh@gmail.com</p>
							</div>
							<div className="mb-3">
								<span className="text-400 fs-5">Skype</span>
								<p className="mb-0">Duraisingh</p>
							</div>
							
						</div>
						<div className="contact-list">
							<p className="text-400 fs-5 mb-2">Social</p>
							<div className="d-md-flex d-none gap-3">
									<Link href="https://www.facebook.com/duraisingh.durai.3/" target='_blank'>
									<i className="ri-facebook-circle-fill fs-18" />
								</Link>
								<Link href="https://x.com/DuraiSinghPandi" target='_blank'>
									<i className="ri-twitter-x-fill fs-18" />
								</Link>
								<Link href="linkedin.com/in/duraisinghpandi-v-320129116" target='_blank'>
									<i className="ri-linkedin-fill fs-18" />
								</Link>
								<Link href="https://github.com/Durai0226" target='_blank'>
									<i className="ri-github-fill fs-18" />
								</Link>
									</div>
							</div>
						</div>
					
				</div>
			<div className={`offCanvas__overly ${isOffCanvas ? 'active' : ''}`}  onClick={handleOffCanvas}/>
		</>
	)
}
