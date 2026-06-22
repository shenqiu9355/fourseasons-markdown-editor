# Scripts

Runtime and helper scripts can be added here after public-source cleanup.

Before adding scripts, confirm that they:

- accept a configurable workspace root
- do not contain private absolute paths
- do not bundle private content
- write runtime state only to ignored local-only locations
- provide `--help` output for setup and troubleshooting
