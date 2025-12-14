import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Book, Command, AlertCircle, CheckCircle } from 'lucide-react';
import logo from '../assets/logo.png';
import Footer from './Footer';

const Documentation = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900 selection:bg-black selection:text-white flex flex-col">
            {/* Navbar */}
            {/* Navbar */}
            <nav className="sticky top-0 z-50 w-full bg-white border-b border-neutral-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-900"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="text-lg font-bold flex items-center gap-3 text-neutral-900">
                            <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
                            Documentation
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-3xl mx-auto p-8 py-16 space-y-16">

                {/* Intro */}
                <section>
                    <h1 className="text-4xl font-black mb-6 tracking-tight">Getting Started with Repopilot</h1>
                    <p className="text-xl text-neutral-500 leading-relaxed">
                        Repopilot bridges the gap between your local file system and GitHub, allowing you to deploy projects without writing a single terminal command.
                    </p>
                </section>

                {/* Prerequisites */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-neutral-900 text-white rounded-lg">
                            <Command className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl font-bold">Prerequisites</h2>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="mt-1">
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-neutral-100 text-xs font-bold">1</div>
                            </div>
                            <div>
                                <h3 className="font-bold">Git Installed</h3>
                                <p className="text-neutral-500 text-sm mt-1">Make sure Git is installed on your machine. Type <code>git --version</code> in your terminal to check.</p>
                            </div>
                        </div>
                        <div className="w-full h-px bg-neutral-100"></div>
                        <div className="flex items-start gap-4">
                            <div className="mt-1">
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-neutral-100 text-xs font-bold">2</div>
                            </div>
                            <div>
                                <h3 className="font-bold">GitHub Account</h3>
                                <p className="text-neutral-500 text-sm mt-1">You need an active GitHub account and a repository URL where you want to push your code.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How it Works */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-neutral-900 text-white rounded-lg">
                            <Book className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl font-bold">How to Use</h2>
                    </div>

                    <div className="grid gap-6">
                        <StepCard
                            num="01"
                            title="Launch the Agent"
                            desc="Repopilot runs a local agent to handle secure file operations. Ensure the terminal window is open and running."
                        />
                        <StepCard
                            num="02"
                            title="Select your Project"
                            desc="Click the folder icon to open the native system dialog. Choose the root folder of your project."
                        />
                        <StepCard
                            num="03"
                            title="Connect Remote"
                            desc="Paste your GitHub repository HTTPS URL (e.g., https://github.com/user/repo.git)."
                        />
                        <StepCard
                            num="04"
                            title="Push to Master"
                            desc="Click the push button. Repopilot will handle 'git init', 'add', 'commit', and 'push' automatically."
                        />
                    </div>
                </section>

                {/* Troubleshooting */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-neutral-900 text-white rounded-lg">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl font-bold">Troubleshooting</h2>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
                        <h3 className="font-bold mb-2">Agent Connection Failed?</h3>
                        <p className="text-neutral-500 text-sm mb-4">If you see a connection error, it means the web app cannot talk to the local backend.</p>
                        <div className="bg-neutral-100 p-4 rounded-lg font-mono text-xs text-neutral-600">
                            1. Check if the terminal running ./start.sh is still open.<br />
                            2. Ensure port 3001 is not blocked by another application.<br />
                            3. Restart the application using the start script.
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    );
};

const StepCard = ({ num, title, desc }) => (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-white border border-neutral-100 hover:border-neutral-300 transition-colors">
        <div className="text-2xl font-black text-neutral-200">{num}</div>
        <div>
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="text-neutral-500 leading-relaxed text-sm mt-1">{desc}</p>
        </div>
    </div>
);

export default Documentation;
