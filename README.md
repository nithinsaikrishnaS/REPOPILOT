# 🚀 Repopilot

**Repopilot** is a modern, developer-friendly tool that bridges the gap between your local file system and GitHub. It provides a beautiful, "glassmorphism" UI to manage your git repositories, replacing complex command-line workflows with a single click.

## ✨ Features

- **🔥 One-Click Deployment**: Initialize, commit, and push projects without touching the terminal.
- **📂 Smart Folder Scanning**: Automatically detects git status (Repo? Remote? Changes?).
- **🎨 Premium UI**: Built with React & Tailwind CSS, featuring deep dark mode and fluid animations.
- **⚡️ Local Agent**: A secure Node.js backend running locally on your machine to handle system operations.
- **📝 Internal Documentation**: Built-in guides and troubleshooting.

## 🛠 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, Simple-Git
- **Tools**: Lucide Icons, Axios

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Git installed on your system

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/repopilot.git
    cd repopilot
    ```

2.  Run the automated start script:
    ```bash
    ./start.sh
    ```

    This script will:
    - Install dependencies for both `web` and `agent` (if missing).
    - Start the Node.js backend on port `3001`.
    - Start the Vite frontend on port `5173`.
    - Automatically open the app in your browser.

## 📖 Usage

1.  **Select a Folder**: Click the "Select Project Folder" card. Repopilot will open your native system dialog.
2.  **Enter Repo URL**: Paste the GitHub HTTPS URL where you want to push the code.
3.  **Deploy**: Click "Push to Master". Repopilot handles the rest!

## 📄 License

MIT
