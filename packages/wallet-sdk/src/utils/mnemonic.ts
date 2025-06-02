import { mnemonicGenerate, mnemonicValidate } from "@polkadot/util-crypto";

export interface MnemonicOptions {
    wordCount?: 12 | 15 | 18 | 21 | 24; // Standard BIP39 word counts
    strength?: 128 | 160 | 192 | 224 | 256; // Corresponding entropy strength in bits
}

/**
 * Generates a mnemonic phrase that can be used for both Substrate and EVM chains
 * @param options Optional parameters for mnemonic generation
 * @returns Generated mnemonic phrase
 */
export function generateMnemonic(options: MnemonicOptions = {}): string {
    const {
        wordCount = 12,
        strength = 128, // 12 words = 128 bits of entropy
    } = options;

    // Validate word count
    if (![12, 15, 18, 21, 24].includes(wordCount)) {
        throw new Error("Invalid word count. Must be 12, 15, 18, 21, or 24");
    }

    // Validate strength
    if (![128, 160, 192, 224, 256].includes(strength)) {
        throw new Error("Invalid strength. Must be 128, 160, 192, 224, or 256");
    }

    // Ensure strength matches word count
    const expectedStrength = (wordCount / 3) * 32;
    if (strength !== expectedStrength) {
        throw new Error(
            `Strength ${strength} does not match word count ${wordCount}. Expected strength: ${expectedStrength}`
        );
    }

    // Generate mnemonic using Polkadot's implementation
    return mnemonicGenerate(wordCount);
}

/**
 * Validates a mnemonic phrase using Polkadot's implementation
 * @param mnemonic The mnemonic phrase to validate
 * @returns true if valid, false otherwise
 */
export function validateMnemonic(mnemonic: string): boolean {
    try {
        // Use Polkadot's mnemonic validation
        return mnemonicValidate(mnemonic);
    } catch {
        return false;
    }
}

/**
 * Gets the word count of a mnemonic phrase
 * @param mnemonic The mnemonic phrase to analyze
 * @returns The number of words in the mnemonic
 */
export function getMnemonicWordCount(mnemonic: string): number {
    return mnemonic.trim().split(/\s+/).length;
}

/**
 * Gets the entropy strength of a mnemonic phrase
 * @param mnemonic The mnemonic phrase to analyze
 * @returns The entropy strength in bits
 */
export function getMnemonicStrength(mnemonic: string): number {
    const wordCount = getMnemonicWordCount(mnemonic);
    return (wordCount / 3) * 32;
}

/**
 * Formats a mnemonic phrase for display
 * @param mnemonic The mnemonic phrase to format
 * @returns Formatted mnemonic with proper spacing and line breaks
 */
export function formatMnemonic(mnemonic: string): string {
    const words = mnemonic.trim().split(/\s+/);
    const lines = [];
    for (let i = 0; i < words.length; i += 4) {
        lines.push(words.slice(i, i + 4).join(" "));
    }
    return lines.join("\n");
}
