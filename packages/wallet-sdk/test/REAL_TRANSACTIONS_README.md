# Real Transaction Tests

This directory contains comprehensive tests for real transactions using actual wallet accounts across multiple blockchain networks including Substrate Selendra, EVM Selendra, and Ethereum testnet.

## Overview

The real transaction tests perform actual blockchain transactions to verify the SDK's functionality in real-world scenarios. These tests cover:

- **Substrate Selendra** (Mainnet & Testnet)
- **EVM Selendra** (Mainnet & Testnet)
- **Ethereum Sepolia Testnet**
- **Token Operations** (ERC20 on Ethereum)
- **Cross-Chain Address Generation**
- **Message Signing**

## Test Files

### `real-transaction-tests.test.ts`

Jest-based test suite for automated testing with comprehensive assertions and error handling.

### `real-transactions-runner.ts`

Standalone executable script for manual testing and demonstration purposes.

## Setup Instructions

### 1. Security Setup

**⚠️ CRITICAL SECURITY NOTES:**

- Never commit real private keys or mnemonics to version control
- Use dedicated test wallets only
- Replace default test mnemonics with your own
- Use testnet networks for development and testing

### 2. Wallet Setup

1. **Generate Test Mnemonic:**

    ```bash
    # Use the SDK to generate a new mnemonic
    npm run test:mnemonic
    ```

2. **Update Configuration:**

    ```typescript
    // In test files, replace:
    const testMnemonic = "YOUR_TEST_MNEMONIC_HERE";

    // Update recipient addresses:
    const TEST_ADDRESSES = {
        substrate: {
            selendra: "YOUR_SUBSTRATE_ADDRESS",
            selendraTestnet: "YOUR_SUBSTRATE_TESTNET_ADDRESS",
        },
        evm: {
            selendra: "0xYOUR_EVM_ADDRESS",
            selendraTestnet: "0xYOUR_EVM_TESTNET_ADDRESS",
            ethereumSepolia: "0xYOUR_ETHEREUM_ADDRESS",
        },
    };
    ```

### 3. Fund Test Wallets

#### Substrate Selendra

- **Mainnet:** Contact Selendra team for mainnet tokens
- **Testnet:** Request testnet tokens via [Selendra Telegram](https://t.me/selendranetwork)

#### EVM Selendra

- **Mainnet:** Bridge tokens from Substrate or acquire SEL tokens
- **Testnet:** Request testnet tokens via Selendra community

#### Ethereum Sepolia

- **Faucets:**
    - [SepoliaFaucet.com](https://sepoliafaucet.com/)
    - [Sepolia PoW Faucet](https://sepolia-faucet.pk910.de/)
    - [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)

## Running Tests

### Jest Test Suite

```bash
# Run all real transaction tests
npm test -- real-transaction-tests.test.ts

# Run with verbose output
npm test -- real-transaction-tests.test.ts --verbose

# Run specific test suites
npm test -- real-transaction-tests.test.ts -t "Substrate Selendra"
npm test -- real-transaction-tests.test.ts -t "Ethereum Testnet"
```

### Standalone Runner

```bash
# Execute the standalone test runner
npm run test:real-transactions

# Or run directly with ts-node
npx ts-node test/real-transactions-runner.ts
```

### Add to package.json Scripts

```json
{
    "scripts": {
        "test:real-transactions": "ts-node test/real-transactions-runner.ts",
        "test:real-jest": "jest test/real-transaction-tests.test.ts",
        "test:real-verbose": "jest test/real-transaction-tests.test.ts --verbose"
    }
}
```

## Test Features

### Network Support

- ✅ Substrate Selendra Mainnet
- ✅ Substrate Selendra Testnet
- ✅ EVM Selendra Mainnet
- ✅ EVM Selendra Testnet
- ✅ Ethereum Sepolia Testnet

### Transaction Types

- ✅ Native token transfers
- ✅ ERC20 token operations
- ✅ Fee estimation
- ✅ Balance checking
- ✅ Message signing

### Safety Features

- ✅ Balance verification before transactions
- ✅ Fee estimation and validation
- ✅ Network connectivity checks
- ✅ Graceful error handling
- ✅ Transaction receipt verification

## Expected Output

### Successful Test Run

```
🚀 Starting Real Transaction Tests
==================================================

🔗 Testing Substrate Selendra Mainnet
----------------------------------------
📊 Wallet Info:
   Address: 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
   Balance: 1000000000000000000 (raw)
   Network: Selendra
💰 Detailed Balance:
   Total: 1.00000 SEL
   Locked: 0.00000 SEL
   Transferable: 1.00000 SEL
⚡ Estimating transaction fee...
💸 Estimated fee: 0.00001 SEL
🚀 Sending transaction...
✅ Transaction sent! Hash: 0x1234...
✍️  Message signed: a1b2c3d4...

🔗 Testing EVM Selendra Mainnet
----------------------------------------
📊 EVM Wallet Info:
   Address: 0x8ba1f109551bD432803012645Hac136c46F570d6
   Balance: 1000000000000000000 (wei)
   Network: Selendra Mainnet
⚡ Estimating gas fee...
💸 Estimated gas fee: 0.00002 SEL
🚀 Sending EVM transaction...
✅ EVM transaction sent! Hash: 0x5678...
🔗 Explorer: http://explorer.selendra.org/tx/0x5678...

✅ All tests completed successfully!
```

### Error Scenarios

```
⚠️  Zero balance detected. Please fund the wallet:
   Address: 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
   Network: Selendra Mainnet

⚠️  Insufficient balance. Required: 1001000000000000000, Available: 1000000000000000000
⚠️  Skipping transaction to prevent failure

❌ Connection failed: WebSocket connection timeout
```

## Troubleshooting

### Connection Issues

- Verify RPC endpoints are accessible
- Check internet connectivity
- Ensure network configurations are correct

### Balance Issues

- Confirm wallets are funded with sufficient tokens
- Verify you're using the correct addresses
- Check testnet faucets are working

### Transaction Failures

- Ensure sufficient balance for amount + fees
- Verify recipient addresses are valid
- Check network is not congested

### Token Issues

- Confirm token contracts exist on target networks
- Verify token addresses are correct
- Check if tokens are supported

## Network Information

### Substrate Selendra

- **Mainnet RPC:** `wss://rpc.selendra.org`
- **Testnet RPC:** `wss://rpc-testnet.selendra.org`
- **Explorer:** `https://selendra.subscan.io`
- **SS58 Format:** 42

### EVM Selendra

- **Mainnet RPC:** `https://rpc.selendra.org`
- **Testnet RPC:** `https://rpc-testnet.selendra.org`
- **Chain ID:** 1961 (Mainnet), 1962 (Testnet)
- **Explorer:** `http://explorer.selendra.org`

### Ethereum Sepolia

- **RPC:** `https://sepolia.infura.io/v3/[API_KEY]`
- **Chain ID:** 11155111
- **Explorer:** `https://sepolia.etherscan.io`
- **Faucet:** `https://sepoliafaucet.com`

## Contributing

When adding new tests:

1. Follow the existing pattern for network testing
2. Include proper error handling and balance checks
3. Add descriptive console output for debugging
4. Test both success and failure scenarios
5. Update this README with new features

## Security Reminders

- 🔐 Never commit real private keys
- 🧪 Use testnet networks for development
- 💰 Use small amounts for mainnet testing
- 🔍 Verify recipient addresses before sending
- 📝 Keep detailed logs of test transactions
