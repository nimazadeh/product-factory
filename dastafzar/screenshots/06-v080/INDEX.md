# v0.8.0 — benchmark trio applied (Skill 23)
- landing-live-cards.png — tool cards show live results (Stripe): today conversion, sample age, days since Nowruz, Nowruz countdown — all computed client-side, landing stays SSG
- converter-chips.png — Airbnb ready-date chips (امروز / اول این ماه / نوروز) in hero + full converter; verified: Nowruz chip fills 1406/1/1 -> 2027/03/21
- Linear: uniform active:scale(.97) press, reveal capped 440->250ms, day-cell transitions 0.11–0.16s measured; sequential-typing focus regression still green
