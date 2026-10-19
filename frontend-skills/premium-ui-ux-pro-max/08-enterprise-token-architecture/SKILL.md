---
name: premium-enterprise-tokens
description: Enterprise design-token architecture for multi-team / multi-brand scale — three-layer tokens, theming, governance, and automated CSS/JSON generation.
---
# Enterprise Design Token Architecture
## سه لایه (اجباری)
```
Primitive  --color-green-600:#0B6B4F  --space-4:16px        (مقدار خام، فقط اینجا hex/عدد هست)
Semantic   --color-primary:var(--color-green-600)           (نقش: primary/surface/danger…)
Component  --button-bg:var(--color-primary)                 (مصرف یک کامپوننت)
```
کامپوننت هرگز primitive مستقیم مصرف نمی‌کند. تغییر برند/تم = فقط لایه semantic.
## چندتم/چندبرند
`[data-theme="dark"]` و `[data-brand="b"]` فقط semanticها را override می‌کنند. کنتراست هر جفت semantic در هر تم باید WCAG AA پاس کند (با `../scripts/check_contrast.py` چک کن).
## حاکمیت (Governance) — بخش «سازمانی» Premium
- منبع حقیقت واحد: `tokens/tokens.json` در پروژه؛ CSS/JSON پلتفرم‌ها با `../scripts/generate_tokens.py` ساخته می‌شوند (دستی ویرایش خروجی ممنوع).
- تغییر توکن = PR جدا + changelog؛ شکستن نام semantic = major version؛ نام‌گذاری: `--<category>-<role>-<state?>`.
- مصرف‌کننده‌ها: وب (CSS vars)، موبایل (JSON)، اسلاید/بنر (همان palette از tokens.json می‌خوانند).
## QA
- [ ] هیچ hex ـی بیرون از لایه primitive نیست (grep کن)  - [ ] dark و light کنتراست پاس  - [ ] خروجی اسکریپت با فایل commit‌شده یکی است
