import { describe, expect, it } from "vitest";
import { numberToWordsFa } from "./numberToWords";

describe("numberToWordsFa", () => {
  it("basics", () => {
    expect(numberToWordsFa(0)).toBe("صفر");
    expect(numberToWordsFa(7)).toBe("هفت");
    expect(numberToWordsFa(19)).toBe("نوزده");
    expect(numberToWordsFa(42)).toBe("چهل و دو");
    expect(numberToWordsFa(115)).toBe("صد و پانزده");
    expect(numberToWordsFa(300)).toBe("سیصد");
  });
  it("scales", () => {
    expect(numberToWordsFa(1000)).toBe("هزار");
    expect(numberToWordsFa(2500)).toBe("دو هزار و پانصد");
    expect(numberToWordsFa(1_000_000)).toBe("یک میلیون");
    expect(numberToWordsFa(12_345_678)).toBe("دوازده میلیون و سیصد و چهل و پنج هزار و ششصد و هفتاد و هشت");
    expect(numberToWordsFa(1_500_000_000)).toBe("یک میلیارد و پانصد میلیون");
  });
});
