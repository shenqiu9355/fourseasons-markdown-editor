# Release Checklist

## Privacy

- [ ] No private Markdown content.
- [ ] No private worldbuilding or manuscript source text.
- [ ] No `runtime/`.
- [ ] No `backups/`.
- [ ] No `activity.jsonl`.
- [ ] No logs.
- [ ] No API keys, tokens, cookies, or credentials.
- [ ] No private absolute paths.
- [ ] No Codex cache directories.

## Plugin

- [ ] `.codex-plugin/plugin.json` exists.
- [ ] Plugin name matches the folder name: `hongmeng-editor`.
- [ ] Manifest version is valid semver.
- [ ] Manifest does not contain placeholder fields.
- [ ] Skill entry exists under `skills/hongmeng-editor/SKILL.md`.
- [ ] Runtime code, if added later, is configurable by workspace root.

## Documentation

- [ ] README explains the plugin to a new user.
- [ ] INSTALL steps are executable from a clean checkout.
- [ ] Configuration options are documented.
- [ ] Privacy boundary is documented.
- [ ] Official feedback draft is ready.
- [ ] Screenshots use synthetic sample content only.

## Validation

- [ ] Run plugin manifest validation.
- [ ] Search for private path fragments before publishing.
- [ ] Search for forbidden folders and generated files before publishing.
