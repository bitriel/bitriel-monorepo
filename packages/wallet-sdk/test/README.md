# Wallet SDK Test Suite

## Overview

This directory contains comprehensive tests for the Bitriel Wallet SDK, covering core functionality, mock transactions, and integration scenarios.

## Test Status

### ✅ Core Unit Tests (57/57 passing)

All core unit tests are fully functional and passing:

- **Amount Parsing Tests** (25 tests) - All passing

    - Decimal precision handling with truncation to 18 decimals max for EVM chains
    - Cross-chain amount conversion validation
    - Edge case handling for various token decimal configurations

- **Mock Transaction Tests** (17 tests) - All passing

    - Substrate and EVM transaction mocking
    - Gas estimation and fee calculation validation
    - Cross-chain transaction compatibility testing

- **Token Formatters Tests** (9 tests) - All passing ✅ **FIXED**

    - Token balance formatting with thousand separators
    - Token amount display with symbols
    - Balance parsing with leading zero removal
    - API compatibility corrections

- **Mnemonic Tests** (6 tests) - All passing
    - BIP39 mnemonic generation and validation
    - Multiple word count support (12, 15, 18, 21, 24 words)
    - Strength parameter validation

### ⚠️ Integration Tests (Requires Network Connectivity)

The integration tests require live network connections and may fail in CI/offline environments:

- **Substrate Integration**: Tests pass when Selendra network is accessible
- **EVM Integration**: Currently requires EVM network configuration
- **Cross-chain Integration**: Depends on both networks being available

## Key Fixes Applied

### 1. Token Formatter API Corrections

- Fixed `formatTokenAmount()` function signature to accept symbol as separate parameter
- Updated tests to use correct API: `formatTokenAmount(amount, decimals, symbol, options?)`
- Corrected thousand separator expectations in balance formatting

### 2. parseTokenBalance Improvements

- Added BigInt conversion to remove leading zeros from parsed results
- Improved handling of zero values to return clean "0" instead of padded strings
- Enhanced error handling for edge cases

### 3. Amount Parsing Enhancements

- Added decimal truncation to 18 places maximum for EVM chains
- Improved try-catch error handling in `parseTransactionAmount()`
- Enhanced cross-chain compatibility

## Running Tests

### Core Unit Tests Only (Recommended for CI)

```bash
npm test -- --testPathPattern="(amount-parsing|mock-transactions|tokenFormatters|mnemonic)\.test\.ts"
```

### All Tests (Requires Network Access)

```bash
npm test
```

### Individual Test Suites

```bash
# Amount parsing tests
npm test -- --testPathPattern=amount-parsing.test.ts

# Token formatter tests
npm test -- --testPathPattern=tokenFormatters.test.ts

# Mock transaction tests
npm test -- --testPathPattern=mock-transactions.test.ts

# Mnemonic tests
npm test -- --testPathPattern=mnemonic.test.ts
```

## Test Architecture

- **Unit Tests**: Fast, isolated tests that don't require network connectivity
- **Mock Tests**: Use simulated network responses to test transaction logic
- **Integration Tests**: Real network calls for end-to-end validation

## Next Steps

1. **✅ Complete** - Fix remaining token formatter test failures
2. **Future** - Create offline-compatible integration tests using network mocks
3. **Future** - Add EVM network configuration for complete integration testing
4. **Future** - Implement test coverage reporting
5. **Future** - Add performance benchmarking for amount parsing operations
