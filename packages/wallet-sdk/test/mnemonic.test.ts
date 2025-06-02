import {
    generateMnemonic,
    validateMnemonic,
    getMnemonicWordCount,
    getMnemonicStrength,
    formatMnemonic,
} from "../src/utils/mnemonic";

async function main() {
    try {
        console.log("=== Testing Mnemonic Generation and Validation ===\n");

        // Test 1: Default 12-word mnemonic
        console.log("Test 1: Default 12-word mnemonic");
        const defaultMnemonic = generateMnemonic();
        console.log("Generated mnemonic:");
        console.log(formatMnemonic(defaultMnemonic));
        console.log("Word count:", getMnemonicWordCount(defaultMnemonic));
        console.log("Strength:", getMnemonicStrength(defaultMnemonic), "bits");
        console.log("Valid:", validateMnemonic(defaultMnemonic));
        console.log("---\n");

        // Test 2: 24-word mnemonic
        console.log("Test 2: 24-word mnemonic");
        const longMnemonic = generateMnemonic({ wordCount: 24, strength: 256 });
        console.log("Generated mnemonic:");
        console.log(formatMnemonic(longMnemonic));
        console.log("Word count:", getMnemonicWordCount(longMnemonic));
        console.log("Strength:", getMnemonicStrength(longMnemonic), "bits");
        console.log("Valid:", validateMnemonic(longMnemonic));
        console.log("---\n");

        // Test 3: 15-word mnemonic
        console.log("Test 3: 15-word mnemonic");
        const mediumMnemonic = generateMnemonic({
            wordCount: 15,
            strength: 160,
        });
        console.log("Generated mnemonic:");
        console.log(formatMnemonic(mediumMnemonic));
        console.log("Word count:", getMnemonicWordCount(mediumMnemonic));
        console.log("Strength:", getMnemonicStrength(mediumMnemonic), "bits");
        console.log("Valid:", validateMnemonic(mediumMnemonic));
        console.log("---\n");

        // Test 4: Invalid mnemonics
        console.log("Test 4: Invalid mnemonic validation");
        const invalidMnemonics = [
            "invalid mnemonic phrase",
            "word1 word2 word3", // Too short
            "word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12 word13", // Too long
            "word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12 word13 word14 word15 word16", // Invalid length
        ];

        invalidMnemonics.forEach((mnemonic, index) => {
            console.log(`Invalid mnemonic ${index + 1}:`);
            console.log(mnemonic);
            console.log("Valid:", validateMnemonic(mnemonic));
            console.log("Word count:", getMnemonicWordCount(mnemonic));
            console.log("Strength:", getMnemonicStrength(mnemonic), "bits");
            console.log("---");
        });
        console.log("\n");

        // Test 5: Error handling
        console.log("Test 5: Error handling");

        // Test invalid word count
        try {
            console.log("Attempting to generate mnemonic with invalid word count (13):");
            generateMnemonic({ wordCount: 13 as any, strength: 128 });
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("✓ Expected error for invalid word count:", error.message);
            } else {
                console.log("✗ Unexpected error type:", error);
            }
        }

        // Test invalid strength
        try {
            console.log("\nAttempting to generate mnemonic with invalid strength (129):");
            generateMnemonic({ wordCount: 12, strength: 129 as any });
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("✓ Expected error for invalid strength:", error.message);
            } else {
                console.log("✗ Unexpected error type:", error);
            }
        }

        // Test mismatched strength and word count
        try {
            console.log("\nAttempting to generate mnemonic with mismatched strength (256) and word count (12):");
            generateMnemonic({ wordCount: 12, strength: 256 });
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("✓ Expected error for mismatched strength:", error.message);
            } else {
                console.log("✗ Unexpected error type:", error);
            }
        }

        console.log("\n=== All tests completed successfully ===");
    } catch (error: unknown) {
        console.error("\nError during test execution:");
        if (error instanceof Error) {
            console.error("Error Name:", error.name);
            console.error("Error Message:", error.message);
            console.error("Error Stack:", error.stack);
        } else {
            console.error("Unexpected error type:", error);
        }
    }
}

// Run the test
main().catch(console.error);
