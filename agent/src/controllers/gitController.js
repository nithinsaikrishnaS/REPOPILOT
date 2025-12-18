const simpleGit = require('simple-git');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Helper to run osascript for folder selection (Mac only)
const pickFolder = () => {
    return new Promise((resolve, reject) => {
        const command = `osascript -e 'POSIX path of (choose folder with prompt "Select Project Folder")'`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                const errorStr = stderr.toLowerCase() || error.message.toLowerCase();
                // User cancelled or error
                if (errorStr.includes('user cancel')) {
                    console.log('User cancelled folder selection dialog');
                    resolve(null);
                } else {
                    console.error('osascript error detailed:', { error, stdout, stderr });
                    reject(new Error(`Failed to pick folder: ${stderr || error.message}`));
                }
            } else {
                resolve(stdout.trim());
            }
        });
    });
};

const gitController = {
    // Select Folder
    selectFolder: async (req, res) => {
        try {
            const folderPath = await pickFolder();
            if (!folderPath) {
                return res.status(400).json({ error: 'No folder selected' });
            }
            res.json({ path: folderPath });
        } catch (error) {
            console.error('Pick folder error:', error);
            res.status(500).json({ error: 'Failed to pick folder' });
        }
    },

    // Check Repo Status (Is it initialized? Remote?)
    checkStatus: async (req, res) => {
        const { folder } = req.body;
        if (!folder || !fs.existsSync(folder)) {
            return res.status(400).json({ error: 'Invalid folder path' });
        }

        const git = simpleGit(folder);
        try {
            // Check specifically for local .git folder to avoid parent interference
            const localGitPath = path.join(folder, '.git');
            const isLocalRepo = fs.existsSync(localGitPath) && fs.lstatSync(localGitPath).isDirectory();

            let hasRemote = false;
            let remotes = [];

            if (isLocalRepo) {
                remotes = await git.getRemotes(true);
                hasRemote = remotes.length > 0;
            }

            res.json({
                isRepo: isLocalRepo,
                hasRemote,
                remotes
            });
        } catch (error) {
            console.error('Check status error:', error);
            res.status(500).json({ error: 'Failed to check status' });
        }
    },

    // Initialize & Push
    // This is the "One-Click Push" logic
    pushProject: async (req, res) => {
        const { folder, repoUrl, token } = req.body;

        if (!folder || !fs.existsSync(folder)) {
            return res.status(400).json({ error: 'Folder does not exist' });
        }
        if (!repoUrl) {
            return res.status(400).json({ error: 'Missing repo URL' });
        }

        let formattedRepoUrl = repoUrl;
        if (token) {
            console.log('Token provided, formatting URL...');
            try {
                const url = new URL(repoUrl);
                if (url.protocol === 'https:') {
                    // Use encodeURIComponent to handle special characters in tokens (@, :, etc)
                    // Note: GitHub tokens are usually just the username part of the auth.
                    // If the user provided a full ghp_ token, it works as the username.
                    const safeToken = encodeURIComponent(token);
                    formattedRepoUrl = `https://${safeToken}@${url.host}${url.pathname}${url.search}${url.hash}`;
                    console.log(`Formatted URL constructed (token masked length: ${token.length})`);
                }
            } catch (e) {
                console.error('Invalid repo URL for token embedding:', repoUrl, e);
            }
        }

        const git = simpleGit(folder, {
            env: { ...process.env, GIT_TERMINAL_PROMPT: '0' }
        });

        try {
            console.log(`Push sequence started for: ${folder}`);

            // 0. Ensure .gitignore exists to prevent hanging on large folders (.venv, node_modules)
            const gitignorePath = path.join(folder, '.gitignore');
            if (!fs.existsSync(gitignorePath)) {
                console.log('No .gitignore found. Creating a default one to skip heavy folders...');
                const defaultIgnore = `node_modules/
.venv/
venv/
env/
__pycache__/
*.pyc
.DS_Store
.idea/
.vscode/
dist/
build/
`;
                fs.writeFileSync(gitignorePath, defaultIgnore);
                console.log('.gitignore created');
            }

            // 1. Init if needed - check specifically for local .git folder
            const localGitPath = path.join(folder, '.git');
            const isLocalRepo = fs.existsSync(localGitPath) && fs.lstatSync(localGitPath).isDirectory();

            if (!isLocalRepo) {
                console.log('Target folder is not a local git repo (ignoring parents). Initializing...');
                await git.init();
                console.log('Initialized git repo successfully');
            } else {
                console.log('Existing local git repo detected');
            }

            // 2. Add all files
            console.log('Adding files to staging...');
            await git.add('.');
            console.log('Files added');

            // 3. Commit
            // Check if there are changes first
            console.log('Checking git status...');
            const status = await git.status();
            console.log(`Git status count: ${status.files.length} files changed`);

            if (status.files.length > 0) {
                console.log(`Committing ${status.files.length} changed files...`);
                await git.commit('Initial repository setup by Repopilot');
                console.log('Committed files successfully');
            } else {
                console.log('No changes to commit (clean working directory)');
            }

            // 4. Remote
            console.log(`Configuring remote origin: ${formattedRepoUrl}`);
            const remotes = await git.getRemotes(true);
            const origin = remotes.find(r => r.name === 'origin');

            if (!origin) {
                await git.addRemote('origin', formattedRepoUrl);
                console.log('Added remote origin');
            } else {
                const pushUrl = origin.refs.push;
                if (pushUrl !== formattedRepoUrl) {
                    console.log(`Remote origin mismatch. Current: ${pushUrl.replace(token, 'TOKEN_MASKED')}, Target: ${formattedRepoUrl.replace(token, 'TOKEN_MASKED')}`);
                    await git.removeRemote('origin');
                    await git.addRemote('origin', formattedRepoUrl);
                    console.log('Updated remote origin URL with new token/address');
                } else {
                    console.log('Remote origin already matches target URL');
                }
            }

            // 5. Push
            // Handle branch name (main vs master) - simple-git usually defaults to master unless changed.
            // Let's force rename to main for modern GitHub
            console.log('Renaming branch to main...');
            await git.branch(['-M', 'main']);

            // Push
            console.log('Attempting to push to GitHub (main)...');
            await git.push(['-u', 'origin', 'main']);
            console.log('Push completed successfully!');

            res.json({ success: true, message: 'Project pushed successfully!' });

        } catch (error) {
            console.error('Push operation failed:', error);
            res.status(500).json({
                error: error.message || 'Deployment failed',
                details: error,
                logs: 'Check server terminal for full trace'
            });
        }
    }
};

module.exports = gitController;
