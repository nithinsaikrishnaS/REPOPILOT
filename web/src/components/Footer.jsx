import React from 'react';
import { Github, Twitter, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="border-t border-neutral-200 bg-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">

                {/* Brand */}
                <div className="text-center md:text-left">
                    <div className="font-bold text-lg mb-2">Repopilot</div>
                    <p className="text-neutral-500 text-sm">
                        Git automation for the modern developer.
                    </p>
                </div>

                {/* Links */}
                <div className="flex gap-6">
                    <a href="https://github.com" target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-black transition-colors">
                        <Github className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-neutral-400 hover:text-black transition-colors">
                        <Twitter className="w-5 h-5" />
                    </a>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-neutral-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-400">
                <div>&copy; {new Date().getFullYear()} Repopilot. All rights reserved.</div>
                <div className="flex items-center gap-1">
                    Made with <Heart className="w-3 h-3 fill-current text-red-500" /> by Developers
                </div>
            </div>
        </footer>
    );
};

export default Footer;
