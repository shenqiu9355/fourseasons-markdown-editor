---
name: hongmeng-editor
description: Open and use the Four Seasons Markdown Editor, a configurable local Markdown editor workspace from Codex. Use when the user asks to launch, preview, search, edit, save, or create direct editor links for Markdown files through this plugin.
---

# Four Seasons Markdown Editor

Use this skill when the user wants Codex to work with a local Markdown editor workspace.

## Boundaries

- Never assume a private workspace path.
- Never read or copy private Markdown content unless the user explicitly asks for that exact file.
- Never traverse outside the configured workspace root.
- Never commit runtime files, backups, activity logs, credentials, or private paths.
- Treat `runtime/`, `backups/`, `logs/`, and `activity.jsonl` as local-only generated state.

## Configuration

The workspace root can be supplied by one of:

- `FOURSEASONS_EDITOR_WORKSPACE`
- `start.ps1 -Workspace <path>`
- `WORKSPACE=<path> ./start.sh`
- `editor/config.json`

If no workspace root is configured, the editor opens the safe sample workspace under `examples/sample-workspace`.

## Workflow

1. Confirm the configured workspace root.
2. Keep all file operations inside that root.
3. In Codex Desktop, prefer opening the editor URL in the in-app browser when a browser-control capability is available. If the host cannot open the in-app browser, show the local URL for the user to open manually.
4. When opening a file, prefer an editor URL such as `http://127.0.0.1:<port>/?path=<encoded-file-path>`.
5. For edits, show or preserve a diff before saving when the runtime supports it.
6. Keep backups and activity logs outside the public repository or in ignored local-only folders.

## Public Source Note

This public plugin package contains the Codex-facing skill, documentation, and a local browser editor runtime. Keep private user content outside the repository.
