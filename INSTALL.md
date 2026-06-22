# Install Four Seasons Markdown Editor

## Run The Editor

Install Python 3.10 or newer, then start the local server.

Windows PowerShell:

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

Use a custom workspace:

```bash
WORKSPACE="/path/to/markdown-workspace" ./start.sh
```

Then open:

```text
http://127.0.0.1:7865/
```

When launched from a normal terminal, the editor is just a local web app and can be opened in any browser. When used from Codex Desktop, ask Codex to open the local URL in its in-app browser if that capability is available.

The editor checks `version.json` in the background. If a newer public GitHub version exists, it shows a small update reminder near the version label. If the check fails, the editor stays quiet and local editing is unaffected.

## Configure With JSON

Copy:

```text
editor/config.example.json
```

to:

```text
editor/config.json
```

Then edit `workspaceRoot` and optional `scopes`.

`editor/config.json` is ignored by Git so users do not accidentally publish private paths.

## Install As A Local Codex Plugin

This folder is also a Codex plugin source directory. Copy or clone it into your personal plugin location, then install through your local marketplace workflow.

Example local plugin source path:

```text
~/plugins/hongmeng-editor
```

The plugin includes:

```text
.codex-plugin/plugin.json
skills/hongmeng-editor/SKILL.md
```

Start a new Codex thread after installing, because plugin skills are loaded when a thread starts.

## Current Limitation

Codex does not currently expose a public plugin hook for "open any `.md` file with this editor" from every file link. Use the local URL flow:

```text
http://127.0.0.1:7865/?path=<url-encoded-markdown-path>
```

## Before Publishing Or Sharing

Check that these are absent from the Git tree:

- real writing files
- private paths
- `editor/config.json`
- `editor/runtime/`
- `editor/backups/`
- `activity.jsonl`
- logs or credentials

Run:

```powershell
git status --short
```

and inspect the file list before pushing to GitHub.
