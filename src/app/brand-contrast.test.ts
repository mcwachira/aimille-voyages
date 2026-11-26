import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(process.cwd(), "src/app/globals.css"), "utf8");

function getOklch(name: string, source = css) {
    const match = source.match(new RegExp(`--${name}:\\s*oklch\\(([^)]+)\\)`));
    if (!match) throw new Error(`Missing ${name} OKLCH token.`);

    const [lightness, chroma, hue] = match[1].trim().split(/[\s/]+/).map(Number);
    return { lightness, chroma, hue };
}

function toRgb({ lightness, chroma, hue }: ReturnType<typeof getOklch>) {
    const angle = hue * Math.PI / 180;
    const a = chroma * Math.cos(angle);
    const b = chroma * Math.sin(angle);
    const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
    const linear = [
        4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ];

    return linear.map((value) => {
        const encoded = value <= 0.0031308
            ? 12.92 * value
            : 1.055 * Math.pow(value, 1 / 2.4) - 0.055;
        return Math.max(0, Math.min(1, encoded));
    });
}

function luminance(rgb: number[]) {
    const [red, green, blue] = rgb.map((value) => value <= 0.04045
        ? value / 12.92
        : Math.pow((value + 0.055) / 1.055, 2.4));

    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(foreground: ReturnType<typeof getOklch>, background: ReturnType<typeof getOklch>) {
    const foregroundLuminance = luminance(toRgb(foreground));
    const backgroundLuminance = luminance(toRgb(background));
    return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05)
        / (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
}

describe("brand text contrast", () => {
    it("keeps small gold text readable on light and fixed dark brand backgrounds", () => {
        const readableGold = getOklch("gold-readable");
        const darkSurfaceGold = getOklch("gold-on-dark");

        expect(contrastRatio(readableGold, getOklch("ivory"))).toBeGreaterThanOrEqual(4.5);
        expect(contrastRatio(darkSurfaceGold, getOklch("jungle"))).toBeGreaterThanOrEqual(4.5);
        expect(css).toContain("--color-gold-readable: var(--gold-readable);");
        expect(css).toContain(":where(.bg-band, .bg-jungle)");
    });
});
