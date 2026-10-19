#!/usr/bin/env python3
"""WCAG contrast checker. Usage: check_contrast.py '#16211C' '#F6F7F5' [...] — exit 1 if any pair < 4.5"""
import sys

def lum(hex_color):
    h = hex_color.lstrip("#"); rgb = [int(h[i:i+2], 16) / 255 for i in (0, 2, 4)]
    rgb = [c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4 for c in rgb]
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]

def ratio(a, b):
    la, lb = sorted([lum(a), lum(b)], reverse=True); return (la + 0.05) / (lb + 0.05)

ok = True
for i in range(1, len(sys.argv) - 1, 2):
    r = ratio(sys.argv[i], sys.argv[i + 1]); status = "PASS" if r >= 4.5 else "FAIL"; ok &= r >= 4.5
    print(f"{status}  {sys.argv[i]} on {sys.argv[i+1]}: {r:.2f}:1 (WCAG AA needs 4.5)")
sys.exit(0 if ok else 1)
