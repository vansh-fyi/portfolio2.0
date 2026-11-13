import { AppWindow, Blocks, Briefcase, Code, Goal, Sparkles, UserSearch, Workflow } from 'lucide-react';
const Skills = () => {
  return (
    <section className="scroll-animate lg:py-24 in-view pt-24 pb-24 relative" id="features">
      <div className="sm:px-6 lg:px-8 max-w-7xl mr-auto ml-auto pr-4 pl-4">
        <div className="text-center mb-16">
          <h2 className="sm:text-4xl lg:text-5xl text-3xl font-light tracking-tighter font-geist mb-6 text-white pointer-events-none">
            Illuminate Your
            <span className="block bg-clip-text font-light text-transparent tracking-tighter font-geist bg-gradient-to-l from-purple-500 to-orange-300 pointer-events-none">Creative Process</span>
          </h2>
          <p className="leading-relaxed text-lg max-w-2xl mr-auto ml-auto text-white/80 pointer-events-none">
            With my multidisciplinary skill set.
          </p>
        </div>
        <div className="max-w-7xl mr-auto ml-auto">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6" id="industry-cards">
            {/* Card 1 */}
            <div className="fade-in-up hover:-translate-y-2 transition-[transform,translate,scale,opacity,background-color,border-color,box-shadow,color] duration-500 group hover:from-white/12 hover:to-white/10 hover:ring-white/20 bg-black/30 to-white/4 ring-white/10 ring-1 rounded-2xl pt-6 pr-6 pb-6 pl-6 relative backdrop-blur-lg">
              <div className="flex mb-4 items-center justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-xl ring-1 group-hover:ring-white/20 group-hover:bg-white/10 transition-[transform,translate,scale,opacity,background-color,border-color,box-shadow,color] duration-300 bg-white/5 ring-white/10">
                  <Workflow className="w-5 h-5 group-hover:text-white group-hover:scale-110 transition-[transform,translate,scale,opacity,background-color,border-color,box-shadow,color] duration-300 text-white/80" strokeWidth={1.5} aria-hidden="true" />
                </div>
                <span className="text-xs font-medium group-hover:text-white/80 transition-colors text-white/50">01</span>
              </div>
              <h3 className="text-white/80 group-hover:text-white transition-colors text-lg font-semibold tracking-tight font-geist mb-2 pointer-events-none">
                UX Design
              </h3>
              <p className="group-hover:text-white transition-colors leading-relaxed text-sm text-white/80 pointer-events-none">
                I break down complex user flows and create wireframes that turn a messy UI into a simple, intuitive, and human-centered experience.
              </p>
            </div>
            {/* Card 2 */}
            <div className="fade-in-up hover:-translate-y-2 transition-[transform,translate,scale,opacity,background-color,border-color,box-shadow,color] duration-500 group bg-black/30 ring-1 rounded-2xl pt-6 pr-6 pb-6 pl-6 relative backdrop-blur-lg hover:from-white/12 hover:to-white/6 hover:ring-white/20 from-white/8 to-white/4 ring-white/10">
              <div className="flex mb-4 items-center justify-between">
                <div className="grid place-items-center group-hover:ring-white/20 group-hover:bg-white/10 transition-[transform,translate,scale,opacity,background-color,border-color,box-shadow,color] duration-300 w-12 h-12 ring-1 rounded-xl bg-white/5 ring-white/10">
                  <AppWindow className="w-5 h-5 group-hover:text-white group-hover:scale-110 transition-[transform,translate,scale,opacity,background-color,border-color,box-shadow,color] duration-300 text-white/80" strokeWidth={1.5} aria-hidden="true" />
                </div>
                <span className="text-xs font-medium group-hover:text-white/80 transition-colors text-white/50">02</span>
              </div>
              <h3 className="text-white/80 group-hover:text-white transition-colors text-lg font-semibold tracking-tight font-geist mb-2 pointer-events-none">
                UI Design
              </h3>
              <p className="group-hover:text-white transition-colors leading-relaxed text-sm text-white/80 pointer-events-none">
                I solve complex problems for web SaaS, Enterprise or mobile apps and turn them into clean, elegant, and scalable interfaces.
              </p>
            </div>
            {/* Card 3 */}
            <div className="fade-in-up hover:-translate-y-2 transition-[transform,translate,scale,opacity,background-color,border-color,box-shadow,color] duration-500 group bg-black/30 ring-1 rounded-2xl pt-6 pr-6 pb-6 pl-6 relative backdrop-blur-lg hover:from-white/12 hover:to-white/6 hover:ring-white/20 from-white/8 to-white/4 ring-white/10">
              <div className="flex mb-4 items-center justify-between">
                <div className="grid place-items-center group-hover:ring-white/20 group-hover:bg-white/10 transition-[transform,translate,scale,opacity,background-color,border-color,box-shadow,color] duration-300 w-12 h-12 rounded-xl ring-1 bg-white/5 ring-white/10">
                  <UserSearch className="w-5 h-5 group-hover:text-white group-hover:scale-110 transition-[transform,translate,scale,opacity,background-color,border-color,box-shadow,color] duration-300 text-white/80" strokeWidth={1.5} aria-hidden="true" />
                </div>
                <span className="text-xs font-medium group-hover:text-white/80 transition-colors text-white/50">03</span>
              </div>
              <h3 className="text-white/80 group-hover:text-white transition-colors text-lg font-semibold tracking-tight font-geist mb-2 pointer-events-none">
                User Research
              </h3>
              <p className="group-hover:text-white transition-colors leading-relaxed text-sm text-white/80 pointer-events-none">
                I am a firm believer in data, but also in talking and extracting insights from people. I love to work at the intersection of quantitative and qualitative data.
              </p>
            </div>
            {/* Card 4 */}
            <div className="fade-in-up hover:-translate-y-2 transition-[transform,translate,scale,opacity,background-color,border-color,box-shadow,color] duration-500 group bg-black/30 ring-1 rounded-2xl pt-6 pr-6 pb-6 pl-6 relative backdrop-blur-lg hover:from-white/12 hover:to-white/6 hover:ring-white/20 from-white/8 to-white/4 ring-white/10">
              <div className="flex mb-4 items-center justify-between">
                <div className="grid place-items-center group-hover:ring-white/20 group-hover:bg-white/10 transition-[transform,translate,scale,opacity,background-color,border-color,box-shadow,color] duration-300 w-12 h-12 ring-1 rounded-xl bg-white/5 ring-white/10">
                  <Blocks className="w-5 h-5 group-hover:text-white group-hover:scale-110 transition-[transform,translate,scale,opacity,background-color,border-color,box-shadow,color] duration-300 text-white/80" strokeWidth={1.5} aria-hidden="true" />
                </div>
                <span className="text-xs font-medium group-hover:text-white/80 transition-colors text-white/50">04</span>
              </div>
              <h3 className="text-white/80 group-hover:text-white transition-colors text-lg font-semibold tracking-tight font-geist mb-2 pointer-events-none">
                Design Systems
              </h3>
              <p className="group-hover:text-white transition-colors leading-relaxed text-sm text-white/80 pointer-events-none">
                I like my designs to work in a well defined system.I love to build design systems that empowers teams to build faster and maintain coherence at scale.
              </p>
            </div>
            {/* Card 5 */}
            <div className="fade-in-up hover:-translate-y-2 transition-[transform,translate,scale,opacity,background-color,border-color,box-shadow,color] duration-500 group bg-black/30 ring-1 rounded-2xl pt-6 pr-6 pb-6 pl-6 relative backdrop-blur-lg hover:from-white/12 hover:to-white/6 hover:ring-white/20 from-white/8 to-white/4 ring-white/10">
              <div className="flex mb-4 items-center justify-between">
                <div className="grid place-items-center group-hover:ring-white/20 group-hover:bg-white/10 transition-[transform,translate,scale,opacity,background-color,border-color,box-shadow,color] duration-300 w-12 h-12 rounded-xl ring-1 bg-white/5 ring-white/10">
                  <Code className="w-5 h-5 group-hover:text-white group-hover:scale-110 transition-[transform,translate,scale,opacity,background-color,border-color,box-shadow,color] duration-300 text-white/80" strokeWidth={1.5} aria-hidden="true" />
                </div>
                <span className="text-xs font-medium group-hover:text-white/80 transition-colors text-white/50">05</span>
              </div>
              <h3 className="text-white/80 mb-2 text-lg font-semibold tracking-tight font-geist group-hover:text-white transition-colors pointer-events-none">
                Prototyping
              </h3>
              <p className="group-hover:text-white transition-colors leading-relaxed text-sm text-white/80 pointer-events-none">
                I can build interactive prototypes using Figma, Framer, and can also "vibe-code" in HTML, CSS and Typescript to communicate designs cross-functionlly.
              </p>
            </div>
            {/* Card 6 */}
            <div className="fade-in-up hover:-translate-y-2 transition-[transform,translate,scale,opacity,background-color,border-color,box-shadow,color] duration-500 group bg-black/30 ring-1 rounded-2xl pt-6 pr-6 pb-6 pl-6 relative backdrop-blur-lg hover:from-white/12 hover:to-white/6 hover:ring-white/20 from-white/8 to-white/4 ring-white/10">
              <div className="mb-4 flex items-center justify-between">
                <div className="grid place-items-center group-hover:ring-white/20 group-hover:bg-white/10 transition-[transform,translate,scale,opacity,background-color,border-color,box-shadow,color] duration-300 w-12 h-12 ring-1 rounded-xl bg-white/5 ring-white/10">
                  <Briefcase className="w-5 h-5 group-hover:text-white group-hover:scale-110 transition-[transform,translate,scale,opacity,background-color,border-color,box-shadow,color] duration-300 text-white/80" strokeWidth={1.5} aria-hidden="true" />
                </div>
                <span className="group-hover:text-white/80 transition-colors text-xs font-medium text-white/50">06</span>
              </div>
              <h3 className="text-white/80 group-hover:text-white transition-colors text-lg font-semibold tracking-tight font-geist mb-2 pointer-events-none">
                SaaS &amp; Enterprise Design
              </h3>
              <p className="group-hover:text-white transition-colors leading-relaxed text-sm text-white/80 pointer-events-none">
                This is my sweet spot. I have a knack for untangling complex, data-heavy Enterprise flows. Proven experience in cutting average time on task by 50%.
              </p>
            </div>
            {/* Card 7 */}
            <div className="fade-in-up hover:-translate-y-2 transition-[transform,translate,scale,opacity,background-color,border-color,box-shadow,color] duration-500 group bg-black/30 ring-1 rounded-2xl pt-6 pr-6 pb-6 pl-6 relative backdrop-blur-lg hover:from-white/12 hover:to-white/6 hover:ring-white/20 from-white/8 to-white/4 ring-white/10">
              <div className="mb-4 flex items-center justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-xl ring-1 group-hover:ring-white/20 group-hover:bg-white/10 transition-[transform,translate,scale,opacity,background-color,border-color,box-shadow,color] duration-300 bg-white/5 ring-white/10">
                  <Goal className="w-5 h-5 group-hover:text-white group-hover:scale-110 transition-[transform,translate,scale,opacity,background-color,border-color,box-shadow,color] duration-300 text-white/80" strokeWidth={1.5} aria-hidden="true" />
                </div>
                <span className="group-hover:text-white/80 transition-colors text-xs font-medium text-white/50">07</span>
              </div>
              <h3 className="text-white/80 group-hover:text-white transition-colors text-lg font-semibold tracking-tight font-geist mb-2 pointer-events-none">
                Design Strategy
              </h3>
              <p className="group-hover:text-white/80 transition-colors leading-relaxed text-sm text-white/80 pointer-events-none">
                Visual design should also be a business driver. I love collaborating with leadership to set product direction to generate business leads and traffic.
              </p>
            </div>
            {/* Card 8 */}
            <div className="fade-in-up hover:-translate-y-2 transition-[transform,translate,scale,opacity,background-color,border-color,box-shadow,color] duration-500 group bg-black/30 ring-1 rounded-2xl pt-6 pr-6 pb-6 pl-6 relative backdrop-blur-lg hover:from-white/12 hover:to-white/6 hover:ring-white/20 from-white/8 to-white/4 ring-white/10">
              <div className="mb-4 flex items-center justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-xl ring-1 group-hover:ring-white/20 group-hover:bg-white/10 transition-[transform,translate,scale,opacity,background-color,border-color,box-shadow,color] duration-300 bg-white/5 ring-white/10">
                  <Sparkles className="w-5 h-5 group-hover:text-white group-hover:scale-110 transition-[transform,translate,scale,opacity,background-color,border-color,box-shadow,color] duration-300 text-white/80" strokeWidth={1.5} aria-hidden="true" />
                </div>
                <span className="text-xs font-medium group-hover:text-white/80 transition-colors text-white/50">08</span>
              </div>
              <h3 className="text-white/80 group-hover:text-white transition-colors text-lg font-semibold tracking-tight font-geist mb-2 pointer-events-none">
                ML &amp; Generative AI
              </h3>
              <p className="group-hover:text-white transition-colors leading-relaxed text-sm text-white/80 pointer-events-none">
                This is my new obsession. I'm actively exploring Generative AI, Python, and RAG systems. I believe AI needs its GUI transition soon.
              </p>
            </div>
          </div>
          {/* Tools & Technologies */}
          <div className="lg:p-8 ring-1 rounded-2xl bg-black/30 mt-8 pt-6 pr-6 pb-6 pl-6 backdrop-blur-lg ring-white/10">
            <h3 className="text-lg font-semibold font-geist mb-4 text-white">Tools &amp; Technologies</h3>
            <div className="flex flex-wrap gap-x-3 gap-y-3 xl:gap-x-3">
              <span className="text-sm rounded-lg ring-1 pt-2 pr-3 pb-2 pl-3 hover:ring-white/20 text-white/80 bg-white/10 ring-white/10 pointer-events-none">Figma</span>
              <span className="text-sm rounded-lg ring-1 pt-2 pr-3 pb-2 pl-3 hover:ring-white/20 text-white/80 bg-white/10 ring-white/10 pointer-events-none">Framer</span>
              <span className="text-sm ring-1 rounded-lg pt-2 pr-3 pb-2 pl-3 hover:ring-white/20 text-white/80 bg-white/10 ring-white/10 pointer-events-none">Webflow</span>
              <span className="text-sm rounded-lg ring-1 pt-2 pr-3 pb-2 pl-3 hover:ring-white/20 text-white/80 bg-white/10 ring-white/10 pointer-events-none">Rive</span>
              <span className="text-sm ring-1 rounded-lg pt-2 pr-3 pb-2 pl-3 hover:ring-white/20 text-white/80 bg-white/10 ring-white/10 pointer-events-none">LottieLab</span>
              <span className="text-sm rounded-lg ring-1 pt-2 pr-3 pb-2 pl-3 hover:ring-white/20 text-white/80 bg-white/10 ring-white/10 pointer-events-none">Microsoft Clarity</span>
              <span className="text-sm ring-1 rounded-lg pt-2 pr-3 pb-2 pl-3 hover:ring-white/20 text-white/80 bg-white/10 ring-white/10 pointer-events-none">Photoshop</span>
              <span className="text-sm ring-1 rounded-lg pt-2 pr-3 pb-2 pl-3 hover:ring-white/20 text-white/80 bg-white/10 ring-white/10 pointer-events-none">Illustrator</span>
              <span className="text-sm ring-1 rounded-lg pt-2 pr-3 pb-2 pl-3 hover:ring-white/20 text-white/80 bg-white/10 ring-white/10 pointer-events-none">Eleven Labs</span>
              <span className="text-sm ring-1 rounded-lg pt-2 pr-3 pb-2 pl-3 hover:ring-white/20 text-white/80 bg-white/10 ring-white/10 pointer-events-none">Suno AI</span>
              <span className="text-sm ring-1 rounded-lg pt-2 pr-3 pb-2 pl-3 hover:ring-white/20 text-white/80 bg-white/10 ring-white/10 pointer-events-none">Cursor</span>
              <span className="text-sm ring-1 rounded-lg pt-2 pr-3 pb-2 pl-3 hover:ring-white/20 text-white/80 bg-white/10 ring-white/10 pointer-events-none">Antigravity</span>
              <span className="text-sm rounded-lg ring-1 pt-2 pr-3 pb-2 pl-3 hover:ring-white/20 text-white/80 bg-white/10 ring-white/10 pointer-events-none">Google Colab</span>
              <span className="text-sm rounded-lg ring-1 pt-2 pr-3 pb-2 pl-3 hover:ring-white/20 text-white/80 bg-white/10 ring-white/10 pointer-events-none">Jupyter Notebook</span>
              <span className="text-sm rounded-lg ring-1 pt-2 pr-3 pb-2 pl-3 hover:ring-white/20 text-white/80 bg-white/10 ring-white/10 pointer-events-none">Python</span>
              <span className="text-sm rounded-lg ring-1 pt-2 pr-3 pb-2 pl-3 hover:ring-white/20 text-white/80 bg-white/10 ring-white/10 pointer-events-none">HTML</span>
              <span className="text-sm rounded-lg ring-1 pt-2 pr-3 pb-2 pl-3 hover:ring-white/20 text-white/80 bg-white/10 ring-white/10 pointer-events-none">CSS</span>
              <span className="text-sm rounded-lg ring-1 pt-2 pr-3 pb-2 pl-3 hover:ring-white/20 text-white/80 bg-white/10 ring-white/10 pointer-events-none">Tailwind CSS</span>
              <span className="text-sm rounded-lg ring-1 pt-2 pr-3 pb-2 pl-3 hover:ring-white/20 text-white/80 bg-white/10 ring-white/10 pointer-events-none">JavaScript</span>
              <span className="text-sm rounded-lg ring-1 pt-2 pr-3 pb-2 pl-3 hover:ring-white/20 text-white/80 bg-white/10 ring-white/10 pointer-events-none">React</span>
              <span className="text-sm rounded-lg ring-1 pt-2 pr-3 pb-2 pl-3 hover:ring-white/20 text-white/80 bg-white/10 ring-white/10 pointer-events-none">Mastra</span>
              <span className="text-sm rounded-lg ring-1 pt-2 pr-3 pb-2 pl-3 hover:ring-white/20 text-white/80 bg-white/10 ring-white/10 pointer-events-none">Vercel AI SDK</span>
              <span className="text-sm rounded-lg ring-1 pt-2 pr-3 pb-2 pl-3 hover:ring-white/20 text-white/80 bg-white/10 ring-white/10 pointer-events-none">OpenCV</span>
              <span className="text-sm rounded-lg ring-1 pt-2 pr-3 pb-2 pl-3 hover:ring-white/20 text-white/80 bg-white/10 ring-white/10 pointer-events-none">Data Science</span>
              <span className="text-sm rounded-lg ring-1 pt-2 pr-3 pb-2 pl-3 hover:ring-white/20 text-white/80 bg-white/10 ring-white/10 pointer-events-none">Langchain</span>
              <span className="text-sm rounded-lg ring-1 pt-2 pr-3 pb-2 pl-3 hover:ring-white/20 text-white/80 bg-white/10 ring-white/10 pointer-events-none">Pytorch</span>
              <span className="text-sm rounded-lg ring-1 pt-2 pr-3 pb-2 pl-3 hover:ring-white/20 text-white/80 bg-white/10 ring-white/10 pointer-events-none">TensorFlow</span>
              <span className="text-sm rounded-lg ring-1 pt-2 pr-3 pb-2 pl-3 hover:ring-white/20 text-white/80 bg-white/10 ring-white/10 pointer-events-none">Claude Code</span>
              <span className="text-sm rounded-lg ring-1 pt-2 pr-3 pb-2 pl-3 hover:ring-white/20 text-white/80 bg-white/10 ring-white/10 pointer-events-none">Hugging Face</span>
              <span className="text-sm rounded-lg ring-1 pt-2 pr-3 pb-2 pl-3 hover:ring-white/20 text-white/80 bg-white/10 ring-white/10 pointer-events-none">MCP</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
