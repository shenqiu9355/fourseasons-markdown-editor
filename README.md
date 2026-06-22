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
- Rename the current Markdown file
- Create folders inside the configured workspace
- Full-text search inside the configured workspace
- Basic punctuation/bracket/spacing check
- Light, dark, and comfort themes
- Display controls for font, size, and line height, including Chinese, English, Japanese, Korean, serif, sans-serif, and monospace font stacks
- Ctrl/Command + mouse wheel font-size zoom inside the editor
- Markdown formatting tools for bold, italic, headings, quotes, unordered and numbered lists, inline code, strikethrough, links, and horizontal rules
- Interface languages: English, Simplified Chinese, Traditional Chinese, French, German, Spanish, Portuguese, Italian, Dutch, Polish, Russian, Turkish, Arabic, Hindi, Indonesian, Vietnamese, Thai, Korean, and Japanese
- Non-blocking update reminder for future public releases

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

Codex currently does not expose a public extension point that lets a plugin claim Markdown file clicks globally. For now, start the local editor service and open editor URLs manually or through Codex instructions. In Codex Desktop, a capable agent should prefer the in-app browser when opening `http://127.0.0.1:7865/`; outside Codex, the same URL opens in the user's normal browser.

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
├─ version.json
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
