# Privacy And Data Boundary

This public repository must stay content-free and machine-neutral.

## Do Not Commit

- Manuscripts, private notes, or worldbuilding source text
- Runtime folders
- Backup folders
- Activity logs
- API keys, tokens, cookies, or credentials
- Private absolute paths
- Codex cache directories

## Local Runtime Rules

The runtime may create local backups and logs, but those outputs must be ignored by Git and kept outside public releases.

The editor should operate only inside the configured workspace root. Requests for files outside that root should fail closed.

## Demo Content

Use only synthetic Markdown in `examples/` for screenshots, tests, and public demos.
