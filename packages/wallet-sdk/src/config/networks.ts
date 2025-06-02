import { ChainProperties } from '@polkadot/types/interfaces';

export interface NetworkConfig {
  name: string;
  chainId: string | number;
  rpcUrl: string;
  explorerUrl: string;
  logo?: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
    logoURI?: string;
  };
  tokens?: TokenConfig[];
}

export interface TokenConfig {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
}

export interface SubstrateNetworkConfig extends NetworkConfig {
  type: 'substrate';
  properties?: ChainProperties;
  // Additional Substrate-specific configurations
  ss58Format?: number;
  genesisHash?: string;
}

export interface EVMNetworkConfig extends NetworkConfig {
  type: 'evm';
}

export const SUBSTRATE_NETWORKS: SubstrateNetworkConfig[] = [
  {
    type: 'substrate',
    name: 'Selendra',
    chainId: '0x0000000000000000000000000000000000000000000000000000000000000003',
    rpcUrl: 'wss://rpc.selendra.org',
    explorerUrl: 'https://selendra.subscan.io',
    logo: 'https://www.selendra.org/logo/sel-logo-blue-notext.png',
    nativeCurrency: {
      name: 'Selendra',
      symbol: 'SEL',
      decimals: 18,
      logoURI: 'https://www.selendra.org/logo/sel-logo-blue-notext.png',
    },
    ss58Format: 42,
    genesisHash: '0x9e17c622381c36351de3ff9dc662282bf89ea2f420a9c55e23ff4fd815d2886a', // Replace with actual genesis hash
  },
  // {
  //     type: "substrate",
  //     name: "Polkadot",
  //     chainId:
  //         "0x0000000000000000000000000000000000000000000000000000000000000000",
  //     rpcUrl: "wss://rpc.polkadot.io",
  //     explorerUrl: "https://polkadot.subscan.io",
  //     logo: "https://cryptologos.cc/logos/polkadot-new-dot-logo.svg?v=040",
  //     nativeCurrency: {
  //         name: "Polkadot",
  //         symbol: "DOT",
  //         decimals: 10,
  //     },
  //     ss58Format: 0,
  //     genesisHash:
  //         "0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3",
  // },
  // {
  //     type: "substrate",
  //     name: "Kusama",
  //     chainId:
  //         "0x0000000000000000000000000000000000000000000000000000000000000002",
  //     rpcUrl: "wss://kusama-rpc.polkadot.io",
  //     explorerUrl: "https://kusama.subscan.io",
  //     logo: "https://raw.githubusercontent.com/polkadot-js/apps/master/packages/apps/public/kusama_circle.svg",
  //     nativeCurrency: {
  //         name: "Kusama",
  //         symbol: "KSM",
  //         decimals: 12,
  //     },
  //     ss58Format: 2,
  //     genesisHash:
  //         "0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe",
  // },
];

export const EVM_NETWORKS: EVMNetworkConfig[] = [
  {
    type: 'evm',
    name: 'Selendra Mainnet',
    chainId: 1961,
    rpcUrl: 'https://rpc.selendra.org',
    explorerUrl: 'http://explorer.selendra.org/',
    logo: 'https://www.selendra.org/logo/sel-logo-blue-notext.png',
    nativeCurrency: {
      name: 'Selendra',
      symbol: 'SEL',
      decimals: 18,
      logoURI: 'https://www.selendra.org/logo/sel-logo-blue-notext.png',
    },
    tokens: [
      {
        address: '0x2402Ed00D1223500bA3B45fa30549Be28Dbe50B3',
        name: 'SAM Token',
        symbol: 'SAM',
        decimals: 18,
        logoURI: 'https://selendra.org/tokens/sam.png',
      },
      {
        address: '0xffFEdB07dbc5A93A3c7653930e46Bd9332468559',
        name: 'KHR Stable',
        symbol: 'KHR',
        decimals: 18,
        logoURI: 'https://selendra.org/tokens/khr.png',
      },
    ],
  },
  {
    type: 'evm',
    name: 'Ethereum Mainnet',
    chainId: 1,
    rpcUrl: 'https://eth.public-rpc.com',
    explorerUrl: 'https://etherscan.io',
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=040',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=040',
    },
    tokens: [
      {
        address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        name: 'Tether USD',
        symbol: 'USDT',
        decimals: 6,
        logoURI: 'https://cryptologos.cc/logos/tether-usdt-logo.svg?v=040',
      },
      {
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
        logoURI: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=040',
      },
    ],
  },
  {
    type: 'evm',
    name: 'Polygon Mainnet',
    chainId: 137,
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
    logo: 'https://cryptologos.cc/logos/polygon-matic-logo.svg?v=040',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
      logoURI: 'https://cryptologos.cc/logos/polygon-matic-logo.svg?v=040',
    },
    tokens: [
      {
        address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        name: 'Tether USD',
        symbol: 'USDT',
        decimals: 6,
        logoURI: 'https://cryptologos.cc/logos/tether-usdt-logo.svg?v=040',
      },
      {
        address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
        logoURI: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=040',
      },
    ],
  },
];

export const SUPPORTED_NETWORKS = [...SUBSTRATE_NETWORKS, ...EVM_NETWORKS];
