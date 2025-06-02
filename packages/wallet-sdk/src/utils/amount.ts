import { BN } from '@polkadot/util';
import { ethers } from 'ethers';

/**
 * Parses amount for both Substrate and EVM chains
 * @param amount The amount to convert (can be string, number, boolean, Uint8Array, or null)
 * @param chainType The type of chain ('substrate' or 'evm')
 * @param decimals Number of decimal places (default: 18)
 * @returns The amount in base units as string
 */
export function parseTransactionAmount(
  amount: string | number | boolean | Uint8Array<ArrayBufferLike> | null,
  chainType: 'substrate' | 'evm',
  decimals: number = 18
): string {
  // Handle null or undefined
  if (amount === null || amount === undefined) {
    throw new Error('Amount cannot be null or undefined');
  }

  if (chainType === 'evm') {
    return ethers.parseEther(amount.toString()).toString();
  } else {
    // For Substrate, we need to handle decimal numbers properly
    const amountStr = amount.toString();
    const [whole, fraction = ''] = amountStr.split('.');
    const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
    const fullNumber = whole + paddedFraction;
    return new BN(fullNumber).toString();
  }
}
