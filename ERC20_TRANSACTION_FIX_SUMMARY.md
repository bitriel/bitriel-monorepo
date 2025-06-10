# ERC-20 Token Transaction Fix Summary

## Issues Fixed

### 1. UI Issue: Send Page Showing Native Token Data Instead of Selected Custom Token

**Problem**: When selecting a custom token from the TokenListBottomSheet, the send page was still showing native token balance and using native token logic.

**Solution**: Updated the send page (`apps/mobile/app/(auth)/home/send/index.tsx`) to:

- Detect if the selected token is a native token or custom token using contract address
- Use the passed token balance for custom tokens instead of always calling `getDetailedBalance()`
- Create mock DetailedBalance object for custom tokens to maintain UI consistency

### 2. Transaction Logic Issue: Missing ERC-20 Token Support

**Problem**: The `useWalletTransactions` hook only supported native token transfers, not ERC-20 token transfers.

**Solution**: Enhanced `useWalletTransactions` hook (`apps/mobile/src/store/useWalletStore.ts`) to:

- Accept optional `contractAddress` and `decimals` parameters
- Detect ERC-20 vs native token transactions
- Encode ERC-20 transfer function calls with proper ABI encoding
- Use correct transaction structure for each type

### 3. Core SDK Issue: Incorrect Decimal Handling for EVM Tokens

**Problem**: The `parseTransactionAmount` function always used `ethers.parseEther()` (18 decimals) for all EVM transactions, ignoring the `decimals` parameter.

**Solution**: Fixed `parseTransactionAmount` function (`packages/wallet-sdk/src/utils/amount.ts`) to:

- Use `ethers.parseUnits(amount, decimals)` instead of `ethers.parseEther()`
- Properly respect the `decimals` parameter for EVM chains
- Handle decimal truncation based on token-specific decimal places

### 4. Mobile App Integration

**Solution**: Updated the passcode screen (`apps/mobile/app/(auth)/passcode/index.tsx`) to:

- Pass contract address and decimals to the `sendTransaction` function
- Support both native and ERC-20 token transactions

## Technical Details

### ERC-20 Transaction Encoding

```javascript
// ERC-20 transfer function call data structure:
const transferSelector = "0xa9059cbb"; // transfer(address,uint256)
const paddedRecipient = recipient.slice(2).padStart(64, "0");
const paddedAmount = parsedAmount.padStart(64, "0");
const data = transferSelector + paddedRecipient + paddedAmount;

const tx = {
    to: contractAddress, // Token contract address
    value: "0", // No ETH sent
    data: data, // Encoded function call
};
```

### Token Type Detection

```javascript
const isCustomToken =
    contractAddress &&
    contractAddress !== "0x0" &&
    contractAddress.toLowerCase() !== "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
```

### Amount Parsing with Correct Decimals

```javascript
// Before (always 18 decimals):
parseTransactionAmount(amount, "evm");

// After (respects token decimals):
parseTransactionAmount(amount, "evm", tokenDecimals);
```

## Files Modified

1. `packages/wallet-sdk/src/utils/amount.ts` - Fixed decimal handling
2. `apps/mobile/src/store/useWalletStore.ts` - Added ERC-20 support
3. `apps/mobile/app/(auth)/home/send/index.tsx` - Fixed UI token data handling
4. `apps/mobile/app/(auth)/passcode/index.tsx` - Pass token data to transactions
5. `apps/mobile/components/Loading/index.tsx` - Fixed React 18+ deprecation warning

## Testing

Created comprehensive test suite (`packages/wallet-sdk/test/erc20-transaction-fix.test.ts`) covering:

- USDT (6 decimals) amount parsing
- WBTC (8 decimals) amount parsing
- ETH (18 decimals) amount parsing
- ERC-20 transaction data encoding
- Consistency with ethers.js parseUnits

## Result

- ✅ Custom tokens now display correct balance and token information
- ✅ ERC-20 token transactions work on Ethereum EVM and other EVM networks
- ✅ Fee estimation works correctly for both native and ERC-20 tokens
- ✅ UI shows selected token data instead of native token data
- ✅ Supports tokens with any decimal precision (6, 8, 18, etc.)
- ✅ LoadingModal deprecation warning fixed
