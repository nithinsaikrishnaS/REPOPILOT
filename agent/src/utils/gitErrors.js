const errorPatterns = [
    {
        pattern: /fatal: non-fast-forward/,
        title: "Updates Rejected (Non-Fast-Forward)",
        description: "Your local code is behind the version on GitHub.",
        advice: "Someone else (or you) pushed changes to this branch. You need to 'pull' those changes first before you can push yours."
    },
    {
        pattern: /Permission denied \(publickey\)/,
        title: "Authentication Failed (SSH Key)",
        description: "GitHub doesn't recognize your computer.",
        advice: "You need to add your SSH key to your GitHub account settings. Or simpler: try using HTTPS URL instead of SSH."
    },
    {
        pattern: /Authentication failed/,
        title: "Authentication Failed",
        description: "Your username or password/token is incorrect.",
        advice: "Check your credentials. If you have 2FA enabled, you must use a Personal Access Token instead of a password."
    },
    {
        pattern: /remote: Repository not found/,
        title: "Repository Not Found",
        description: "The URL you entered doesn't point to a valid repository.",
        advice: "Double check the URL. It might be a typo, or the repo might be private and you don't have access."
    },
    {
        pattern: /conflict/,
        title: "Merge Conflict",
        description: "GitHub has changes that conflict with your local files.",
        advice: "You need to manually verify the files and decide which code to keep (yours or theirs)."
    },
    {
        pattern: /does not appear to be a git repository/,
        title: "Not a Git Repository",
        description: "This folder hasn't been set up as a git project yet.",
        advice: "Try initializing the repository first."
    }
];

const translateError = (rawError) => {
    const errorString = rawError.toString();
    const match = errorPatterns.find(p => p.pattern.test(errorString));

    if (match) {
        return {
            title: match.title,
            description: match.description,
            advice: match.advice,
            isTranslated: true
        };
    }

    return {
        title: "Unknown Git Error",
        description: "Something went wrong with the git command.",
        advice: "Check the raw logs for more details.",
        isTranslated: false
    };
};

module.exports = { translateError };
