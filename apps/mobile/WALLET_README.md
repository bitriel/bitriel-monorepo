# Wallet Page

## Overview

A cryptocurrency wallet interface for the Bitriel mobile app, built with Expo and React Native.

## Features

### Wallet Home Screen (`app/(tabs)/wallet.tsx`)

- **Header**:
  - User domain display (ifeanyiachi.nimbus.com) with dropdown
  - QR code scanner icon
  - Support/headphones icon
- **Balance Display**:
  - Total asset balance: $8,840.28
  - Large, prominent display
- **Action Buttons** (5 circular buttons):
  1. **Buy** - Purchase crypto assets
  2. **Send** - Transfer assets to others
  3. **Exchange** - Swap between cryptocurrencies
  4. **Receive** - Get assets from others
  5. **Withdraw** - Transfer to bank account
- **My Assets List**:
  - USDT (Tether) - $1,723.56
  - SOL (Solana) - $2,401.89
  - TON (Toncoin) - $1,586.24
  - ETH (Ethereum) - $2,123.78
  - BTC (Bitcoin) - $1,005.81
- **Manage Assets Button**:
  - Bottom action to add/remove displayed assets

### Navigation Tabs (`app/(tabs)/_layout.tsx`)

Bottom tab navigation with 5 screens:

1. **Wallet** - Main wallet view (active)
2. **History** - Transaction history
3. **Stake** - Staking interface
4. **Card** - Card management
5. **Discover** - Discovery/explore features

## Design Features

- Dark/Light mode support via `useColorScheme`
- Haptic feedback on button presses
- Smooth animations and transitions
- iOS SF Symbols icons
- NativewindUI components for consistent styling
- Safe area insets for notched devices

## Asset Card Component

Each asset displays:

- Icon (emoji for now, can be replaced with actual crypto icons)
- Name and symbol
- Current price
- 24h change percentage (color-coded: green for up, red for down)
- Balance in USD
- Balance in asset units

## Styling

- Uses Tailwind CSS classes via NativeWind
- Theme-aware colors from `@/theme/colors`
- Responsive design with proper padding and spacing
- Rounded corners (rounded-2xl for cards, rounded-full for buttons)

## To-Do / Future Enhancements

- [ ] Connect to real cryptocurrency API for live prices
- [ ] Implement actual wallet functionality (buy, send, receive, etc.)
- [ ] Add pull-to-refresh for balance updates
- [ ] Implement History, Stake, Card, and Discover screens
- [ ] Add animations for asset list
- [ ] Replace emoji icons with actual crypto logos
- [ ] Add asset search/filter functionality
- [ ] Implement multi-wallet support
- [ ] Add security features (biometric auth, pin)

## Running the App

```bash
# Start the development server
pnpm dev

# Run on iOS
pnpm ios

# Run on Android
pnpm android
```

## Dependencies

- expo-router - File-based routing
- react-native-safe-area-context - Safe area handling
- expo-haptics - Haptic feedback
- nativewind - Tailwind CSS for React Native
- @react-navigation/bottom-tabs - Tab navigation
