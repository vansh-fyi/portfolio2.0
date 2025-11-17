import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Projects from './components/Projects';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
function App() {
    useEffect(() => {
        if (!window.UnicornStudio) {
            window.UnicornStudio = { init: () => { }, isInitialized: true };
            const i = document.createElement("script");
            i.src = "https://cdn.jsdelivr.net/gh/hunicornstudio/unicornstudio.js@1.4.29/dist/UnicornStudio.umd.js";
            onload = function () {
                if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
                    window.UnicornStudio.init();
                    window.UnicornStudio.isInitialized = true;
                }
            };
            (document.head || document.body).appendChild(i);
        }
        else if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
            window.UnicornStudio.init();
            window.UnicornStudio.isInitialized = true;
        }
    }, []);
    return (_jsxs("div", { className: "min-h-screen bg-black text-white", children: [_jsxs("div", { className: "aura-background-component fixed -z-10 w-full h-screen top-0", children: [_jsx("div", { id: "darkBackground", "data-us-project": "krvLRHX3sj3CqBBHyMDj", "data-us-lazyload": "true", "data-us-production": "true", "data-us-scale": "1.0", "data-us-dpi": "1.0", "data-us-fps": "30", className: "absolute top-0 left-0 -z-10 w-full h-full transition-opacity duration-500 opacity-0" }), _jsx("div", { id: "lightBackground", "data-us-project": "VACzULFkoQAmEcep6hU", "data-us-lazyload": "true", "data-us-production": "true", "data-us-scale": "0.5", "data-us-dpi": "1.0", "data-us-fps": "30", className: "absolute top-0 left-0 -z-10 w-full h-full transition-opacity duration-500 opacity-0" })] }), _jsx(Header, {}), _jsx(Hero, {}), _jsx(Skills, {}), _jsx(Projects, {}), _jsx(About, {}), _jsx(Testimonials, {}), _jsx(Contact, {}), _jsx(Footer, {})] }));
}
export default App;
