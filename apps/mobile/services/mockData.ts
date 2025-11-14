/**
 * Mock Data Service
 * Provides realistic mock data for development and prototyping
 */

export interface SavedCard {
  id: string;
  type: 'VISA' | 'MASTERCARD' | 'AMEX';
  last4: string;
  expiryDate: string;
  cardholderName: string;
  isDefault: boolean;
  color: string;
  // Full card details (normally encrypted in production)
  fullNumber?: string;
}

export interface Transaction {
  id: string;
  type: 'add_funds' | 'send' | 'receive' | 'payment';
  amount: number;
  currency: 'KHR' | 'USD';
  status: 'completed' | 'pending' | 'failed';
  date: string;
  description: string;
  recipient?: string;
  paymentMethod?: string;
}

export interface UserBalance {
  khr: number;
  usd: number;
}

// Mock saved cards
export const MOCK_SAVED_CARDS: SavedCard[] = [
  {
    id: 'card_1',
    type: 'VISA',
    last4: '4242',
    expiryDate: '12/25',
    cardholderName: 'John Doe',
    isDefault: true,
    color: '#0385FF',
    fullNumber: '4242 4242 4242 4242',
  },
  {
    id: 'card_2',
    type: 'MASTERCARD',
    last4: '5555',
    expiryDate: '08/26',
    cardholderName: 'John Doe',
    isDefault: false,
    color: '#FF9500',
    fullNumber: '5555 5555 5555 4444',
  },
  {
    id: 'card_3',
    type: 'AMEX',
    last4: '1005',
    expiryDate: '03/27',
    cardholderName: 'John Doe',
    isDefault: false,
    color: '#006FCF',
    fullNumber: '3782 822463 10005',
  },
];

// Mock transaction history
export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn_1',
    type: 'add_funds',
    amount: 202500,
    currency: 'KHR',
    status: 'completed',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    description: 'Added funds via Credit Card',
    paymentMethod: 'VISA •••• 4242',
  },
  {
    id: 'txn_2',
    type: 'send',
    amount: -81000,
    currency: 'KHR',
    status: 'completed',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    description: 'Sent to friend',
    recipient: 'Alice Johnson',
  },
  {
    id: 'txn_3',
    type: 'receive',
    amount: 405000,
    currency: 'KHR',
    status: 'completed',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    description: 'Received from Bob Smith',
    recipient: 'Bob Smith',
  },
  {
    id: 'txn_4',
    type: 'payment',
    amount: -121500,
    currency: 'KHR',
    status: 'completed',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    description: 'Coffee Shop Payment',
  },
  {
    id: 'txn_5',
    type: 'add_funds',
    amount: 810000,
    currency: 'KHR',
    status: 'completed',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    description: 'Added funds via Bank Transfer',
    paymentMethod: 'Bank Transfer',
  },
];

// Mock user balance
export const MOCK_USER_BALANCE: UserBalance = {
  khr: 123456789, // ≈ $30,482 USD
  usd: 30482,
};

// Exchange rates
export const EXCHANGE_RATES = {
  USD_TO_KHR: 4050,
  KHR_TO_USD: 1 / 4050,
};

// Payment method configuration
export const PAYMENT_METHODS = [
  {
    id: 'credit-card',
    title: 'Credit/Debit Card',
    subtitle: 'Add funds instantly',
    color: '#0385FF',
    processingTime: 'Instant',
    fee: 'Free',
  },
  {
    id: 'bank-transfer',
    title: 'Bank Transfer',
    subtitle: 'Link your bank account',
    color: '#00C853',
    processingTime: '1-2 business days',
    fee: 'Free',
  },
  {
    id: 'crypto',
    title: 'Cryptocurrency',
    subtitle: 'Pay with crypto',
    color: '#FF9500',
    processingTime: '10-30 minutes',
    fee: 'Network fee applies',
  },
  {
    id: 'bakong',
    title: 'Bakong QR',
    subtitle: 'Scan to pay via Bakong',
    color: '#8E44AD',
    processingTime: 'Instant',
    fee: 'Free',
  },
];

// Quick amount presets (in USD)
export const QUICK_AMOUNTS = [10, 20, 50, 100, 200, 500];

// Crypto options
export const CRYPTO_OPTIONS = [
  {
    id: 'usdc',
    name: 'USD Coin',
    symbol: 'USDC',
    network: 'Solana',
    icon: '💵',
    exchangeRate: 4050, // 1 USDC = 4,050 KHR
  },
  {
    id: 'usdt',
    name: 'Tether',
    symbol: 'USDT',
    network: 'Solana',
    icon: '💲',
    exchangeRate: 4050, // 1 USDT = 4,050 KHR
  },
  {
    id: 'sol',
    name: 'Solana',
    symbol: 'SOL',
    network: 'Solana',
    icon: '◎',
    exchangeRate: 567000, // 1 SOL = 567,000 KHR ($140)
  },
  {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    network: 'Bitcoin',
    icon: '₿',
    exchangeRate: 283500000, // 1 BTC = 283,500,000 KHR ($70,000)
  },
];

// Helper functions
export const formatCurrency = (amount: number, currency: 'KHR' | 'USD'): string => {
  if (currency === 'KHR') {
    return `${amount.toLocaleString('en-US')} KHR`;
  }
  return `$${amount.toFixed(2)} USD`;
};

export const convertCurrency = (
  amount: number,
  from: 'KHR' | 'USD',
  to: 'KHR' | 'USD'
): number => {
  if (from === to) return amount;
  if (from === 'USD') return amount * EXCHANGE_RATES.USD_TO_KHR;
  return amount * EXCHANGE_RATES.KHR_TO_USD;
};

export const formatCardNumber = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\s/g, '');
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(' ') : cardNumber;
};

export const getCardType = (cardNumber: string): 'VISA' | 'MASTERCARD' | 'AMEX' | 'UNKNOWN' => {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (cleaned.startsWith('4')) return 'VISA';
  if (cleaned.startsWith('5')) return 'MASTERCARD';
  if (cleaned.startsWith('3')) return 'AMEX';
  return 'UNKNOWN';
};

// Loyalty Program Merchants
export interface LoyaltyMerchant {
  id: string;
  name: string;
  logo: string;
  logoType: 'image' | 'emoji';
  points: number;
  color: string;
  type: 'merchant';
  description?: string;
  category?: string;
}

export const LOYALTY_MERCHANTS: LoyaltyMerchant[] = [
  {
    id: '1',
    name: 'Brown Coffee',
    logo: 'https://www.techoairport.com.kh/tia-backend/locators/1753854813934-Logo-md.jpg',
    logoType: 'image',
    points: 20,
    color: '#8B4513',
    type: 'merchant',
    description: 'Premium coffee and beverages',
    category: 'Food & Beverage',
  },
  {
    id: '2',
    name: 'Zando Fashion',
    logo: 'https://cdn.brandfetch.io/zandokh.com/fallback/lettermark/theme/dark/h/256/w/256/icon?c=1bfwsmEH20zzEfSNTed',
    logoType: 'image',
    points: 10,
    color: '#E91E63',
    type: 'merchant',
    description: 'Fashion and lifestyle',
    category: 'Fashion',
  },
  {
    id: '3',
    name: 'Lucky Supermarket',
    logo: 'https://www.dfilucky.com/logo.png',
    logoType: 'image',
    points: 15,
    color: '#4CAF50',
    type: 'merchant',
    description: 'Groceries and daily essentials',
    category: 'Retail',
  },
  {
    id: '4',
    name: 'CPL Star',
    logo: 'https://cpl.stadiumx.asia/_next/image?url=https%3A%2F%2Fgateway.stadiumx.asia%2Ffile-1753803773251-74490209.png&w=128&q=75',
    logoType: 'image',
    points: 12,
    color: '#9C27B0',
    type: 'merchant',
    description: 'Cinema and entertainment',
    category: 'Entertainment',
  },
];
