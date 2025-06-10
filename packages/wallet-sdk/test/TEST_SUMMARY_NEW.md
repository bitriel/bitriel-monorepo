# Test Summary

This document provides an overview of all test suites in the Bitriel Wallet SDK.

## Test Categories

### Unit Tests

- `tokenFormatters.test.ts` - Token formatting and parsing functions
- `mnemonic.test.ts` - Mnemonic generation and validation
- `amount-parsing.test.ts` - Transaction amount parsing utilities

### Integration Tests

- `integration-transactions.test.ts` - Network connectivity and basic operations
- `mock-transactions.test.ts` - Mocked transaction scenarios
- `transactions.test.ts` - Transaction handling and validation

### Real Transaction Tests ⭐ NEW

- `real-transaction-tests.test.ts` - **Jest-based real transaction tests**
- `real-transactions-runner.ts` - **Standalone executable test runner**
- `complete-demo.ts` - **Complete demonstration workflow**
- `wallet-generator.ts` - **Test wallet generation utility**

## Real Transaction Test Features

### Networks Tested

✅ **Substrate Selendra Mainnet**  
✅ **Substrate Selendra Testnet**  
✅ **EVM Selendra Mainnet**  
✅ **EVM Selendra Testnet**  
✅ **Ethereum Sepolia Testnet**

### Operations Tested

- Native token transfers
- ERC20 token balance queries
- Fee estimation and validation
- Message signing (Substrate & EVM)
- Cross-chain address generation
- Balance checking and formatting
- Transaction confirmation

### Safety Features

- Balance verification before transactions
- Fee estimation with sufficiency checks
- Graceful error handling
- Dry-run capabilities
- Testnet-first approach
- Network connectivity validation

## Quick Start Commands

### Generate Test Wallet

```bash
npm run generate:wallets
```

### Run Real Transaction Tests

#### Jest Test Suite (Automated)

```bash
# Run all real transaction tests
npm run test:real-jest

# Run with verbose output
npm run test:real-verbose

# Run specific test suites
npm test -- real-transaction-tests.test.ts -t "Substrate"
npm test -- real-transaction-tests.test.ts -t "Ethereum"
```

#### Standalone Runner (Manual)

```bash
# Run the standalone test runner
npm run test:real-transactions
```

#### Complete Demo (Interactive)

```bash
# Dry run demo (safe, no actual transactions)
npm run demo:complete

# Live demo with real transactions
npm run demo:live

# Testnet-only demo
npm run demo:testnet
```

### Standard Tests

```bash
# Run all tests
npm test

# Run specific test files
npm run test:mnemonic
npm run test:token-formatters
npm run test:execute
```

## Test Setup Requirements

### 1. Security Setup

⚠️ **CRITICAL:** Replace default test mnemonics with your own

```typescript
const testMnemonic = "YOUR_TEST_MNEMONIC_HERE";
```

### 2. Wallet Funding

#### Substrate Networks

- **Mainnet:** Contact Selendra team
- **Testnet:** Request via [Selendra Telegram](https://t.me/selendranetwork)

#### EVM Networks

- **Selendra EVM:** Bridge from Substrate or acquire SEL
- **Ethereum Sepolia:** Use faucets:
    - [SepoliaFaucet.com](https://sepoliafaucet.com/)
    - [Sepolia PoW Faucet](https://sepolia-faucet.pk910.de/)

### 3. Configuration Update

```typescript
const TEST_ADDRESSES = {
    substrate: {
        selendra: "YOUR_SUBSTRATE_ADDRESS",
        selendraTestnet: "YOUR_TESTNET_ADDRESS",
    },
    evm: {
        selendra: "0xYOUR_EVM_ADDRESS",
        ethereumSepolia: "0xYOUR_ETHEREUM_ADDRESS",
    },
};
```

## Expected Results

### Successful Test Output

```
🚀 Starting Real Transaction Tests
==================================================

🔗 Testing Substrate Selendra Mainnet
📊 Wallet State:
   Address: 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
   Balance: 1.00000 SEL
⚡ Estimating transaction fee: 0.00001 SEL
🚀 Sending transaction...
✅ Transaction sent! Hash: 0x1234...

🔗 Testing EVM Selendra Mainnet
📊 EVM Wallet State:
   Address: 0x8ba1f109551bD432803012645Hac136c46F570d6
   Balance: 1.00000 SEL
💸 Estimated gas fee: 0.00002 SEL
🚀 Sending EVM transaction...
✅ EVM transaction sent! Hash: 0x5678...

✅ All tests completed successfully!
```

### Error Scenarios

```
⚠️  Zero balance detected. Please fund the wallet:
   Address: 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
   Faucet: https://t.me/selendranetwork

⚠️  Insufficient balance for transaction
⚠️  Skipping actual transaction to prevent failure

❌ Connection failed: Network timeout
```

## Test File Descriptions

### `real-transaction-tests.test.ts`

Comprehensive Jest test suite with:

- Automated test execution
- Detailed assertions
- Error handling and logging
- Network-specific test cases
- Token operation tests
- Cross-chain compatibility tests

### `real-transactions-runner.ts`

Standalone executable script featuring:

- Manual test execution
- Interactive output
- Step-by-step transaction flow
- Balance checking and validation
- Safety checks and warnings

### `complete-demo.ts`

Full demonstration workflow including:

- Address generation across all networks
- Balance checking and formatting
- Fee estimation on all networks
- Optional live transaction execution
- Token operation demonstrations
- Message signing examples

### `wallet-generator.ts`

Utility for generating test wallets:

- Secure mnemonic generation
- Multi-network address derivation
- Configuration code generation
- Funding instructions
- Copy-paste ready setup

## Network Information

### Substrate Selendra

- **Mainnet:** `wss://rpc.selendra.org`
- **Testnet:** `wss://rpc-testnet.selendra.org`
- **Explorer:** `https://selendra.subscan.io`

### EVM Selendra

- **Mainnet:** `https://rpc.selendra.org` (Chain ID: 1961)
- **Testnet:** `https://rpc-testnet.selendra.org` (Chain ID: 1962)
- **Explorer:** `http://explorer.selendra.org`

### Ethereum Sepolia

- **RPC:** `https://sepolia.infura.io/v3/[API_KEY]`
- **Chain ID:** 11155111
- **Explorer:** `https://sepolia.etherscan.io`

## Best Practices

### Development

1. Always test on testnets first
2. Use small amounts for mainnet testing
3. Verify recipient addresses before sending
4. Keep detailed logs of test transactions
5. Never commit real private keys

### Production

1. Implement proper error handling
2. Add transaction confirmation waiting
3. Use appropriate gas/fee settings
4. Implement retry logic for failed transactions
5. Monitor network health before operations

## Troubleshooting

### Common Issues

- **Connection timeouts:** Check network RPC endpoints
- **Zero balances:** Fund wallets using provided instructions
- **Transaction failures:** Verify sufficient balance for amount + fees
- **Invalid addresses:** Ensure correct address format for network type

### Getting Help

- Check console output for detailed error messages
- Review network-specific documentation
- Contact Selendra community for testnet support
- Use Ethereum faucets for Sepolia ETH

---

**⭐ The real transaction tests provide comprehensive coverage of multi-chain operations with actual blockchain interactions, making them essential for validating the SDK's production readiness.**
