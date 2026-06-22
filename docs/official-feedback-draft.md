# Official Feedback Draft

## Title

Local Markdown Editor Plugin for Codex: request for plugin-level file link handlers

## Summary

I am building a Codex plugin that opens a local Markdown editor inside the Codex browser. The plugin can provide a configurable workspace root, open a local editor URL, search Markdown files, preview changes, show diffs before saving, and preserve local backups.

The current limitation is that Codex file links still open through the default Codex file handling path. A Markdown editor plugin cannot declare that it wants to handle `.md` links or workspace-scoped file links. As a result, the plugin can generate editor URLs, but it cannot become the natural target for Markdown file links inside Codex.

## Request

Please consider adding plugin-level file link handlers.

For example, a plugin manifest could declare:

```json
{
  "fileLinkHandlers": [
    {
      "extensions": [".md", ".markdown"],
      "urlTemplate": "http://127.0.0.1:{port}/?path={encodedPath}",
      "workspaceScoped": true
    }
  ]
}
```

## Desired Behavior

- Codex lets a plugin register supported file extensions or path patterns.
- Users can choose whether the plugin handles those links.
- The handler receives an encoded local path only after user approval.
- The plugin can scope handling to configured workspace roots.
- Codex falls back to the default file behavior when the plugin is unavailable.

## Why This Matters

Local writing, documentation, and knowledge-base workflows often need a richer Markdown editing surface than a plain file link. A plugin-level handler would let Codex users keep their preferred editor workflow inside Codex without exposing private files or requiring global operating-system link hijacking.

## Privacy Notes

The plugin should not receive arbitrary filesystem access. It should only handle links inside a configured workspace root and only after the user installs and enables the plugin.

## Repository

GitHub repository link to be added after publication.
