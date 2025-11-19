import LeadGenChat from './LeadGenChat';

const Contact = () => {
  return (
    <section className="scroll-animate lg:py-24 pt-20 pb-20 relative in-view" id="contact">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <h2 className="sm:text-4xl lg:text-5xl text-3xl font-light tracking-tighter font-geist text-white mb-6">
            Let's Create Something
            <span className="block bg-clip-text font-light text-transparent tracking-tighter font-geist bg-gradient-to-l from-purple-500 to-orange-300">Awesome!</span>
          </h2>
          <p className="leading-relaxed text-lg text-white/80 max-w-2xl mr-auto ml-auto">
            Tell me about your project, and I'll get back within 24 hours.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-2">
            <div className="lg:p-8 bg-gradient-to-b to-white/[0.02] from-white/5 h-full border-white/10 border ring-white/5 ring-1 rounded-2xl pt-6 pr-6 pb-6 pl-6 backdrop-blur-xl">
              <div className="flex flex-col h-full space-y-6">
                <div className="">
                  <h3 className="text-xl text-white font-semibold mb-2">Contact details</h3>
                  <p className="text-white/80">
                    Prefer email? Reach out directly at
                    <a href="mailto:design@vansh.fyi" className="underline decoration-2 underline-offset-4 text-white decoration-white/30 hover:decoration-white">
                      design@vansh.fyi
                    </a>
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="inline-flex bg-white/10 w-10 h-10 ring-white/10 ring-1 rounded-xl items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l9 6 9-6M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"></path>
                    </svg>
                  </div>
                  <div className="">
                    <p className="font-medium text-white">Project inquiries</p>
                    <p className="text-sm text-white/50">Response time within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 inline-flex items-center justify-center rounded-xl ring-1 bg-white/10 ring-white/10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </div>
                  <div className="">
                    <p className="font-medium text-white">Based in</p>
                    <p className="text-sm text-white/50">Remote · Global collaborations</p>
                  </div>
                </div>
                <div className="grow pt-24">
                  <a href="mailto:design@vansh.fyi" className="group inline-flex transition-all duration-300 card-shine hover-glow hover:bg-white/10 hover:border-white/30 gap-x-3 gap-y-3 items-center text-base font-medium text-white/80 bg-white/5 border-white/10 border rounded-2xl pt-4 pr-8 pb-4 pl-8 backdrop-blur-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1">
                      <path d="M5 12h14" className=""></path>
                      <path d="m12 5 7 7-7 7" className=""></path>
                    </svg>
                    <span className="">Send Me a Mail</span>
                  </a>
                  <p className="mt-3 text-xs text-white/50">Your info is private and only used to respond to your query.</p>
                </div>
              </div>
            </div>
          </div>
          {/* Lead Generation Chat */}
          <div className="lg:col-span-3">
            <LeadGenChat />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;