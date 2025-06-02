import { ethers } from 'ethers';
import {
  WalletProvider,
  TransactionRequest,
  EVMTransactionRequest,
  TokenInfo,
  FeeEstimate,
} from './types';
import { EVMNetworkConfig } from '../config/networks';
import { formatTokenBalance } from '../utils/tokenFormatters';

export class EVMWalletProvider implements WalletProvider {
  private provider: ethers.Provider | null = null;
  private signer: ethers.Signer | null = null;
  private network: EVMNetworkConfig;
  private mnemonic: string;

  constructor(network: EVMNetworkConfig, mnemonic: string) {
    this.network = network;
    this.mnemonic = mnemonic;
  }

  async connect(): Promise<void> {
    try {
      this.provider = new ethers.JsonRpcProvider(this.network.rpcUrl as string);
      // Use the provided mnemonic to create the wallet
      this.signer = ethers.Wallet.fromPhrase(this.mnemonic, this.provider);
    } catch (error) {
      throw new Error(`Failed to connect to EVM network: ${error}`);
    }
  }

  async disconnect(): Promise<void> {
    this.provider = null;
    this.signer = null;
  }

  async getAddress(): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }
    return await this.signer.getAddress();
  }

  async signMessage(message: string): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }
    return await this.signer.signMessage(message);
  }

  async getBalance(): Promise<string> {
    if (!this.provider || !this.signer) {
      throw new Error('Wallet not connected');
    }
    const address = await this.signer.getAddress();
    const balance = await this.provider.getBalance(address);
    return balance.toString();
  }

  async sendTransaction(tx: TransactionRequest): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }
    if (!this.isEVMTransaction(tx)) {
      throw new Error('Invalid transaction type for EVM network');
    }
    const transaction = await this.signer.sendTransaction(tx);
    return transaction.hash;
  }

  async getTokenBalance(tokenAddress: string): Promise<string> {
    if (!this.provider || !this.signer) {
      throw new Error('Wallet not connected');
    }

    const address = await this.signer.getAddress();

    // Check if this is the native token (using zero address)
    if (tokenAddress.toLowerCase() === '0x0000000000000000000000000000000000000000') {
      const balance = await this.provider.getBalance(address);
      return balance.toString();
    }

    // For ERC20 tokens
    try {
      // First check if the contract exists
      console.log(
        `Checking contract at address ${tokenAddress} on network ${this.network.name} (chainId: ${this.network.chainId})`
      );
      const code = await this.provider.getCode(tokenAddress);
      console.log(`Contract code length: ${code.length}`);

      if (code === '0x') {
        console.warn(
          `No contract found at address ${tokenAddress} on network ${this.network.name}`
        );
        return '0';
      }

      const tokenContract = new ethers.Contract(
        tokenAddress,
        [
          'function balanceOf(address) view returns (uint256)',
          'function decimals() view returns (uint8)',
          'function symbol() view returns (string)',
        ],
        this.provider
      );

      // Verify the contract implements the required methods
      try {
        const symbol = await tokenContract.symbol();
        const decimals = await tokenContract.decimals();
        console.log(
          `Contract implements ERC20 interface. Symbol: ${symbol}, Decimals: ${decimals}`
        );
      } catch (error: unknown) {
        console.warn(`Contract at ${tokenAddress} does not implement ERC20 interface: ${error}`);
        return '0';
      }

      const balance = await tokenContract.balanceOf(address);
      return balance.toString();
    } catch (error) {
      console.warn(`Failed to get balance for token ${tokenAddress}:`, error);
      return '0'; // Return 0 for failed token balance queries
    }
  }

  async listTokens(): Promise<TokenInfo[]> {
    if (!this.provider || !this.signer) {
      throw new Error('Wallet not connected');
    }

    const address = await this.signer.getAddress();
    const tokens: TokenInfo[] = [];

    // Add native token
    const nativeBalance = await this.provider.getBalance(address);
    tokens.push({
      address: '0x0000000000000000000000000000000000000000',
      name: this.network.nativeCurrency.name,
      symbol: this.network.nativeCurrency.symbol,
      decimals: this.network.nativeCurrency.decimals,
      balance: nativeBalance.toString(),
      formatted: this.formatTokenBalance(
        nativeBalance.toString(),
        this.network.nativeCurrency.decimals
      ),
    });

    // Add configured tokens
    if (this.network.tokens) {
      for (const token of this.network.tokens) {
        try {
          // Check if contract exists
          console.log(
            `Checking token contract at address ${token.address} on network ${this.network.name} (chainId: ${this.network.chainId})`
          );
          const code = await this.provider.getCode(token.address);
          console.log(`Token contract code length: ${code.length}`);

          if (code === '0x') {
            console.warn(
              `No contract found at address ${token.address} on network ${this.network.name}`
            );
            tokens.push({
              ...token,
              balance: '0',
              formatted: '0.0',
            });
            continue;
          }

          const tokenContract = new ethers.Contract(
            token.address,
            [
              'function balanceOf(address) view returns (uint256)',
              'function decimals() view returns (uint8)',
              'function symbol() view returns (string)',
            ],
            this.provider
          );

          // Verify contract implements ERC20 interface
          try {
            const symbol = await tokenContract.symbol();
            const decimals = await tokenContract.decimals();
            console.log(
              `Token contract implements ERC20 interface. Symbol: ${symbol}, Decimals: ${decimals}`
            );
          } catch (error: unknown) {
            console.warn(
              `Contract at ${token.address} does not implement ERC20 interface: ${error}`
            );
            tokens.push({
              ...token,
              balance: '0',
              formatted: '0.0',
            });
            continue;
          }

          const balance = await tokenContract.balanceOf(address);
          tokens.push({
            ...token,
            balance: balance.toString(),
            formatted: this.formatTokenBalance(balance.toString(), token.decimals),
          });
        } catch (error) {
          console.warn(`Failed to get balance for token ${token.symbol}:`, error);
          tokens.push({
            ...token,
            balance: '0',
            formatted: '0.0',
          });
        }
      }
    }

    return tokens;
  }

  private formatTokenBalance(balance: string, decimals: number, precision: number = 5): string {
    return formatTokenBalance(balance, decimals, { precision });
  }

  isConnected(): boolean {
    return this.provider !== null && this.signer !== null;
  }

  private isEVMTransaction(tx: TransactionRequest): tx is EVMTransactionRequest {
    return 'to' in tx && 'value' in tx && typeof tx.value === 'string';
  }

  async estimateFee(tx: TransactionRequest): Promise<FeeEstimate> {
    if (!this.provider || !this.signer) {
      throw new Error('Wallet not connected');
    }

    if (!this.isEVMTransaction(tx)) {
      throw new Error('Invalid transaction type for EVM network');
    }

    try {
      // Get the current gas price
      const gasPrice = await this.provider.getFeeData();
      if (!gasPrice.gasPrice) {
        throw new Error('Failed to get gas price');
      }

      // Estimate gas limit for the transaction
      const gasLimit = await this.provider.estimateGas({
        from: await this.signer.getAddress(),
        ...tx,
      });

      // Calculate total fee
      const fee = gasLimit * gasPrice.gasPrice;
      const formatted = this.formatTokenBalance(
        fee.toString(),
        this.network.nativeCurrency.decimals
      );

      return {
        fee: fee.toString(),
        formatted,
        currency: this.network.nativeCurrency.symbol,
      };
    } catch (error) {
      console.error('Failed to estimate fee:', error);
      throw new Error(`Failed to estimate fee: ${error}`);
    }
  }

  /**
   * Export the public key for the current EVM account
   */
  async exportPublicKey(): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }
    // ethers.js does not expose public key directly, but you can recover it from a signature
    // Here, we use the public address as the public identifier
    return await this.signer.getAddress();
  }

  /**
   * Export the private key for the current EVM account (use with extreme caution)
   */
  async exportPrivateKey(): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }
    // Only available if signer is a Wallet instance
    if (typeof (this.signer as any).privateKey === 'string') {
      return (this.signer as any).privateKey;
    }
    throw new Error('Private key export not supported for this signer');
  }
}
