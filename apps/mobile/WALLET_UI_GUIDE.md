# Mobile Wallet UI - Fuse-Inspired Design

## Overview

A modern, tourist-focused mobile wallet UI inspired by [Fuse Wallet](https://fusewallet.com), built with React Native, Expo Router, and NativeWindUI components.

**Slogan:** "Spend like a local"  
**Target Audience:** Tourists  
**Goal:** A super app ecosystem with payment at its core, including e-commerce, ticketing, and local experiences.

## 🎨 Design Philosophy

The design takes inspiration from Fuse Wallet's clean, modern interface while adapting it for tourist-specific use cases:

- **Modern Card UI**: Beautiful gradient virtual card display
- **Quick Actions**: Fast access to Send, Receive, Buy, and Swap
- **Tourist Services**: Integrated shopping, dining, tickets, and experiences
- **Rewards System**: Cashback and earning opportunities
- **Enterprise Security**: Trust-building features and security highlights

## 📱 Screens & Features

### 1. Main Wallet Screen (`/wallet`)

**Key Components:**
- **Hero Section**
  - Total balance display with animated entrance
  - Growth percentage indicator (+12.5%)
  - Quick access to transaction history

- **Quick Action Buttons**
  - Send (Blue - #0385FF)
  - Receive (Green - #00C853)
  - Buy (Red - #FF3B57)
  - Swap (Orange - #FF9500)

- **Virtual Card Display**
  - Gradient background (adapts to dark/light mode)
  - Masked card number (•••• •••• •••• 4829)
  - Cardholder name and expiry date
  - VISA branding

- **"Spend like a local" Banner**
  - Gradient background with globe icon
  - Clear value proposition for tourists

- **Tourist Services Grid**
  - Shopping (Local markets & stores)
  - Tickets (Tours & attractions)
  - Dining (Restaurants & cafes)
  - Experiences (Local activities)
  - Each card is interactive with haptic feedback

- **Earn Rewards Section**
  - Highlighted cashback percentage (Up to 5%)
  - Call-to-action button

- **Why Choose Us Features**
  - Secure & Safe
  - Zero Fees
  - Global Access
  - Smart Rewards

### 2. Transactions Screen (`/(wallet)/transactions`)

**Features:**
- Transaction list with category icons
- Color-coded transaction types:
  - Payments (negative amounts)
  - Received funds (positive, green)
  - Cashback rewards (gold star icon)
- Each transaction shows:
  - Icon and category
  - Description
  - Date
  - Amount

**Sample Transactions:**
- Local Restaurant (-$45.32)
- Received from user (+$120.00)
- Tour Booking (-$89.99)
- Shopping (-$23.45)
- Cashback Reward (+$12.50)

### 3. Services Screen (`/(wallet)/services`)

**Service Categories:**

1. **Shopping**
   - Local Markets
   - Fashion Stores
   - Souvenirs

2. **Tours & Tickets**
   - City Tours
   - Museums
   - Theme Parks

3. **Dining**
   - Local Cuisine
   - Fine Dining
   - Street Food

4. **Transportation**
   - Ride Sharing
   - Car Rental
   - Public Transit

5. **Accommodation**
   - Hotels
   - Hostels
   - Vacation Rentals

## 🎯 Navigation Flow

```
Home (index.tsx)
  └─> "Open Wallet" Button
       └─> Wallet Home (/wallet)
            ├─> Transactions Button (top right)
            │    └─> Transactions Screen (/(wallet)/transactions)
            │
            └─> "See All" Button / Service Cards
                 └─> Services Screen (/(wallet)/services)
```

## 🎨 Color Palette

The app uses a carefully selected color palette matching different service categories:

- **Primary Blue**: #0385FF (Send, Primary actions)
- **Success Green**: #00C853 (Receive, Positive amounts)
- **Alert Red**: #FF3B57 (Buy, Shopping)
- **Warning Orange**: #FF9500 (Swap, Dining)
- **Purple**: #8E44AD (Experiences)
- **Gold**: #FFD700 (Rewards)

## ⚡ Animations & Interactions

- **Smooth Entrance Animations**: Using `react-native-reanimated`
  - FadeIn for hero section
  - Staggered FadeInDown for cards (100ms delays)
  
- **Haptic Feedback**: Every button press provides tactile feedback
  - Light impact for most interactions
  - Enhances the premium feel

## 🏗️ Technical Stack

- **Framework**: React Native with Expo (SDK ~54)
- **Routing**: Expo Router 6 (file-based routing)
- **UI Library**: NativeWindUI (Tailwind CSS for React Native)
- **Styling**: Tailwind CSS via NativeWind 4
- **Animations**: React Native Reanimated 4
- **Icons**: SF Symbols (iOS native icons)

## 📂 File Structure

```
apps/mobile/app/
├── _layout.tsx                 # Root layout with navigation
├── index.tsx                   # Home screen (component showcase)
├── wallet.tsx                  # Main wallet screen
├── (wallet)/                   # Wallet feature group
│   ├── _layout.tsx            # Wallet stack navigator
│   ├── transactions.tsx       # Transaction history
│   └── services.tsx           # All tourist services
└── modal.tsx                   # Settings modal
```

## 🚀 Getting Started

### Run the app:

```bash
# Start the development server
pnpm dev:mobile

# Run on iOS
pnpm --filter @bitriel/mobile ios

# Run on Android
pnpm --filter @bitriel/mobile android
```

### Navigate to the wallet:

1. App starts on the home screen (component showcase)
2. Tap the "Open Wallet" button at the top
3. Explore the wallet features, services, and transactions

## 🎯 Future Enhancements

**Suggested additions to match Fuse Wallet's feature set:**

1. **Staking & Yield**
   - Add staking interface for SOL/tokens
   - Display APY and earned rewards
   - Integration with DeFi protocols

2. **Swap Integration**
   - Jupiter DEX integration (Solana)
   - Real-time token prices
   - Zero-fee swap execution

3. **Multi-Currency Support**
   - Multiple stablecoins (USDC, USDT)
   - Crypto assets (SOL, BTC, ETH)
   - Traditional currency display

4. **Real Payment Integration**
   - Bridge API for card issuance
   - KYC/verification flow
   - Real transaction processing

5. **Location-Based Services**
   - Nearby restaurants, shops, attractions
   - AR navigation
   - Local deals and offers

6. **Social Features**
   - Split bills with friends
   - Group expenses for trips
   - Travel planning

7. **Advanced Security**
   - Biometric authentication
   - Multi-signature support
   - Smart account features

## 🎨 Design Inspiration Sources

Inspired by **Fuse Wallet** (https://fusewallet.com):
- Clean, minimal interface
- Card-centric design
- Feature highlights with icons
- Modern gradient usage
- Clear call-to-actions
- Security emphasis

Adapted for tourist use case:
- Added local service categories
- Travel-focused features
- "Spend like a local" messaging
- Tourist service integrations

## 📝 Notes

- All screens include proper safe area handling
- Dark mode support throughout
- Responsive design for various screen sizes
- Accessibility considerations with proper text variants
- No external API calls yet (using mock data)

---

**Built for Bitriel** - Making tourist spending seamless and local  
**Status**: UI Complete ✅ | Backend Integration Pending 🔄

