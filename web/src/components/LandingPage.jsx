import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Github, Zap, Shield } from 'lucide-react';
import logo from '../assets/logo.png';
import Footer from './Footer';

// ... (imports remain)

const LandingPage = ({ onGetStarted, onOpenDocs }) => {
    return (
        <div className="min-h-screen bg-white text-neutral-900 overflow-hidden relative selection:bg-black selection:text-white flex flex-col">
            {/* Navbar */}
            {/* Navbar */}
            <nav className="sticky top-0 z-50 w-full bg-white border-b border-neutral-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <div className="text-xl font-bold tracking-tight flex items-center gap-3 text-neutral-900">
                        <img src={logo} alt="Repopilot Logo" className="w-8 h-8 object-contain" />
                        Repopilot
                    </div>
                    <div className="flex gap-3">
                        <NavBox onClick={onOpenDocs} darkText>Documentation</NavBox>
                        <NavBox href="https://github.com" external darkText>GitHub</NavBox>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <main className="flex-1 flex flex-col items-center justify-center pt-32 px-4 text-center">
                {/* ... (Hero content remains same) ... */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-block px-3 py-1 mb-6 text-xs font-semibold tracking-wider uppercase border border-neutral-200 rounded-full text-neutral-500"
                    >
                        v1.0 Public Beta
                    </motion.div>
                    <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9]">
                        Git Automation.
                        <br />
                        <span className="text-neutral-400">Simplified.</span>
                    </h1>
                    <p className="text-xl text-neutral-500 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                        Push local projects to GitHub without the command line.
                        Minimal interface, maximum efficiency.
                    </p>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        onClick={onGetStarted}
                        className="group px-8 py-4 bg-black text-white font-medium rounded-lg text-lg hover:bg-neutral-800 transition-all flex items-center gap-2 mx-auto shadow-xl hover:shadow-2xl"
                    >
                        Start Deployment
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                </motion.div>

                {/* Feature Grid */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.2
                            }
                        }
                    }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto mt-40 px-6 pb-32"
                >
                    <FeatureCard
                        icon={<Zap className="w-6 h-6" />}
                        title="Instant Push"
                        desc="Select folder, paste URL, deployed. Zero config."
                    />
                    <FeatureCard
                        icon={<Shield className="w-6 h-6" />}
                        title="Secure Defaults"
                        desc="Auto-detection of sensitive files before commit."
                    />
                    <FeatureCard
                        icon={<Github className="w-6 h-6" />}
                        title="GitHub Native"
                        desc="Designed specifically for modern GitHub workflows."
                    />
                </motion.div>
            </main >
            <Footer />
        </div >
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
        }}
        whileHover={{ y: -5 }}
        className="text-left group"
    >
        <div className="mb-4 p-3 bg-neutral-50 rounded-lg w-fit text-neutral-900 group-hover:bg-black group-hover:text-white transition-colors duration-300 shadow-sm group-hover:shadow-md">
            {icon}
        </div>
        <h3 className="text-lg font-bold mb-2 text-neutral-900">{title}</h3>
        <p className="text-neutral-500 leading-relaxed text-sm">{desc}</p>
    </motion.div>
);

const NavBox = ({ children, onClick, href, external, darkText }) => {
    const content = (
        <span className="relative z-10 font-medium text-sm">{children}</span>
    );

    const textColor = darkText ? "text-neutral-600 hover:text-black" : "text-white/80 hover:text-white";
    const bgHover = darkText ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.2)";
    const bgTap = darkText ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)";

    const boxStyles = `relative px-4 py-2 rounded-lg ${textColor} transition-colors group overflow-hidden`;
    const bgAnimation = (
        <motion.div
            className={`absolute inset-0 rounded-lg ${darkText ? '' : 'bg-white/10 border border-white/10'}`}
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1, backgroundColor: bgHover }}
            whileTap={{ opacity: 1, scale: 0.95, backgroundColor: bgTap }}
            transition={{ duration: 0.2 }}
        />
    );

    if (href) {
        return (
            <a href={href} target={external ? "_blank" : undefined} rel="noreferrer" className={boxStyles}>
                {bgAnimation}
                {content}
            </a>
        );
    }

    return (
        <button onClick={onClick} className={boxStyles}>
            {bgAnimation}
            {content}
        </button>
    );
};

export default LandingPage;
