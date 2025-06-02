# Bitriel Wallet SDK

[![Version](https://img.shields.io/npm/v/@bitriel/wallet-sdk.svg)](https://www.npmjs.com/package/@bitriel/wallet-sdk)
[![License](https://img.shields.io/npm/l/@bitriel/wallet-sdk.svg)](https://github.com/bitriel/wallet-sdk/blob/main/LICENSE)

A powerful TypeScript SDK for interacting with multiple blockchain networks, including the Selendra network, Polkadot ecosystem, and Ethereum EVM chains. This SDK provides a unified interface for wallet operations, token management, and transaction handling across different blockchain networks.

## Features

- 🌐 Multi-chain support:
  - Selendra Network
  - Polkadot Ecosystem
  - Ethereum EVM Chains
- 💼 Unified wallet interface
- 💰 Token management (ERC-20, native tokens)
- 🔐 Secure account management
- 📊 Real-time balance queries
- 🔄 Network switching capabilities
- 📝 Message signing
- 🔍 Transaction history

## Installation

```bash
# Using npm
npm install @bitriel/wallet-sdk

# Using yarn
yarn add @bitriel/wallet-sdk

# Using yarn
yarn add @bitriel/wallet-sdk
```

## Quick Start

```typescript
import { BitrielWalletSDK } from '@bitriel/wallet-sdk';

// Initialize the SDK
const sdk = new BitrielWalletSDK();

// Get supported networks
const networks = sdk.getSupportedNetworks();

// Connect to a network (e.g., Selendra Mainnet)
await sdk.connect('selendra');

// Get wallet state
const walletState = await sdk.getWalletState();

// Send a transaction
const txHash = await sdk.sendTransaction({
  to: '0x...',
  value: '1000000000000000000', // 1 SEL
});

// Sign a message
const signature = await sdk.signMessage('Hello, World!');

// Disconnect
await sdk.disconnect();
```

## Supported Networks

### Selendra Network

- Mainnet
- Testnet

### Polkadot Ecosystem

- Polkadot Mainnet
- Kusama

### Ethereum EVM Ecosystem

- Ethereum Mainnet
- Polygon Mainnet

## API Reference

### BitrielWalletSDK

#### Constructor

```typescript
new BitrielWalletSDK(options?: SDKOptions)
```

#### Methods

##### Connection Management

- `connect(networkId: string): Promise<void>`

  - Connects to the specified network
  - Throws an error if the network is not supported
  - Returns a promise that resolves when connected

- `disconnect(): Promise<void>`
  - Disconnects from the current network
  - Cleans up resources and connections

##### Wallet Operations

- `getWalletState(): Promise<WalletState>`

  - Returns the current wallet state including:
    - Address
    - Network
    - Balances (native and tokens)
    - Connection status

- `sendTransaction(tx: TransactionRequest): Promise<string>`

  - Sends a transaction and returns the transaction hash
  - Supports both EVM and Polkadot transaction formats
  - Handles gas estimation and fee calculation

- `signMessage(message: string): Promise<string>`
  - Signs a message using the current account
  - Returns the signature in the appropriate format for the network

##### Network Management

- `getSupportedNetworks(): NetworkConfig[]`

  - Returns a list of all supported networks
  - Includes network details and configuration

- `getCurrentNetwork(): NetworkConfig | null`
  - Returns the currently connected network
  - Returns null if not connected

##### Token Operations

- `getTokenBalance(tokenAddress: string): Promise<string>`

  - Returns the balance of a specific token
  - Supports both ERC-20 and native tokens

- `getTokenInfo(tokenAddress: string): Promise<TokenInfo>`
  - Returns detailed information about a token
  - Includes decimals, symbol, and name

## Development Setup

1. Clone the repository:

```bash
git clone https://github.com/bitriel/wallet-sdk.git
cd wallet-sdk
```

2. Install dependencies:

```bash
yarn install
```

3. Build the project:

```bash
yarn build
```

4. Run tests:

```bash
yarn test
```

## Testing

The SDK includes comprehensive tests:

- Unit tests: `yarn test`
- Watch mode: `yarn test:watch`
- Coverage report: `yarn test:coverage`
- Integration tests: `yarn test:execute`

## Troubleshooting

### Common Issues

1. **Connection Failures**

   - Ensure you have a stable internet connection
   - Check if the network is supported
   - Verify network configuration

2. **Transaction Failures**

   - Check sufficient balance
   - Verify gas/fee settings
   - Ensure correct network selection

3. **Token Operations**
   - Verify token contract address
   - Check token decimals
   - Ensure token is supported on the network

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the [GitHub repository](https://github.com/bitriel/wallet-sdk/issues) or contact the maintainers.
