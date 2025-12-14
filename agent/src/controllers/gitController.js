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
                // User cancelled or error
                if (stderr.includes('User canceled')) {
                    resolve(null);
                } else {
                    reject(error);
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
            const isRepo = await git.checkIsRepo();
            let hasRemote = false;
            let remotes = [];

            if (isRepo) {
                remotes = await git.getRemotes(true);
                hasRemote = remotes.length > 0;
            }

            res.json({
                isRepo,
                hasRemote,
                remotes
            });
        } catch (error) {
            console.error('Status check error:', error);
            res.status(500).json({ error: error.message });
        }
    },

    // Initialize & Push
    // This is the "One-Click Push" logic
    pushProject: async (req, res) => {
        const { folder, repoUrl, token } = req.body; // Token might be needed for https auth if not using SSH key, or user can assume SSH setup

        if (!folder || !repoUrl) {
            return res.status(400).json({ error: 'Missing folder or repo URL' });
        }

        const git = simpleGit(folder);

        try {
            // 1. Init if needed
            const isRepo = await git.checkIsRepo();
            if (!isRepo) {
                await git.init();
                console.log('Initialized git repo');
            }

            // 2. Add all files
            await git.add('.');

            // 3. Commit
            // Check if there are changes first
            const status = await git.status();
            if (status.files.length > 0) {
                await git.commit('Initial repository setup by Repopilot');
                console.log('Committed files');
            } else {
                console.log('No changes to commit');
            }

            // 4. Remote
            const remotes = await git.getRemotes(true);
            const origin = remotes.find(r => r.name === 'origin');

            if (!origin) {
                await git.addRemote('origin', repoUrl);
            } else if (origin.refs.push !== repoUrl) {
                // If origin exists but differs, update it? Or throw error?
                // For MVP, simplified: update URL
                await git.removeRemote('origin');
                await git.addRemote('origin', repoUrl);
            }

            // 5. Push
            // Handle branch name (main vs master) - simple-git usually defaults to master unless changed.
            // Let's force rename to main for modern GitHub
            await git.branch(['-M', 'main']);

            // Push
            await git.push(['-u', 'origin', 'main']);

            res.json({ success: true, message: 'Project pushed successfully!' });

        } catch (error) {
            console.error('Push error:', error);
            res.status(500).json({ error: error.message, details: error });
        }
    }
};

module.exports = gitController;
