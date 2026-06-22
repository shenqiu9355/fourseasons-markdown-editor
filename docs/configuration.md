# Configuration

Four Seasons Markdown Editor is configured at runtime. Public source files must not contain private absolute paths.

## Workspace Root

Supported configuration methods:

- PowerShell launch argument: `.\start.ps1 -Workspace "D:\path\to\markdown-workspace"`
- macOS/Linux environment variable: `WORKSPACE="/path/to/markdown-workspace" ./start.sh`
- Server argument: `python editor/server.py --workspace <path>`
- Local ignored JSON file: `editor/config.json`
- Environment variable read by the server: `FOURSEASONS_EDITOR_WORKSPACE`

If nothing is configured, the editor opens the safe demo workspace at `examples/sample-workspace`.

The server rejects Markdown files outside the configured workspace root.

## Local-Only State

Generated state belongs in ignored folders:

```text
editor/runtime/
editor/backups/
editor/logs/
editor/activity.jsonl
editor/config.json
```

These files are useful for local operation but must not be published.

## Example Config

Copy `editor/config.example.json` to `editor/config.json`:

```json
{
  "workspaceRoot": "../examples/sample-workspace",
  "scopes": {
    "novel": {
      "label": "Drafts",
      "path": "../examples/sample-workspace"
    }
  }
}
```

Do not commit the real `editor/config.json` value into Git.
