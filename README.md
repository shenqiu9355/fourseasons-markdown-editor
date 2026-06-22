# Four Seasons Markdown Editor

Four Seasons Markdown Editor is a local-first Markdown editor packaged as a public Codex plugin source directory.

It was adapted from a private writing workflow, but this public repository is content-free. It does not include manuscripts, worldbuilding notes, runtime state, backups, activity logs, credentials, or hard-coded private machine paths.

## Features

- Local Markdown file browser and editor
- Markdown preview
- Save with conflict protection
- Diff review before saving
- Automatic pre-save backups
- History view with "load as draft"
- Full-text search inside the configured workspace
- Basic punctuation/bracket/spacing check
- Light, dark, and comfort themes
- Display controls for font, size, and line height
- Interface languages: English, Simplified Chinese, Traditional Chinese, Japanese, French, German, Spanish, and Korean

Simplified Chinese, Traditional Chinese, and Japanese language packs require a one-time local acknowledgement phrase. The confirmation is stored only in the browser on the user's computer. It is not uploaded and is not written to the activity log.

## Quick Start

Requirements:

- Python 3.10+
- A local folder containing Markdown files

Windows PowerShell:

```powershell
.\start.ps1
```

macOS / Linux:

```bash
chmod +x ./start.sh
./start.sh
```

Open:

```text
http://127.0.0.1:7865/
```

By default, the editor opens `examples/sample-workspace`. To use your own workspace:

```powershell
.\start.ps1 -Workspace "D:\path\to\markdown-workspace"
```

```bash
WORKSPACE="/path/to/markdown-workspace" ./start.sh
```

You can also copy `editor/config.example.json` to `editor/config.json` and edit `workspaceRoot`.

## Codex Plugin Status

This repository includes `.codex-plugin/plugin.json` and `skills/hongmeng-editor/SKILL.md`.

Codex currently does not expose a public extension point that lets a plugin claim Markdown file clicks globally. For now, start the local editor service and open editor URLs manually or through Codex instructions.

## Repository Layout

```text
hongmeng-editor/
├─ .codex-plugin/
│  └─ plugin.json
├─ editor/
│  ├─ server.py
│  ├─ config.example.json
│  └─ static/
├─ skills/
│  └─ hongmeng-editor/
├─ docs/
├─ examples/
│  └─ sample-workspace/
├─ start.ps1
├─ start.sh
├─ requirements.txt
├─ INSTALL.md
├─ CHANGELOG.md
├─ LICENSE
└─ README.md
```

## Privacy Boundary

Do not commit:

- Real drafts or manuscripts
- Private notes or worldbuilding files
- `editor/config.json`
- `editor/runtime/`
- `editor/backups/`
- logs, credentials, cookies, API keys, or private absolute paths

See `docs/privacy.md` and `docs/release-checklist.md`.
