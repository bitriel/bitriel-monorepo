import React, { createContext, ReactNode, useContext, useState, useCallback } from 'react';

import {
  SavedCard,
  MOCK_SAVED_CARDS,
  MOCK_USER_BALANCE,
  UserBalance,
  Transaction,
  MOCK_TRANSACTIONS,
  EXCHANGE_RATES,
} from '@/services/mockData';

export interface PaymentData {
  amount: number; // in USD
  amountKHR: number;
  paymentMethod: 'credit-card' | 'bank-transfer' | 'crypto' | 'bakong' | null;
  selectedCard: SavedCard | null;
  cryptoType?: string;
  bankDetails?: any;
}

interface PaymentContextType {
  // Payment flow state
  paymentData: PaymentData;
  setPaymentAmount: (amount: number) => void;
  setPaymentMethod: (method: PaymentData['paymentMethod']) => void;
  selectCard: (card: SavedCard) => void;
  resetPayment: () => void;

  // Card management
  savedCards: SavedCard[];
  addCard: (card: Omit<SavedCard, 'id'>) => void;
  removeCard: (cardId: string) => void;
  setDefaultCard: (cardId: string) => void;

  // Balance management
  balance: UserBalance;
  addFunds: (amount: number, method: string, cardId?: string) => void;

  // Transaction history
  transactions: Transaction[];

  // UI state
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

const initialPaymentData: PaymentData = {
  amount: 0,
  amountKHR: 0,
  paymentMethod: null,
  selectedCard: null,
};

export const PaymentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [paymentData, setPaymentData] = useState<PaymentData>(initialPaymentData);
  const [savedCards, setSavedCards] = useState<SavedCard[]>(MOCK_SAVED_CARDS);
  const [balance, setBalance] = useState<UserBalance>(MOCK_USER_BALANCE);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [isProcessing, setIsProcessing] = useState(false);

  const setPaymentAmount = useCallback((amount: number) => {
    setPaymentData((prev) => ({
      ...prev,
      amount,
      amountKHR: amount * EXCHANGE_RATES.USD_TO_KHR,
    }));
  }, []);

  const setPaymentMethod = useCallback((method: PaymentData['paymentMethod']) => {
    setPaymentData((prev) => ({
      ...prev,
      paymentMethod: method,
    }));
  }, []);

  const selectCard = useCallback((card: SavedCard) => {
    setPaymentData((prev) => ({
      ...prev,
      selectedCard: card,
    }));
  }, []);

  const resetPayment = useCallback(() => {
    setPaymentData(initialPaymentData);
  }, []);

  const addCard = useCallback(
    (card: Omit<SavedCard, 'id'>) => {
      const newCard: SavedCard = {
        ...card,
        id: `card_${Date.now()}`,
      };

      // If this is the first card or marked as default, make it default
      if (savedCards.length === 0 || card.isDefault) {
        setSavedCards((prev) => prev.map((c) => ({ ...c, isDefault: false })).concat(newCard));
      } else {
        setSavedCards((prev) => [...prev, newCard]);
      }
    },
    [savedCards]
  );

  const removeCard = useCallback((cardId: string) => {
    setSavedCards((prev) => {
      const filtered = prev.filter((card) => card.id !== cardId);
      // If we removed the default card, make the first remaining card default
      if (filtered.length > 0 && !filtered.some((card) => card.isDefault)) {
        filtered[0].isDefault = true;
      }
      return filtered;
    });
  }, []);

  const setDefaultCard = useCallback((cardId: string) => {
    setSavedCards((prev) =>
      prev.map((card) => ({
        ...card,
        isDefault: card.id === cardId,
      }))
    );
  }, []);

  const addFunds = useCallback(
    (amount: number, method: string, cardId?: string) => {
      const amountKHR = amount * EXCHANGE_RATES.USD_TO_KHR;

      // Update balance
      setBalance((prev) => ({
        khr: prev.khr + amountKHR,
        usd: prev.usd + amount,
      }));

      // Find card details if cardId provided
      const card = cardId ? savedCards.find((c) => c.id === cardId) : null;
      const paymentMethodText = card ? `${card.type} •••• ${card.last4}` : method;

      // Add transaction
      const newTransaction: Transaction = {
        id: `txn_${Date.now()}`,
        type: 'add_funds',
        amount: amountKHR,
        currency: 'KHR',
        status: 'completed',
        date: new Date().toISOString(),
        description: `Added funds via ${method}`,
        paymentMethod: paymentMethodText,
      };

      setTransactions((prev) => [newTransaction, ...prev]);
    },
    [savedCards]
  );

  return (
    <PaymentContext.Provider
      value={{
        paymentData,
        setPaymentAmount,
        setPaymentMethod,
        selectCard,
        resetPayment,
        savedCards,
        addCard,
        removeCard,
        setDefaultCard,
        balance,
        addFunds,
        transactions,
        isProcessing,
        setIsProcessing,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = (): PaymentContextType => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};
