# Contributing

Thank you for helping improve Four Seasons Markdown Editor.

## Report A Bug

Open an issue and include:

- What happened
- Steps to reproduce
- Expected behavior
- OS, Python version, browser, and editor version
- Screenshots or error messages when helpful

Please do not upload private manuscripts, private paths, credentials, logs with secrets, or sensitive files. If a Markdown example is needed, create a small synthetic sample.

## Request A Feature

Open a feature request issue and describe:

- The workflow you want to improve
- The behavior you expect
- Any UI idea or shortcut you have in mind
- Whether a smaller version of the feature would still help

## Local Development

Requirements:

- Python 3.10+
- A local Markdown workspace

Start the editor:

```powershell
.\start.ps1
```

Use a custom workspace:

```powershell
.\start.ps1 -Workspace "D:\path\to\markdown-workspace"
```

macOS / Linux:

```bash
chmod +x ./start.sh
./start.sh
```

Run basic checks before opening a pull request:

```powershell
node --check editor/static/app.js
python -m py_compile editor/server.py
git status --short
```

## Pull Requests

Keep pull requests focused. A good pull request usually includes:

- A short description of the change
- The reason for the change
- Manual test steps
- Screenshots for UI changes

Before submitting, confirm that the Git tree does not include:

- `editor/config.json`
- `editor/runtime/`
- `editor/backups/`
- activity logs
- private Markdown files
- private absolute paths
- credentials or tokens
