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
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="lg:p-8 bg-gradient-to-b to-white/[0.02] border ring-1 rounded-2xl p-6 backdrop-blur-xl h-full flex flex-col from-white/5 border-white/10 ring-white/5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="inline-flex bg-white/10 w-10 h-10 ring-white/10 ring-1 rounded-xl items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-white/80">
                      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                      <path d="M20 3v4"></path>
                      <path d="M22 5h-4"></path>
                      <path d="M4 17v2"></path>
                      <path d="M5 18H3"></path>
                    </svg>
                  </div>
                  <div className="">
                    <p className="font-semibold tracking-tight text-white">AI Personal Assistant</p>
                    <p className="text-xs text-white/50">Online · Responds instantly</p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 text-xs text-white/50">
                  <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
                  Live
                </div>
              </div>
              <div className="flex-1 min-h-[260px] overflow-auto max-h-[420px] pt-1 pr-1 pb-1 pl-1 space-y-4" id="chat-thread">
                <div className="flex gap-x-3 gap-y-3 items-start">
                  <div className="flex flex-shrink-0 text-xs font-medium bg-white/10 w-8 h-8 ring-white/10 ring-1 rounded-full items-center justify-center text-white">
                    AI
                  </div>
                  <div className="relative">
                    <div className="text-sm max-w-[680px] rounded-2xl py-3 px-4 shadow backdrop-blur-sm ring-1 bg-black/30 ring-white/10">
                      <p className="text-white/80">
                        Hi there! Nice to meet you. Text me for collaboration or opportunities !
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="group transition-all duration-200 hover-glow focus-within:ring-2 focus-within:ring-white/50 hover:bg-black/30 hover:ring-white/20 bg-black/50 ring-white/10 ring-1 rounded-xl pt-2 pr-2 pb-2 pl-2">
                <div className="flex gap-2 gap-x-2 gap-y-2 items-center">
                  <div className="hidden sm:flex w-9 h-9 border rounded-lg items-center justify-center text-white/80 bg-white/10 border-white/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-white/80">
                      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" className=""></path>
                      <path d="M20 3v4"></path>
                      <path d="M22 5h-4"></path>
                      <path d="M4 17v2"></path>
                      <path d="M5 18H3"></path>
                    </svg>
                  </div>
                  <input type="text" aria-label="Share the details with my AI agent" className="focus:outline-none text-sm text-white bg-transparent w-full h-10 pr-3 pl-3" placeholder="Tell the details to my agent.." data-typed-placeholder="Tell the details to my agent" />
                  <button className="inline-flex transition-colors active:scale-95 w-9 h-9 border rounded-lg items-center justify-center hover:bg-white bg-white/80 border-white/10" aria-label="Send message">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-black/80">
                      <path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z" className=""></path>
                      <path d="M6 12h16" className=""></path>
                    </svg>
                  </button>
                </div>
              </div>
              <p className="mt-3 text-xs text-white/50">
                Your info is private and only used to respond to your message. Type “back” to revise or “summarise” anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
