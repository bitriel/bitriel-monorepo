import {
    generateMnemonic,
    validateMnemonic,
    getMnemonicWordCount,
    getMnemonicStrength,
    formatMnemonic,
} from "../src/utils/mnemonic";

describe("Mnemonic Generation and Validation", () => {
    test("should generate default 12-word mnemonic", () => {
        const defaultMnemonic = generateMnemonic();

        expect(getMnemonicWordCount(defaultMnemonic)).toBe(12);
        expect(getMnemonicStrength(defaultMnemonic)).toBe(128);
        expect(validateMnemonic(defaultMnemonic)).toBe(true);
        expect(defaultMnemonic.split(" ").length).toBe(12);
    });

    test("should generate 24-word mnemonic", () => {
        const mnemonic24 = generateMnemonic({ wordCount: 24, strength: 256 });

        expect(getMnemonicWordCount(mnemonic24)).toBe(24);
        expect(getMnemonicStrength(mnemonic24)).toBe(256);
        expect(validateMnemonic(mnemonic24)).toBe(true);
        expect(mnemonic24.split(" ").length).toBe(24);
    });

    test("should generate 15-word mnemonic", () => {
        const mnemonic15 = generateMnemonic({ wordCount: 15, strength: 160 });

        expect(getMnemonicWordCount(mnemonic15)).toBe(15);
        expect(getMnemonicStrength(mnemonic15)).toBe(160);
        expect(validateMnemonic(mnemonic15)).toBe(true);
        expect(mnemonic15.split(" ").length).toBe(15);
    });

    test("should validate invalid mnemonics correctly", () => {
        const invalidMnemonics = [
            "invalid mnemonic phrase",
            "word1 word2 word3",
            "word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12 word13",
            "word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12 word13 word14 word15 word16",
        ];

        invalidMnemonics.forEach(invalidMnemonic => {
            expect(validateMnemonic(invalidMnemonic)).toBe(false);
        });
    });

    test("should handle error cases for invalid parameters", () => {
        // Invalid word count
        expect(() => generateMnemonic({ wordCount: 13 as any })).toThrow(
            "Invalid word count. Must be 12, 15, 18, 21, or 24"
        );

        // Invalid strength
        expect(() => generateMnemonic({ strength: 129 as any })).toThrow(
            "Invalid strength. Must be 128, 160, 192, 224, or 256"
        );

        // Mismatched strength and word count
        expect(() => generateMnemonic({ strength: 256, wordCount: 12 })).toThrow(
            "Strength 256 does not match word count 12. Expected strength: 128"
        );
    });

    test("should format mnemonic correctly", () => {
        const testMnemonic =
            "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
        const formatted = formatMnemonic(testMnemonic);

        expect(formatted).toContain("abandon");
        expect(formatted.split("\n").length).toBeGreaterThan(1); // Should be multi-line
    });
});
