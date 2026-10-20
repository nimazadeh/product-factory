# v0.7.0 — tools page, full occasions, single-open accordion
- tools-page-desktop.png — /tools catalog (5 tools, search, category chips)
- tools-page-mobile.png — /tools at 390px (overflow 0 measured)
- calendar-ordibehesht.png — Ordibehesht 1405 with 12 occasion rows + holiday dots
- faq-accordion.png — FAQ with single-open accordion
Measured: landing tool cards 4 (preview) + CTA; accordion aria-expanded rotates exactly one true; tools search سن→1, empty state shown; Mehr 17 occasions.
- layout-A-product-desktop.png / layout-A-product-mobile.png — chosen layout A in product: side panel, click on occasion day auto-scrolls + focuses its panel row (verified: activeElement === active row, row inside panel viewport, mobile overflow 0, bottom list removed)
- layout-A-fixed-*.png — FIX: side panel no longer squeezes the calendar. Page widens only for this tool (:has), calendar column locked at the original 640px (measured: calendar 640px, day cell 80.6px vs squished 304px/32.5px in 0.7.1); mobile = single column full width, overflow 0.
