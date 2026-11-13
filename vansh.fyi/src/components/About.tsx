import { Award, GraduationCap, Heart, Trophy } from 'lucide-react';
import { publicImage } from '../../lib/public-images';

const LINKEDIN_URL = 'https://www.linkedin.com/in/vansh-fyi/';

const About = () => {
  return (
    <section className="pt-24 pb-24 relative" style={{ opacity: 1, transform: 'translateY(0px)' }} id="about">
      <div className="sm:px-6 lg:px-8 max-w-7xl mr-auto ml-auto pt-8 pr-4 pb-8 pl-4">
        <div className="grid lg:grid-cols-12 gap-x-8 gap-y-8 h-full items-stretch">
          <div className="fade-in-up hover:-translate-y-1 transition-[transform,translate,scale,opacity,background-color,border-color,box-shadow,color] duration-500 group lg:col-span-5 hover:from-white/12 hover:to-white/10 hover:ring-white/20 bg-black/30 ring-white/10 ring-1 rounded-xl pt-6 pr-6 pb-6 pl-6 relative backdrop-blur-lg" style={{ transform: 'none', opacity: 1 }}>
            <div className="mb-6">
              <div className="w-full h-64 md:h-80 lg:h-64 bg-gradient-to-br from-blue-500 rounded-xl overflow-hidden ring-1 mb-4 via-purple-600 to-pink-600 ring-white/10">
                <img {...publicImage('/images/about_main.webp', 768)} sizes="(min-width: 1024px) 480px, (min-width: 768px) 90vw, 100vw" alt="Vansh Portrait" className="w-full h-full object-cover" loading="lazy" decoding="async" />
              </div>
              {/* New content added below the image */}
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl leading-[1.05] font-medium tracking-tight mb-4 font-geist text-white">
              Hello! I'm Vansh.
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-white/80">
              <p className="pointer-events-none">
                I'm a Design Engineer, but I didn't start here. My journey began in Physics, into the mind boggling rabbit holes about the universe and the art of playing with math. I absolutely love what I learnt and often find myself returning back to it but back then, I felt it only did a partial job of defining me. I wanted something that allows me to express myself better. And then, I started exploring and learning different skills.
              </p>
              <p className="pointer-events-none">
                Today, I design and build web and mobile applications with the help of AI. While AI creates the raw output, I focus primarily on refining the design and system architecture to build intuitive interfaces that works on scale. My diverse interests and skills in design, AI engineering, robotics research and development allows me to contribute effectively in cross functional settings, communicating design needs and create unique solutions to solve problems. I believe a great product should be accessible, performant, meaningful and scalable.
              </p>
              <p className="pointer-events-none">
                When I'm not working, you'll find me exploring my personal passions. I'm always playing with electronics, reading research papers, getting lost in Music, planning my next big travel adventure or just plain old daydreaming. I'm just endlessly curious about how things work... and how to make them work better.
              </p>
            </div>

            <h3 className="text-md md:text-xl leading-[1.05] tracking-tight mt-8 font-geist font-light text-white/80 pointer-events-none">
              "you <span className="tracking-wide font-semibold text-white pointer-events-none">Draw</span> for yourself, you <span className="tracking-wide font-semibold text-white pointer-events-none">Design</span> for others."
            </h3>

            <div className="flex flex-wrap pt-10 pb-2 gap-x-2 gap-y-2">
              <span className="text-xs text-white/80 bg-white/10 ring-white/10 ring-1 rounded pt-1 pr-2 pb-1 pl-2 pointer-events-none">Explorer</span>
              <span className="text-xs text-white/80 bg-white/10 ring-white/10 ring-1 rounded pt-1 pr-2 pb-1 pl-2 pointer-events-none">Wanderer</span>
              <span className="text-xs text-white/80 bg-white/10 ring-white/10 ring-1 rounded pt-1 pr-2 pb-1 pl-2 pointer-events-none">Daydreamer</span>
              <span className="text-xs text-white/80 bg-white/10 ring-white/10 ring-1 rounded pt-1 pr-2 pb-1 pl-2 pointer-events-none">Creative</span>
              <span className="text-xs text-white/80 bg-white/10 ring-white/10 ring-1 rounded pt-1 pr-2 pb-1 pl-2 pointer-events-none">Artist</span>
              <span className="text-xs text-white/80 bg-white/10 ring-white/10 ring-1 rounded pt-1 pr-2 pb-1 pl-2 pointer-events-none">Nyctophile</span>
              <span className="text-xs text-white/80 bg-white/10 ring-white/10 ring-1 rounded pt-1 pr-2 pb-1 pl-2 pointer-events-none">Aphant</span>
              <span className="text-xs text-white/80 bg-white/10 ring-white/10 ring-1 rounded pt-1 pr-2 pb-1 pl-2 pointer-events-none">Polymath</span>
              <span className="text-xs text-white/80 bg-white/10 ring-white/10 ring-1 rounded pt-1 pr-2 pb-1 pl-2 pointer-events-none">Systems Thinker</span>
            </div>
          </div>
          <div className="lg:col-span-7 h-full flex flex-col">
            <div className="grid md:grid-cols-2 gap-6 gap-x-6 gap-y-6">
              {/* Education */}
              <div className="transition-[transform,translate,scale,opacity,background-color,border-color,box-shadow,color] duration-500 hover:-translate-y-2 bg-black/30 ring-1 rounded-xl pt-6 pr-6 pb-6 pl-6 backdrop-blur-lg hover:from-white/12 hover:to-white/6 hover:ring-white/20 from-white/8 to-white/4 ring-white/10">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="flex items-center gap-2 text-base font-medium text-white font-geist pointer-events-none">
                    <GraduationCap className="w-4 h-4 text-white/80" strokeWidth={1.5} aria-hidden="true" />
                    Education
                  </h3>
                  <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="See all education on LinkedIn"
                    className="inline-flex items-center gap-1 text-xs font-medium text-white/50 hover:text-white transition-colors font-geist flex-shrink-0 underline"
                  >
                    See all
                  </a>
                </div>
                <div className="space-y-2">
                  <div className="">
                    <p className="text-xs font-medium text-white/80 pointer-events-none">Batchelor of Science (Honors), Physics</p>
                    <p className="text-xs text-white/50 pointer-events-none">University of Delhi • 2019</p>
                  </div>
                  <div className="">
                    <p className="text-xs font-medium text-white/80 pointer-events-none">Master of Design, User Experience Design</p>
                    <p className="text-xs text-white/50 pointer-events-none">DIT University • 2020</p>
                  </div>
                  <div className="">
                    <p className="text-xs font-medium text-white/80 pointer-events-none">Post Graduate Program in Artificial Intelligence and Machine Learning</p>
                    <p className="text-xs text-white/50 pointer-events-none">Caltech CTME • 2025</p>
                  </div>
                </div>
              </div>
              {/* Interests */}
              <div className="transition-[transform,translate,scale,opacity,background-color,border-color,box-shadow,color] hover:-translate-y-2 duration-500 bg-black/30 ring-1 rounded-2xl pt-6 pr-6 pb-6 pl-6 backdrop-blur-lg hover:from-white/12 hover:to-white/6 hover:ring-white/20 from-white/8 to-white/4 ring-white/10">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="flex items-center gap-2 text-base font-medium font-geist text-white pointer-events-none">
                    <Award className="w-4 h-4 text-white/80" strokeWidth={1.5} aria-hidden="true" />
                    Certifications
                  </h3>
                  <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="See all certifications on LinkedIn"
                    className="inline-flex items-center gap-1 text-xs font-medium text-white/50 hover:text-white transition-colors font-geist flex-shrink-0 underline"
                  >
                    See all
                  </a>
                </div>
                <div className="space-y-2">
                  <div className="">
                    <p className="text-xs font-medium text-white/80 pointer-events-none">Python for Data Science</p>
                    <p className="text-xs text-white/50 pointer-events-none">IBM • 2025</p>
                  </div>
                  <div className="">
                    <p className="text-xs font-medium text-white/80 pointer-events-none">CS50's Introduction to Computer Science</p>
                    <p className="text-xs text-white/50 pointer-events-none">HarvardX • 2025</p>
                  </div>
                  <div className="">
                    <p className="text-xs font-medium text-white/80 pointer-events-none">Brand Management: Aligning Business, Brand and Behavior</p>
                    <p className="text-xs text-white/50 pointer-events-none">London Business School • 2025</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 mt-6 gap-x-6 gap-y-6">
              {/* Certifications */}
              <div className="transition-[transform,translate,scale,opacity,background-color,border-color,box-shadow,color] hover:-translate-y-2 duration-500 bg-black/30 ring-1 rounded-xl pt-6 pr-6 pb-6 pl-6 backdrop-blur-lg hover:from-white/12 hover:to-white/6 hover:ring-white/20 from-white/8 to-white/4 ring-white/10">
                <h3 className="flex items-center gap-2 text-base font-medium font-geist text-white mb-3">
                  {' '}
                  <Trophy className="w-4 h-4 text-white/80" strokeWidth={1.5} aria-hidden="true" />{' '}
                  Recognitions
                </h3>
                <div className="flex flex-wrap gap-x-2 gap-y-2">
                  <span className="text-xs ring-1 rounded pt-1 pr-2 pb-1 pl-2 text-white/80 bg-white/10 ring-white/10 pointer-events-none">Winner-BrandX</span>
                  <span className="text-xs ring-1 rounded pt-1 pr-2 pb-1 pl-2 text-white/80 bg-white/10 ring-white/10 pointer-events-none">DST-INSPIRE Scholar</span>
                  <span className="text-xs rounded ring-1 pt-1 pr-2 pb-1 pl-2 text-white/80 bg-white/10 ring-white/10 pointer-events-none">Runner-Up VibeX Designathon</span>
                  <span className="text-xs ring-1 rounded pt-1 pr-2 pb-1 pl-2 text-white/80 bg-white/10 ring-white/10 pointer-events-none">Runner-Up Code-Red 4.0 Design-a-thon</span>
                </div>
              </div>
              {/* Achievements */}
              <div className="transition-[transform,translate,scale,opacity,background-color,border-color,box-shadow,color] hover:-translate-y-2 duration-500 hover:from-white/12 hover:to-white/6 hover:ring-white/20 bg-black/30 ring-white/10 ring-1 rounded-2xl pt-6 pr-6 pb-6 pl-6 backdrop-blur-lg">
                <h3 className="flex items-center gap-2 text-base font-medium font-geist text-white mb-3 pointer-events-none">
                  <Heart className="w-[16px] h-[16px] text-white/80" strokeWidth={1.5} aria-hidden="true" />
                  Interests
                </h3>
                <div className="flex flex-wrap gap-x-2 gap-y-2">
                  <span className="text-xs ring-1 rounded pt-1 pr-2 pb-1 pl-2 text-white/80 bg-white/10 ring-white/10 pointer-events-none">Artificial Intelligence</span>
                  <span className="text-xs rounded ring-1 pt-1 pr-2 pb-1 pl-2 text-white/80 bg-white/10 ring-white/10 pointer-events-none">Robotics</span>
                  <span className="text-xs rounded ring-1 pt-1 pr-2 pb-1 pl-2 text-white/80 bg-white/10 ring-white/10 pointer-events-none">Human Robot Interaction</span>
                  <span className="text-xs ring-1 rounded pt-1 pr-2 pb-1 pl-2 text-white/80 bg-white/10 ring-white/10 pointer-events-none">HCI</span>
                  <span className="text-xs ring-1 rounded pt-1 pr-2 pb-1 pl-2 text-white/80 bg-white/10 ring-white/10 pointer-events-none">Research</span>
                  <span className="text-xs ring-1 rounded pt-1 pr-2 pb-1 pl-2 text-white/80 bg-white/10 ring-white/10 pointer-events-none">Art</span>
                  <span className="text-xs ring-1 rounded pt-1 pr-2 pb-1 pl-2 text-white/80 bg-white/10 ring-white/10 pointer-events-none">Reading</span>
                  <span className="text-xs rounded ring-1 pt-1 pr-2 pb-1 pl-2 text-white/80 bg-white/10 ring-white/10 pointer-events-none">Travel</span>
                  <span className="text-xs rounded ring-1 pt-1 pr-2 pb-1 pl-2 text-white/80 bg-white/10 ring-white/10 pointer-events-none">Stargazing</span>
                </div>
              </div>
            </div>
            <div className="transition-[transform,translate,scale,opacity,background-color,border-color,box-shadow,color] hover:-translate-y-1 duration-500 grid md:grid-cols-1 flex-grow pt-6 gap-x-6 gap-y-6">
              <img {...publicImage('/images/about_theme.webp', 1024)} sizes="(min-width: 1024px) 700px, (min-width: 768px) 90vw, 100vw" alt="Vansh Grover" className="w-full h-full object-cover rounded-xl" loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;