#!/usr/bin/env python3
"""Generate CSS variables from a 3-layer tokens.json. Usage: generate_tokens.py tokens.json -o tokens.css"""
import json, re, sys
from pathlib import Path

def flatten(d, prefix=""):
    out = {}
    for k, v in d.items():
        key = f"{prefix}-{k}" if prefix else k
        out.update(flatten(v, key) if isinstance(v, dict) else {key: v})
    return out

def main():
    src = Path(sys.argv[1]); dest = Path(sys.argv[sys.argv.index("-o") + 1]) if "-o" in sys.argv else Path("tokens.css")
    data = json.loads(src.read_text(encoding="utf-8"))
    prim = flatten(data.get("primitive", {}))
    resolve = lambda v: re.sub(r"\{(.+?)\}", lambda m: prim.get(m.group(1).replace(".", "-"), m.group(0)), str(v))
    lines = [":root {"]
    lines += [f"  --{k}: {v};" for k, v in prim.items()]
    lines += [f"  --{k}: {resolve(v)};" for k, v in data.get("semantic", {}).items()]
    lines.append("}")
    for theme, vals in data.get("themes", {}).items():
        lines.append(f'[data-theme="{theme}"] {{')
        lines += [f"  --{k}: {resolve(v)};" for k, v in vals.items()]
        lines.append("}")
    dest.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Wrote {dest} ({len(prim)} primitives)")

if __name__ == "__main__":
    main()
