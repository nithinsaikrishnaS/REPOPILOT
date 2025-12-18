import React, { useState } from 'react';
import { Folder, Github, Upload, CheckCircle, AlertCircle, Loader, ArrowRight, CornerDownRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { selectFolder, checkStatus, pushProject } from '../services/api';
import logo from '../assets/logo.png';

const Dashboard = ({ onBack }) => {
    const [projectPath, setProjectPath] = useState(null);
    const [repoUrl, setRepoUrl] = useState('');
    const [status, setStatus] = useState('idle'); // idle, checking, pushing, success, error
    const [message, setMessage] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [manualPath, setManualPath] = useState('');
    const [githubToken, setGithubToken] = useState('');
    const [logs, setLogs] = useState([]);

    const addLog = (msg) => setLogs(prev => [...prev, `> ${msg}`]);

    const handleSelectFolder = async () => {
        try {
            const result = await selectFolder();
            if (result && result.path) {
                setProjectPath(result.path);
                setManualPath(result.path);
                addLog(`Selected folder: ${result.path}`);
                checkProjectStatus(result.path);
            }
        } catch (err) {
            console.error(err);
            addLog('Error selecting folder');
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const folderName = files[0].name;
            addLog(`Dropped folder: ${folderName}. Please confirm the full path below.`);
            setMessage(`Dropped folder detected. Please ensure the full path is correct below.`);
            setStatus('idle');
        }
    };

    const handleManualPathSubmit = (e) => {
        e.preventDefault();
        if (manualPath) {
            setProjectPath(manualPath);
            addLog(`Manual path set: ${manualPath}`);
            checkProjectStatus(manualPath);
        }
    };

    const checkProjectStatus = async (path) => {
        setStatus('checking');
        try {
            const info = await checkStatus(path);
            addLog(`Git status: ${info.isRepo ? 'Initialized' : 'Not initialized'}`);
            setStatus('idle');
            if (info.hasRemote) {
                addLog(`Remote found: ${info.remotes[0].refs.push}`);
                setRepoUrl(info.remotes[0].refs.push);
            }
        } catch (err) {
            addLog(`Error checking status: ${err.message}`);
            setStatus('idle');
        }
    };

    const handlePush = async () => {
        if (!projectPath || !repoUrl) {
            setMessage('Please select a folder and enter a GitHub repo URL.');
            setStatus('error');
            return;
        }

        setStatus('pushing');
        setMessage('');
        addLog('Starting push sequence...');

        try {
            const res = await pushProject(projectPath, repoUrl, githubToken);
            if (res.success) {
                setStatus('success');
                setMessage('Project successfully pushed to GitHub.');
                addLog('Push complete!');
            } else {
                throw new Error('Unknown error during push');
            }
        } catch (err) {
            setStatus('error');
            setMessage(err.response?.data?.error || err.message);
            addLog(`Error: ${err.message}`);
        }
    };

    return (
        <div className="flex h-screen bg-neutral-50 text-neutral-900 font-sans relative">
            {/* Floating Back Button (Glass Style) */}
            <motion.button
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={onBack}
                className="fixed top-6 right-6 z-50 px-5 py-3 bg-white border border-neutral-200 rounded-xl shadow-lg text-neutral-900 font-medium text-sm transition-all duration-300 hover:bg-neutral-50 flex items-center gap-2 group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Home
            </motion.button>

            {/* Sidebar */}
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col hidden md:flex">
                <div className="p-6 border-b border-neutral-100">
                    <div className="flex items-center gap-3 font-bold text-lg tracking-tight">
                        <img src={logo} alt="Repopilot" className="w-8 h-8 object-contain" /> Repopilot
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <div className="px-3 py-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Workspace</div>
                    <button className="flex items-center gap-3 w-full px-3 py-2 bg-neutral-100 rounded-lg text-sm font-medium text-black">
                        <Folder className="w-4 h-4" /> New Project
                    </button>
                    <button className="flex items-center gap-3 w-full px-3 py-2 hover:bg-neutral-50 rounded-lg text-sm font-medium text-neutral-600 transition-colors">
                        <Github className="w-4 h-4" /> Connected Repos
                    </button>
                </nav>

                <div className="p-4 border-t border-neutral-100">
                    <div className="flex items-center gap-2 text-xs text-neutral-400">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div> System Operational
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-5xl mx-auto p-12">
                    <header className="mb-12">
                        <h2 className="text-3xl font-bold tracking-tight mb-2">Deploy Project</h2>
                        <p className="text-neutral-500">Configure your local environment and push to remote.</p>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Left Column: Form */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Step 1 */}
                            <div className="bg-white rounded-xl border border-neutral-200 p-8 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <label className="text-sm font-bold text-neutral-900 uppercase tracking-wide">01. Source Code</label>
                                    {projectPath && <CheckCircle className="w-4 h-4 text-neutral-900" />}
                                </div>

                                <div
                                    onClick={handleSelectFolder}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    className={`cursor-pointer group relative overflow-hidden rounded-lg border-2 border-dashed transition-all p-8 text-center mb-6
                    ${isDragging ? 'border-neutral-900 bg-neutral-100' : projectPath ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50'}`}
                                >
                                    <div className="flex flex-col items-center gap-4 relative z-10">
                                        <div className={`p-4 rounded-full ${projectPath ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-400 group-hover:bg-neutral-200 transition-colors'}`}>
                                            <Folder className="w-6 h-6" />
                                        </div>
                                        <div>
                                            {projectPath ? (
                                                <div className="font-mono text-sm font-medium">{projectPath}</div>
                                            ) : (
                                                <>
                                                    <div className="font-medium text-neutral-900">Select or Drag Project Folder</div>
                                                    <div className="text-xs text-neutral-400 mt-1">Click to open system dialog or drag folder here</div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-semibold text-neutral-500 uppercase">Or enter full path manually</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={manualPath}
                                            onChange={(e) => setManualPath(e.target.value)}
                                            placeholder="/Users/username/projects/my-app"
                                            className="flex-1 bg-neutral-50 border border-neutral-200 rounded-lg py-2.5 px-4 text-sm font-mono focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all"
                                        />
                                        <button
                                            onClick={handleManualPathSubmit}
                                            className="px-6 py-2.5 bg-neutral-900 text-white rounded-lg text-xs font-bold uppercase hover:bg-neutral-800 transition-all shadow-sm"
                                        >
                                            Validate
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-neutral-400 italic">Security Note: Browsers cannot get full paths from drags. Please paste the path if dragging fails.</p>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="bg-white rounded-xl border border-neutral-200 p-8 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <label className="text-sm font-bold text-neutral-900 uppercase tracking-wide">02. Destination</label>
                                    {repoUrl && <CheckCircle className="w-4 h-4 text-neutral-900" />}
                                </div>

                                <div className="relative">
                                    <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                    <input
                                        type="text"
                                        value={repoUrl}
                                        onChange={(e) => setRepoUrl(e.target.value)}
                                        placeholder="https://github.com/username/repository.git"
                                        className="w-full bg-neutral-50 border border-neutral-200 rounded-lg py-4 pl-12 pr-4 text-neutral-900 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all placeholder:text-neutral-400 font-mono text-sm"
                                    />
                                </div>

                                <div className="mt-6 space-y-3">
                                    <label className="text-xs font-semibold text-neutral-500 uppercase">Personal Access Token (Required for Private Repos / Auth)</label>
                                    <input
                                        type="password"
                                        value={githubToken}
                                        onChange={(e) => setGithubToken(e.target.value)}
                                        placeholder="ghp_xxxxxxxxxxxx"
                                        className="w-full bg-neutral-50 border border-neutral-200 rounded-lg py-3 px-4 text-sm font-mono focus:outline-none focus:border-neutral-900"
                                    />
                                    <p className="text-[10px] text-neutral-400">
                                        You can generate a token in <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="underline text-neutral-600">GitHub Settings</a>.
                                    </p>
                                </div>
                            </div>

                            {/* Action */}
                            <button
                                onClick={handlePush}
                                disabled={status === 'pushing'}
                                className={`w-full py-4 rounded-lg font-bold text-sm tracking-wide uppercase transition-all flex items-center justify-center gap-3
                  ${status === 'pushing' ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed' :
                                        status === 'success' ? 'bg-neutral-900 text-white hover:bg-neutral-800' :
                                            'bg-neutral-900 text-white hover:bg-neutral-800 shadow-lg shadow-neutral-200'}`}
                            >
                                {status === 'pushing' ? (
                                    <><Loader className="w-4 h-4 animate-spin" /> Processing...</>
                                ) : status === 'success' ? (
                                    <><CheckCircle className="w-4 h-4" /> Deployment Successful</>
                                ) : (
                                    <><Upload className="w-4 h-4" /> Push to Master</>
                                )}
                            </button>

                            {/* Messages */}
                            <AnimatePresence>
                                {message && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className={`p-4 rounded-lg border flex items-start gap-3 ${status === 'error' ? 'bg-white border-neutral-200 text-neutral-900' :
                                            'bg-neutral-900 text-white border-neutral-900'
                                            }`}
                                    >
                                        {status === 'error' ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle className="w-5 h-5 shrink-0" />}
                                        <div className="text-sm font-medium">{message}</div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                        </div>

                        {/* Right Column: Logs */}
                        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm flex flex-col h-full max-h-[600px] overflow-hidden">
                            <div className="p-4 border-b border-neutral-100 bg-neutral-50 flex items-center justify-between">
                                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wide">System Output</span>
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 rounded-full border border-neutral-300"></div>
                                    <div className="w-2 h-2 rounded-full border border-neutral-300"></div>
                                </div>
                            </div>
                            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-3 bg-white text-neutral-600">
                                {logs.length === 0 && (
                                    <div className="flex flex-col items-center justify-center h-full text-neutral-300 gap-2">
                                        <CornerDownRight className="w-5 h-5" />
                                        <span>Waiting for input...</span>
                                    </div>
                                )}
                                {logs.map((log, i) => (
                                    <div key={i} className="flex gap-2">
                                        <span className="text-neutral-300 select-none">sw$</span>
                                        <span className="break-all">{log.replace('> ', '')}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
