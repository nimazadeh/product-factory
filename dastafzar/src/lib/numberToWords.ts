/** Persian number-to-words for invoice totals (Toman/Rial amounts). */
const ONES = ["", "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه"];
const TEENS = ["ده", "یازده", "دوازده", "سیزده", "چهارده", "پانزده", "شانزده", "هفده", "هجده", "نوزده"];
const TENS = ["", "", "بیست", "سی", "چهل", "پنجاه", "شصت", "هفتاد", "هشتاد", "نود"];
const HUNDREDS = ["", "صد", "دویست", "سیصد", "چهارصد", "پانصد", "ششصد", "هفتصد", "هشتصد", "نهصد"];
const SCALES = ["", "هزار", "میلیون", "میلیارد", "تریلیون"];

function threeDigits(n: number): string {
  const parts: string[] = [];
  const h = Math.floor(n / 100), r = n % 100;
  if (h) parts.push(HUNDREDS[h]);
  if (r >= 10 && r < 20) parts.push(TEENS[r - 10]);
  else {
    const t = Math.floor(r / 10), o = r % 10;
    if (t) parts.push(TENS[t]);
    if (o) parts.push(ONES[o]);
  }
  return parts.join(" و ");
}

export function numberToWordsFa(input: number): string {
  const n = Math.floor(Math.abs(input));
  if (n === 0) return "صفر";
  const groups: string[] = [];
  let rest = n, scale = 0;
  while (rest > 0) {
    const g = rest % 1000;
    if (g) {
      const w = threeDigits(g);
      groups.unshift(scale ? (g === 1 && scale === 1 ? SCALES[scale] : `${w} ${SCALES[scale]}`) : w);
    }
    rest = Math.floor(rest / 1000);
    scale += 1;
  }
  return groups.join(" و ");
}
