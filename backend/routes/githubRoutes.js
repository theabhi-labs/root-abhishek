import express from 'express';
import axios from 'axios';
import { dbStore } from '../config/db.js';

const router = express.Router();

// Helper to extract owner and repo from URL or "owner/repo" string
const parseRepoString = (repoInput) => {
  if (!repoInput) return { owner: 'theabhi-labs', repo: 'root-abhishek' };
  let clean = repoInput.trim();
  clean = clean.replace(/^https?:\/\/github\.com\//i, '').replace(/\.git$/i, '').replace(/\/$/, '');
  const parts = clean.split('/');
  if (parts.length >= 2) {
    return { owner: parts[0], repo: parts[1] };
  }
  return { owner: 'theabhi-labs', repo: clean };
};

// Helper to detect language by extension
const detectLanguage = (filename) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'js':
    case 'jsx':
    case 'mjs': return 'javascript';
    case 'ts':
    case 'tsx': return 'typescript';
    case 'html': return 'html';
    case 'css':
    case 'scss': return 'css';
    case 'json': return 'json';
    case 'py': return 'python';
    case 'md':
    case 'markdown': return 'markdown';
    case 'java': return 'java';
    case 'c':
    case 'cpp': return 'cpp';
    case 'go': return 'go';
    case 'rs': return 'rust';
    case 'sh':
    case 'bash': return 'bash';
    case 'yml':
    case 'yaml': return 'yaml';
    default: return 'javascript';
  }
};

// Transform flat GitHub tree paths into recursive nested tree for VSCode UI
const buildNestedTree = (treeItems) => {
  const root = [];
  const map = {};

  // Sort items: folders first, then by depth and name
  const sorted = [...treeItems].sort((a, b) => {
    if (a.type === 'tree' && b.type !== 'tree') return -1;
    if (a.type !== 'tree' && b.type === 'tree') return 1;
    return a.path.localeCompare(b.path);
  });

  sorted.forEach(item => {
    const parts = item.path.split('/');
    let currentLevel = root;
    let currentPath = '';

    parts.forEach((part, index) => {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const isLast = index === parts.length - 1;

      if (isLast) {
        if (item.type === 'tree') {
          let existingFolder = currentLevel.find(i => i.name === part && i.type === 'folder');
          if (!existingFolder) {
            existingFolder = { name: part, type: 'folder', path: currentPath, children: [] };
            currentLevel.push(existingFolder);
          }
        } else {
          currentLevel.push({
            name: part,
            type: 'file',
            path: currentPath,
            size: item.size || 0,
            sha: item.sha,
            language: detectLanguage(part)
          });
        }
      } else {
        let existingFolder = currentLevel.find(i => i.name === part && i.type === 'folder');
        if (!existingFolder) {
          existingFolder = { name: part, type: 'folder', path: currentPath, children: [] };
          currentLevel.push(existingFolder);
        }
        currentLevel = existingFolder.children;
      }
    });
  });

  return root;
};

// 1. GET FULL REPOSITORY FILE TREE
router.get('/repo-tree', async (req, res) => {
  try {
    const { repo: repoInput, branch: requestedBranch } = req.query;
    const { owner, repo } = parseRepoString(repoInput);
    const config = dbStore.getAnalyticsConfig();

    const token = req.headers.authorization?.replace('Bearer ', '') ||
                  config.githubPersonalToken ||
                  process.env.GITHUB_TOKEN;

    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'root-abhishek-portfolio'
    };
    if (token) headers['Authorization'] = `token ${token}`;

    // Get Repo details to find default branch
    let defaultBranch = requestedBranch || 'main';
    try {
      const repoRes = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, { headers });
      defaultBranch = requestedBranch || repoRes.data.default_branch || 'main';
    } catch (err) {
      console.warn(`Could not fetch repo metadata for ${owner}/${repo}, trying default branch: ${defaultBranch}`);
    }

    // Fetch recursive tree from GitHub Git Trees API
    const treeRes = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`,
      { headers }
    );

    const flatTree = treeRes.data.tree || [];
    const nestedTree = buildNestedTree(flatTree);

    return res.json({
      success: true,
      repo: `${owner}/${repo}`,
      branch: defaultBranch,
      totalFiles: flatTree.filter(t => t.type === 'blob').length,
      tree: nestedTree
    });

  } catch (err) {
    console.error('Error fetching GitHub tree:', err.response?.data?.message || err.message);
    
    // Return structured default tree fallback so UI remains responsive
    return res.json({
      success: false,
      message: err.response?.data?.message || 'GitHub API rate limit or repository not reachable.',
      fallback: true,
      tree: [
        {
          name: "src",
          type: "folder",
          path: "src",
          children: [
            {
              name: "App.jsx",
              type: "file",
              path: "src/App.jsx",
              language: "javascript",
              content: `// Source code from ${req.query.repo || 'Repository'}\nimport React from "react";\n\nexport default function App() {\n  return (\n    <div className="min-h-screen bg-black text-white p-8">\n      <h1 className="text-2xl font-bold">Live Repository Workspace</h1>\n      <p>Synchronized via GitHub REST API</p>\n    </div>\n  );\n}`
            },
            {
              name: "main.jsx",
              type: "file",
              path: "src/main.jsx",
              language: "javascript",
              content: `import React from "react";\nimport ReactDOM from "react-dom/client";\nimport App from "./App";\n\nReactDOM.createRoot(document.getElementById("root")).render(<App />);`
            }
          ]
        },
        {
          name: "package.json",
          type: "file",
          path: "package.json",
          language: "json",
          content: `{\n  "name": "${parseRepoString(req.query.repo).repo}",\n  "version": "1.0.0",\n  "private": true\n}`
        },
        {
          name: "README.md",
          type: "file",
          path: "README.md",
          language: "markdown",
          content: `# ${parseRepoString(req.query.repo).repo}\n\nProduction codebase maintained by Abhishek Yadav (@theabhi-labs).`
        }
      ]
    });
  }
});

// 2. GET FILE CONTENT
router.get('/file-content', async (req, res) => {
  try {
    const { repo: repoInput, path: filePath, branch } = req.query;
    if (!filePath) {
      return res.status(400).json({ success: false, message: 'File path is required.' });
    }

    const { owner, repo } = parseRepoString(repoInput);
    const config = dbStore.getAnalyticsConfig();

    const token = req.headers.authorization?.replace('Bearer ', '') ||
                  config.githubPersonalToken ||
                  process.env.GITHUB_TOKEN;

    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'root-abhishek-portfolio'
    };
    if (token) headers['Authorization'] = `token ${token}`;

    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}${branch ? `?ref=${branch}` : ''}`;
    const fileRes = await axios.get(url, { headers });

    let decodedContent = '';
    if (fileRes.data.content) {
      decodedContent = Buffer.from(fileRes.data.content, 'base64').toString('utf8');
    } else if (fileRes.data.download_url) {
      const rawRes = await axios.get(fileRes.data.download_url);
      decodedContent = typeof rawRes.data === 'string' ? rawRes.data : JSON.stringify(rawRes.data, null, 2);
    }

    return res.json({
      success: true,
      path: filePath,
      name: fileRes.data.name,
      size: fileRes.data.size,
      sha: fileRes.data.sha,
      language: detectLanguage(fileRes.data.name),
      content: decodedContent
    });

  } catch (err) {
    console.error('Error fetching GitHub file content:', err.response?.data?.message || err.message);
    return res.status(500).json({
      success: false,
      message: err.response?.data?.message || 'Failed to fetch file content from GitHub.',
      content: `// File preview unavailable\n// Path: ${req.query.path}\n// Error: ${err.message}`
    });
  }
});

// 3. GITHUB OAUTH AUTHORIZATION URL
router.get('/auth-url', (req, res) => {
  const config = dbStore.getAnalyticsConfig();
  const clientId = config.githubClientId || process.env.GITHUB_CLIENT_ID;

  if (!clientId) {
    return res.status(400).json({
      success: false,
      message: 'GitHub OAuth Client ID is not configured in Admin Settings.'
    });
  }

  const redirectUri = `${req.protocol}://${req.get('host')}/api/github/callback`;
  const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo,read:user`;

  return res.json({ success: true, url });
});

// 4. GITHUB OAUTH CALLBACK
router.post('/callback', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'OAuth authorization code is required.' });
    }

    const config = dbStore.getAnalyticsConfig();
    const clientId = config.githubClientId || process.env.GITHUB_CLIENT_ID;
    const clientSecret = config.githubClientSecret || process.env.GITHUB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return res.status(400).json({
        success: false,
        message: 'GitHub Client ID or Client Secret not configured.'
      });
    }

    const tokenRes = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: clientId,
        client_secret: clientSecret,
        code
      },
      {
        headers: { 'Accept': 'application/json' }
      }
    );

    const { access_token, error, error_description } = tokenRes.data;
    if (error || !access_token) {
      return res.status(400).json({ success: false, message: error_description || error || 'OAuth failed.' });
    }

    // Fetch authenticated user profile
    const userRes = await axios.get('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${access_token}`,
        'User-Agent': 'root-abhishek-portfolio'
      }
    });

    return res.json({
      success: true,
      token: access_token,
      user: {
        login: userRes.data.login,
        name: userRes.data.name,
        avatar_url: userRes.data.avatar_url,
        html_url: userRes.data.html_url
      }
    });

  } catch (err) {
    console.error('GitHub OAuth error:', err);
    return res.status(500).json({ success: false, message: 'GitHub OAuth token exchange failed.' });
  }
});

export default router;
