# Receive Flow Documentation

## 📱 Screens Overview

The receive flow consists of 4 screens that allow users to receive cryptocurrency payments:

### 1. Receive Crypto List (`(routes)/receive/index.tsx`)

**Purpose**: Select which cryptocurrency to receive

**Features**:

- Search bar to filter cryptocurrencies
- Main domain address card (ifeanyiachi.nimbus.com)
- List of crypto addresses (USDT, SOL, TON, ETH, BTC)
- Each card shows:
  - Asset icon
  - Asset name
  - Shortened address
  - QR code button
  - Copy button
- "Receive other assets" option at bottom

**Actions**:

- Tap asset → Navigate to address screen
- Tap QR icon → Navigate to address screen
- Tap copy icon → Copy address to clipboard
- Search → Filter displayed assets

---

### 2. Receive Address/QR Screen (`(routes)/receive/address.tsx`)

**Purpose**: Display address and QR code for receiving

**Features**:

- Asset icon at top
- Warning text: "Only send {asset} network tokens to this address"
- Full address with copy button
- QR code display (placeholder for now - needs react-native-qrcode-svg)
- Two action buttons:
  - Request button (opens request amount screen)
  - Share button (shares address)

**Flow**:

- From receive list → Shows address/QR
- Tap Request → Go to request amount screen
- Tap Share → Native share sheet

---

### 3. Request Amount Screen (`(routes)/receive/request.tsx`)

**Purpose**: Specify amount to request

**Features**:

- Large amount display in USD (orange)
- Crypto equivalent below (e.g., "0.00097 SOL")
- Currency swap button
- Asset selector (shows current asset with chevron)
- Custom numpad (0-9, backspace)
- Orange "Confirm" button

**Calculations**:

- Real-time USD ↔ SOL conversion
- Uses hardcoded SOL price: $138.52 (should use API)
- Updates crypto amount as user types

---

### 4. Share Request Screen (`(routes)/receive/share.tsx`)

**Purpose**: Share payment request with QR code

**Features**:

- Asset icon
- Warning text
- Full address with copy button
- QR code (placeholder)
- Amount display:
  - Crypto amount (e.g., "249 SOL")
  - USD equivalent below
- Share button

**Share Message**:

```
Send me {amount} {symbol} ({usd} USD) to:
{address}
```

---

## 🔗 Navigation Flow

```
Wallet Screen
    ↓ (Tap "Receive")
Receive Crypto List
    ↓ (Select asset)
Receive Address/QR
    ↓ (Tap "Request")
Request Amount
    ↓ (Enter amount & Confirm)
Share Request
    ↓ (Share or Back to wallet)
```

## 📋 File Structure

```
app/(routes)/receive/
├── index.tsx      # Crypto list
├── address.tsx    # Address/QR display
├── request.tsx    # Amount input
└── share.tsx      # Share with amount
```

## 🎯 User Journeys

### Journey 1: Simple Receive

1. User taps "Receive" button
2. Selects "SOL address"
3. Views QR code
4. Taps "Share" to send address

### Journey 2: Request Specific Amount

1. User taps "Receive" button
2. Selects "SOL address"
3. Taps "Request" button
4. Enters amount (e.g., $6745)
5. Taps "Confirm"
6. Shares QR code with amount

## 🎨 Key Features

### Search Functionality

- Filters by asset name or symbol
- Case-insensitive search
- Shows "No results" if no matches

### Copy to Clipboard

- Native Clipboard API
- Shows alert confirmation
- Works on all address cards

### Share Functionality

- Native Share API
- Shares address text
- Can share with or without amount

### Mock Data

Currently using hardcoded data:

```tsx
CRYPTO_ADDRESSES = [
  { name: 'ifeanyiachi.nimbus.com', symbol: 'DOMAIN', ... },
  { name: 'USDT address', symbol: 'USDT', ... },
  { name: 'SOL address', symbol: 'SOL', ... },
  { name: 'Ton address', symbol: 'TON', ... },
  { name: 'Ethereum address', symbol: 'ETH', ... },
  { name: 'Bitcoin address', symbol: 'BTC', ... },
]
```

## 🔧 Technical Details

### Navigation Paths

```tsx
// Wallet → Receive list
router.push('/(routes)/receive');

// List → Address/QR
router.push({
  pathname: '/(routes)/receive/address',
  params: { symbol, name, address, icon },
});

// Address → Request amount
router.push({
  pathname: '/(routes)/receive/request',
  params: { symbol, name, address, icon },
});

// Request → Share
router.push({
  pathname: '/(routes)/receive/share',
  params: { symbol, icon, address, amount, solValue },
});
```

### Parameters Passed

**To address.tsx**:

- `symbol`: Asset symbol (e.g., "SOL")
- `name`: Display name
- `address`: Wallet address
- `icon`: Emoji icon

**To request.tsx**:

- Same as address.tsx

**To share.tsx**:

- All from request.tsx, plus:
- `amount`: USD amount
- `solValue`: Crypto amount

## 📝 TODO / Improvements

### High Priority

- [ ] **Install QR Code Library**: `react-native-qrcode-svg`
  ```bash
  npm install react-native-qrcode-svg react-native-svg
  ```
- [ ] **Real Price API**: Replace hardcoded SOL price
- [ ] **Real Addresses**: Connect to actual wallet
- [ ] **Address Validation**: Verify address format

### Medium Priority

- [ ] **Recent Addresses**: Show recently used addresses
- [ ] **Favorites**: Star/favorite addresses
- [ ] **Address Book**: Full contact management
- [ ] **Multiple Networks**: Support different networks per asset
- [ ] **Network Selection**: Choose network (e.g., ERC-20, BEP-20)

### Low Priority

- [ ] **Amount Presets**: Quick amount buttons ($10, $50, $100)
- [ ] **Currency Swap**: Actually implement USD ↔ Crypto toggle
- [ ] **Share to Specific Apps**: WhatsApp, Telegram, etc.
- [ ] **NFC Support**: Tap to share address
- [ ] **Analytics**: Track receive requests

## 🎨 UI/UX Features

### Haptic Feedback

- Light impact on button taps
- Medium impact on navigation
- Used throughout for tactile feedback

### Theme Support

- Full dark/light mode support
- Uses theme colors from context
- Adapts status bar style

### Animations

- Smooth screen transitions
- Button press animations
- Modal presentations

## 🐛 Known Issues

1. **QR Code**: Currently placeholder (needs library)
2. **Price Data**: Hardcoded at $138.52/SOL
3. **Address Format**: No validation
4. **Network Support**: Single network only

## 🚀 Integration Points

### To Connect with Real Wallet:

1. Replace `CRYPTO_ADDRESSES` with wallet data
2. Connect to price API for real-time rates
3. Implement address generation per network
4. Add QR code library for actual codes
5. Store received transaction history

### Example Wallet Integration:

```tsx
// Get user's wallet addresses
const addresses = await wallet.getAddresses();

// Get real-time price
const solPrice = await priceApi.getPrice('SOL');

// Generate QR code
<QRCode value={address} size={200} />;
```

---

**The receive flow is now complete and ready for testing!** 🎉

## 📱 Testing Flow

1. Open app → Tap "Receive" button
2. See crypto list → Search for "SOL"
3. Tap "SOL address" → View QR code
4. Tap "Request" → Enter amount
5. Tap "Confirm" → See shareable QR with amount
6. Tap "Share" → Choose sharing method

All screens have proper navigation, haptic feedback, and theme support!
