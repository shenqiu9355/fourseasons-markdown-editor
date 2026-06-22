from __future__ import annotations

import argparse
import datetime as dt
import difflib
import hashlib
import json
import mimetypes
import os
import shutil
import sys
import urllib.parse
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


TOOL_DIR = Path(__file__).resolve().parent
PLUGIN_DIR = TOOL_DIR.parent
CONFIG_FILE = TOOL_DIR / "config.json"
DEFAULT_WORKSPACE_ROOT = PLUGIN_DIR / "examples" / "sample-workspace"
WORKSPACE_ROOT = DEFAULT_WORKSPACE_ROOT
STATIC_DIR = TOOL_DIR / "static"
BACKUP_DIR = TOOL_DIR / "backups"
RUNTIME_DIR = TOOL_DIR / "runtime"
SESSION_FILE = RUNTIME_DIR / "session.json"
ACTIVITY_FILE = RUNTIME_DIR / "activity.jsonl"
DIFF_DIR = RUNTIME_DIR / "diffs"

MAX_BODY_BYTES = 8 * 1024 * 1024
MAX_SEARCH_RESULTS = 300

ROOT_SCOPES: dict[str, tuple[str, Path]] = {}
EXCLUDED_DIRS = {".git", ".obsidian", "__pycache__", "node_modules"}


def load_config(config_path: Path = CONFIG_FILE) -> dict:
    if not config_path.exists():
        return {}
    return json.loads(config_path.read_text(encoding="utf-8"))


def resolve_config_path(raw: str | None, base: Path) -> Path | None:
    if not raw:
        return None
    path = Path(os.path.expandvars(os.path.expanduser(raw)))
    if not path.is_absolute():
        path = base / path
    return path.resolve()


def configure_workspace(workspace: str | None = None, config_path: Path = CONFIG_FILE) -> None:
    global WORKSPACE_ROOT, ROOT_SCOPES
    config = load_config(config_path)
    config_base = config_path.parent
    configured_root = (
        resolve_config_path(workspace, Path.cwd())
        or resolve_config_path(os.environ.get("FOURSEASONS_EDITOR_WORKSPACE"), Path.cwd())
        or resolve_config_path(config.get("workspaceRoot"), config_base)
        or DEFAULT_WORKSPACE_ROOT.resolve()
    )
    WORKSPACE_ROOT = configured_root.resolve()

    scopes: dict[str, tuple[str, Path]] = {}
    raw_scopes = config.get("scopes") or {}
    for key, value in raw_scopes.items():
        if not isinstance(value, dict):
            continue
        label = str(value.get("label") or key)
        root = resolve_config_path(value.get("path"), config_base)
        if root is not None:
            scopes[str(key)] = (label, root)
    if not scopes:
        scopes = {
            "novel": ("Workspace", WORKSPACE_ROOT),
            "project": ("Workspace", WORKSPACE_ROOT),
            "world": ("Workspace", WORKSPACE_ROOT),
        }
    safe_scopes: dict[str, tuple[str, Path]] = {}
    for key, (label, root) in scopes.items():
        resolved = root.resolve()
        if WORKSPACE_ROOT == resolved or WORKSPACE_ROOT in resolved.parents:
            safe_scopes[key] = (label, resolved)
    if not safe_scopes:
        safe_scopes = {
            "novel": ("Workspace", WORKSPACE_ROOT),
            "project": ("Workspace", WORKSPACE_ROOT),
            "world": ("Workspace", WORKSPACE_ROOT),
        }
    ROOT_SCOPES = safe_scopes


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8-sig")


def write_text(path: Path, content: str) -> None:
    path.write_text(content, encoding="utf-8", newline="")


def sha256_text(content: str) -> str:
    return hashlib.sha256(content.encode("utf-8")).hexdigest()


def safe_scope(raw: str | None) -> tuple[str, str, Path]:
    scope = raw or "novel"
    if scope not in ROOT_SCOPES:
        scope = "novel"
    label, root = ROOT_SCOPES[scope]
    return scope, label, root.resolve()


def is_allowed_workspace_path(path: Path) -> bool:
    root = WORKSPACE_ROOT.resolve()
    candidate = path.resolve()
    return root == candidate or root in candidate.parents


def is_listable_markdown(path: Path) -> bool:
    try:
        rel_parts = path.resolve().relative_to(WORKSPACE_ROOT.resolve()).parts
    except ValueError:
        return False
    if any(part in EXCLUDED_DIRS or part.startswith(".") for part in rel_parts):
        return False
    if BACKUP_DIR.resolve() == path.resolve() or BACKUP_DIR.resolve() in path.resolve().parents:
        return False
    if RUNTIME_DIR.resolve() == path.resolve() or RUNTIME_DIR.resolve() in path.resolve().parents:
        return False
    return path.suffix.lower() == ".md"


def safe_markdown_path(raw: str) -> Path:
    decoded = urllib.parse.unquote(raw or "")
    if not decoded:
        raise ValueError("缺少文件路径")
    raw_path = Path(decoded)
    candidates: list[Path] = []
    if raw_path.is_absolute():
        candidates.append(raw_path.resolve())
    else:
        candidates.append((WORKSPACE_ROOT / decoded).resolve())
        candidates.extend(
            [
                (root / decoded).resolve()
                for _, root in ROOT_SCOPES.values()
            ]
        )

    candidate = next((path for path in candidates if path.exists()), candidates[0])
    if not is_allowed_workspace_path(candidate):
        raise ValueError("路径越界，已拒绝")
    if candidate.suffix.lower() != ".md":
        raise ValueError("只允许编辑 Markdown 文件")
    if not candidate.exists() or not candidate.is_file():
        raise ValueError("文件不存在")
    return candidate


def relative_to_workspace(path: Path) -> str:
    return path.resolve().relative_to(WORKSPACE_ROOT.resolve()).as_posix()


def file_info(path: Path) -> dict:
    text = read_text(path)
    stat = path.stat()
    return {
        "path": relative_to_workspace(path),
        "absolutePath": str(path.resolve()),
        "name": path.name,
        "content": text,
        "hash": sha256_text(text),
        "size": stat.st_size,
        "mtime": dt.datetime.fromtimestamp(stat.st_mtime).isoformat(timespec="seconds"),
        "chars": len(text),
    }


def list_markdown_files(scope: str = "novel") -> tuple[str, str, Path, list[dict]]:
    scope, label, root = safe_scope(scope)
    files = []
    for path in sorted(root.rglob("*.md"), key=lambda item: relative_to_workspace(item)):
        if not is_listable_markdown(path):
            continue
        stat = path.stat()
        files.append(
            {
                "path": relative_to_workspace(path),
                "name": path.name,
                "folder": path.parent.relative_to(root).as_posix(),
                "size": stat.st_size,
                "mtime": dt.datetime.fromtimestamp(stat.st_mtime).isoformat(timespec="seconds"),
            }
        )
    return scope, label, root, files


def make_diff(old_text: str, new_text: str, name: str) -> str:
    old_lines = old_text.splitlines(keepends=True)
    new_lines = new_text.splitlines(keepends=True)
    diff = difflib.unified_diff(
        old_lines,
        new_lines,
        fromfile=f"{name} 当前文件",
        tofile=f"{name} 编辑后",
        lineterm="",
    )
    return "".join(diff)


def create_backup(path: Path) -> str:
    stamp = dt.datetime.now().strftime("%Y%m%d-%H%M%S")
    rel = relative_to_workspace(path)
    target = BACKUP_DIR / stamp / rel
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(path, target)
    return target.relative_to(TOOL_DIR).as_posix()


def safe_backup_path(raw: str) -> Path:
    decoded = urllib.parse.unquote(raw or "")
    if not decoded:
        raise ValueError("缺少历史版本路径")
    candidate = (TOOL_DIR / decoded).resolve()
    backup_root = BACKUP_DIR.resolve()
    if backup_root != candidate and backup_root not in candidate.parents:
        raise ValueError("历史版本路径越界，已拒绝")
    if candidate.suffix.lower() != ".md":
        raise ValueError("只允许读取 Markdown 历史版本")
    if not candidate.exists() or not candidate.is_file():
        raise ValueError("历史版本不存在")
    return candidate


def list_backups(path: Path) -> list[dict]:
    rel = relative_to_workspace(path)
    entries = []
    if not BACKUP_DIR.exists():
        return entries
    for stamp_dir in sorted(BACKUP_DIR.iterdir(), reverse=True):
        if not stamp_dir.is_dir():
            continue
        backup = stamp_dir / rel
        if not backup.exists() or not backup.is_file():
            continue
        stat = backup.stat()
        entries.append(
            {
                "id": backup.relative_to(TOOL_DIR).as_posix(),
                "stamp": stamp_dir.name,
                "path": rel,
                "size": stat.st_size,
                "mtime": dt.datetime.fromtimestamp(stat.st_mtime).isoformat(timespec="seconds"),
            }
        )
    return entries


def create_diff_record(path: Path, diff_text: str) -> str:
    stamp = dt.datetime.now().strftime("%Y%m%d-%H%M%S")
    digest = hashlib.sha1(relative_to_workspace(path).encode("utf-8")).hexdigest()[:10]
    DIFF_DIR.mkdir(parents=True, exist_ok=True)
    target = DIFF_DIR / f"{stamp}-{digest}.diff"
    target.write_text(diff_text, encoding="utf-8")
    return target.relative_to(TOOL_DIR).as_posix()


def search_markdown(query: str, scope: str = "novel") -> tuple[str, str, list[dict]]:
    keyword = (query or "").strip()
    if not keyword:
        return scope, "", []
    scope, label, root, files = list_markdown_files(scope)
    needle = keyword.lower()
    results: list[dict] = []
    for item in files:
        path = safe_markdown_path(item["path"])
        try:
            lines = read_text(path).splitlines()
        except UnicodeDecodeError:
            continue
        for line_no, line in enumerate(lines, start=1):
            pos = line.lower().find(needle)
            if pos < 0:
                continue
            start = max(0, pos - 34)
            end = min(len(line), pos + len(keyword) + 64)
            prefix = "..." if start > 0 else ""
            suffix = "..." if end < len(line) else ""
            results.append(
                {
                    "path": item["path"],
                    "name": item["name"],
                    "line": line_no,
                    "column": pos,
                    "matchLength": len(keyword),
                    "excerpt": f"{prefix}{line[start:end]}{suffix}",
                }
            )
            if len(results) >= MAX_SEARCH_RESULTS:
                return scope, label, results
    return scope, label, results


def json_bytes(payload: dict, status: int = 200) -> tuple[int, bytes, str]:
    data = json.dumps(payload, ensure_ascii=False, indent=2).encode("utf-8")
    return status, data, "application/json; charset=utf-8"


class EditorHandler(BaseHTTPRequestHandler):
    server_version = "FourSeasonsMarkdownEditor/0.1"

    def log_message(self, fmt: str, *args: object) -> None:
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))

    def send_payload(self, status: int, data: bytes, content_type: str) -> None:
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def send_json(self, payload: dict, status: int = 200) -> None:
        self.send_payload(*json_bytes(payload, status))

    def log_activity(self, event: str, **details: object) -> None:
        RUNTIME_DIR.mkdir(parents=True, exist_ok=True)
        payload = {
            "ts": dt.datetime.now().isoformat(timespec="seconds"),
            "event": event,
            "client": self.client_address[0] if self.client_address else "",
            **details,
        }
        with ACTIVITY_FILE.open("a", encoding="utf-8") as fh:
            fh.write(json.dumps(payload, ensure_ascii=False) + "\n")

    def read_json_body(self) -> dict:
        length = int(self.headers.get("Content-Length", "0") or "0")
        if length > MAX_BODY_BYTES:
            raise ValueError("请求内容过大")
        raw = self.rfile.read(length)
        if not raw:
            return {}
        return json.loads(raw.decode("utf-8"))

    def route_path(self) -> tuple[str, dict[str, list[str]]]:
        parsed = urllib.parse.urlparse(self.path)
        return parsed.path, urllib.parse.parse_qs(parsed.query)

    def do_GET(self) -> None:
        try:
            route, query = self.route_path()
            if route == "/api/files":
                scope, label, root, files = list_markdown_files(query.get("scope", ["novel"])[0])
                self.log_activity("list_files", scope=scope, count=len(files))
                self.send_json({"scope": scope, "label": label, "root": str(root), "files": files})
                return
            if route == "/api/file":
                path = safe_markdown_path(query.get("path", [""])[0])
                self.log_activity("open_file", path=relative_to_workspace(path))
                self.send_json(file_info(path))
                return
            if route == "/api/search":
                scope, label, results = search_markdown(
                    query.get("q", [""])[0],
                    query.get("scope", ["novel"])[0],
                )
                self.log_activity(
                    "search",
                    scope=scope,
                    query=query.get("q", [""])[0],
                    count=len(results),
                )
                self.send_json({"scope": scope, "label": label, "results": results})
                return
            if route == "/api/activity":
                limit = int(query.get("limit", ["80"])[0] or "80")
                lines = ACTIVITY_FILE.read_text(encoding="utf-8").splitlines() if ACTIVITY_FILE.exists() else []
                rows = [json.loads(line) for line in lines[-max(1, min(limit, 500)):]]
                self.send_json({"events": rows})
                return
            if route == "/api/history":
                path = safe_markdown_path(query.get("path", [""])[0])
                entries = list_backups(path)
                self.log_activity("list_history", path=relative_to_workspace(path), count=len(entries))
                self.send_json({"path": relative_to_workspace(path), "entries": entries})
                return
            if route == "/api/history/file":
                path = safe_markdown_path(query.get("path", [""])[0])
                backup = safe_backup_path(query.get("backup", [""])[0])
                content = read_text(backup)
                current = read_text(path)
                diff_text = make_diff(content, current, path.name)
                self.log_activity(
                    "open_history",
                    path=relative_to_workspace(path),
                    backup=backup.relative_to(TOOL_DIR).as_posix(),
                )
                self.send_json(
                    {
                        "path": relative_to_workspace(path),
                        "backup": backup.relative_to(TOOL_DIR).as_posix(),
                        "content": content,
                        "hash": sha256_text(content),
                        "diff": diff_text,
                        "changed": content != current,
                    }
                )
                return
            if route == "/api/session":
                if SESSION_FILE.exists():
                    self.send_payload(200, SESSION_FILE.read_bytes(), "application/json; charset=utf-8")
                else:
                    self.send_json({"currentPath": "", "dirty": False})
                return
            self.serve_static(route)
        except Exception as exc:
            self.send_json({"error": str(exc)}, status=400)

    def do_POST(self) -> None:
        try:
            route, _ = self.route_path()
            body = self.read_json_body()
            if route == "/api/diff":
                path = safe_markdown_path(body.get("path", ""))
                old_text = read_text(path)
                new_text = body.get("content", "")
                diff_text = make_diff(old_text, new_text, path.name)
                changed = old_text != new_text
                self.log_activity("view_diff", path=relative_to_workspace(path), changed=changed)
                self.send_json(
                    {
                        "path": relative_to_workspace(path),
                        "hash": sha256_text(old_text),
                        "diff": diff_text,
                        "changed": changed,
                    }
                )
                return
            if route == "/api/save":
                path = safe_markdown_path(body.get("path", ""))
                new_text = body.get("content", "")
                base_hash = body.get("baseHash", "")
                old_text = read_text(path)
                current_hash = sha256_text(old_text)
                if base_hash and base_hash != current_hash:
                    self.log_activity(
                        "save_rejected_conflict",
                        path=relative_to_workspace(path),
                        baseHash=base_hash,
                        currentHash=current_hash,
                    )
                    self.send_json(
                        {
                            "error": "文件已在外部变化，已拒绝覆盖",
                            "currentHash": current_hash,
                            "currentContent": old_text,
                        },
                        status=409,
                    )
                    return
                backup = create_backup(path)
                diff_text = make_diff(old_text, new_text, path.name)
                diff_record = create_diff_record(path, diff_text) if old_text != new_text else ""
                write_text(path, new_text)
                fresh = file_info(path)
                fresh["backup"] = backup
                fresh["diffRecord"] = diff_record
                self.log_activity(
                    "save",
                    path=relative_to_workspace(path),
                    chars=len(new_text),
                    oldHash=current_hash,
                    newHash=fresh["hash"],
                    backup=backup,
                    diff=diff_record,
                )
                self.send_json(fresh)
                return
            if route == "/api/session":
                RUNTIME_DIR.mkdir(parents=True, exist_ok=True)
                payload = {
                    "updatedAt": dt.datetime.now().isoformat(timespec="seconds"),
                    "currentPath": body.get("currentPath", ""),
                    "dirty": bool(body.get("dirty", False)),
                    "selectionStart": int(body.get("selectionStart", 0) or 0),
                    "selectionEnd": int(body.get("selectionEnd", 0) or 0),
                    "chars": int(body.get("chars", 0) or 0),
                    "draftHash": body.get("draftHash", ""),
                    "draft": body.get("draft", ""),
                }
                SESSION_FILE.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
                self.send_json({"ok": True, "updatedAt": payload["updatedAt"]})
                return
            self.send_json({"error": "未知接口"}, status=404)
        except Exception as exc:
            self.send_json({"error": str(exc)}, status=400)

    def serve_static(self, route: str) -> None:
        rel = "index.html" if route in ("", "/") else route.lstrip("/")
        path = (STATIC_DIR / rel).resolve()
        root = STATIC_DIR.resolve()
        if root != path and root not in path.parents:
            self.send_json({"error": "静态路径越界"}, status=403)
            return
        if not path.exists() or not path.is_file():
            self.send_json({"error": "页面不存在"}, status=404)
            return
        content_type = mimetypes.guess_type(str(path))[0] or "application/octet-stream"
        if path.suffix.lower() in (".html", ".css", ".js"):
            content_type += "; charset=utf-8"
        self.send_payload(200, path.read_bytes(), content_type)


def main() -> None:
    parser = argparse.ArgumentParser(description="Four Seasons Markdown Editor")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=7865)
    parser.add_argument(
        "--workspace",
        default="",
        help="Markdown workspace root. Defaults to editor/config.json or examples/sample-workspace.",
    )
    parser.add_argument(
        "--config",
        default=str(CONFIG_FILE),
        help="Path to config.json.",
    )
    args = parser.parse_args()

    configure_workspace(args.workspace, Path(args.config).resolve())
    if not WORKSPACE_ROOT.exists():
        raise SystemExit(f"Workspace does not exist: {WORKSPACE_ROOT}")
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    RUNTIME_DIR.mkdir(parents=True, exist_ok=True)

    server = ThreadingHTTPServer((args.host, args.port), EditorHandler)
    print(f"Four Seasons Markdown Editor: http://{args.host}:{args.port}")
    print(f"Workspace: {WORKSPACE_ROOT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n已停止")


if __name__ == "__main__":
    main()
