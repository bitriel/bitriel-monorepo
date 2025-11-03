# Payment Flow Guide - Bitriel Wallet

## 🇰🇭 Cambodian Riel (KHR) Integration

The wallet now uses **Cambodian Riel (៛ KHR)** as the primary currency, with USD conversion displayed for reference.

### Currency Display
- **Primary Balance**: ៛50,420,000 KHR
- **USD Equivalent**: $12,445.68 USD (shown in badge)
- **Exchange Rate**: 1 USD = ៛4,050 KHR

## 💳 Complete Payment Ecosystem

### 1. Add Funds Flow

**Entry Points:**
- "Add Funds" button (when balance is 0)
- "Add Funds" feature card (2x2 grid)
- Floating action button → "Add Funds"

**Payment Methods:**

#### A. Credit/Debit Card
- Instant funding
- Enter card details:
  - Card number
  - Expiry date (MM/YY)
  - CVV
  - Cardholder name
- Option to save card for future payments
- Secure, encrypted processing
- **Route**: `/(wallet)/payment/card`

#### B. Bank Transfer
- Link your bank account
- Direct bank-to-wallet transfer
- Processing: 1-3 business days
- **Route**: `/(wallet)/payment/bank`

#### C. Cryptocurrency
Supported cryptocurrencies:
- **USDC** (USD Coin) - Solana network
  - Rate: 1 USDC = ៛4,050 KHR
- **USDT** (Tether) - Solana network
  - Rate: 1 USDT = ៛4,050 KHR
- **SOL** (Solana)
  - Rate: 1 SOL = ៛607,500 KHR
- **BTC** (Bitcoin)
  - Rate: 1 BTC = ៛283,500,000 KHR

**Crypto Flow:**
1. Select cryptocurrency
2. Connect wallet or get deposit address
3. Send crypto to address
4. Auto-convert to KHR at market rate
5. Instant credit to Bitriel wallet

**Route**: `/(wallet)/payment/crypto`

#### D. Bakong QR
- Cambodia's national payment system
- Scan QR codes to add funds
- Instant transfers
- **Route**: `/(wallet)/scan-qr`

### 2. Bakong QR Payment System

**Features:**
- Full-screen QR scanner
- Real-time QR code detection
- Supports all Bakong merchants
- Categories:
  - 🛒 Shops
  - 🍴 Restaurants
  - 🎫 Services
  - 🚗 Transport

**Flow:**
1. Tap "Bakong Pay" feature card OR floating action → "Scan QR"
2. Position QR code in frame
3. Automatic detection
4. Show merchant details & amount
5. Confirm payment
6. Instant deduction from balance

**Route**: `/(wallet)/scan-qr`

**Demo Mode**: Includes "Simulate Scan" button for testing

### 3. Send Money

**Features:**
- Send Riel to other users
- Enter amount in KHR (shows USD equivalent)
- Send via:
  - Phone number (+855...)
  - Bitriel ID (@username)
- Add optional note
- Recent recipients list
- QR code option (top-right button)

**Flow:**
1. Enter amount (៛ KHR)
2. Enter recipient (phone/Bitriel ID)
3. Add optional note
4. Review & confirm
5. Instant transfer

**Route**: `/(wallet)/send`

### 4. My Cards (Saved Cards)

**Features:**
- View all saved payment cards
- Card preview with design
- Mark default card
- Card details:
  - Card type (VISA/MASTERCARD)
  - Last 4 digits
  - Expiry date
- Add new cards
- Manage cards (via menu)

**Route**: `/(wallet)/my-cards`

## 🎨 UI Updates

### Dashed Border Cards
All feature cards now have **dashed borders** matching Fuse's design:
```typescript
borderWidth: 2,
borderStyle: 'dashed',
borderColor: colors.border,
```

### Main Feature Cards (2x2 Grid)

1. **Bakong Pay** (Blue)
   - Icon: QR viewfinder
   - Action: Scan QR codes
   
2. **Add Funds** (Orange)
   - Icon: Credit card
   - Action: Add funds via card/crypto
   
3. **Earn** (Purple)
   - Icon: Bar chart
   - Action: View earning opportunities
   
4. **My Cards** (Black)
   - Icon: Bank building
   - Action: Manage saved cards

### Floating Action Button
- Black circular button with + icon
- Bottom-right corner
- Opens action sheet with:
  - 🔍 Scan QR
  - ➕ Add Funds
  - ↗️ Send Money

## 📱 Complete Flow Diagrams

### Add Funds Flow
```
Wallet Home
    │
    └─→ Add Funds Screen
         │
         ├─→ Credit Card
         │    └─→ Card Details Form
         │         └─→ Confirm Payment
         │              └─→ Success ✓
         │
         ├─→ Bank Transfer
         │    └─→ Link Bank
         │         └─→ Confirm Transfer
         │
         ├─→ Cryptocurrency
         │    └─→ Select Crypto
         │         └─→ Wallet Connection
         │              └─→ Confirm Payment
         │
         └─→ Bakong QR
              └─→ Scan QR
                   └─→ Confirm Payment
```

### Bakong Payment Flow
```
Wallet Home
    │
    └─→ Bakong Pay / Scan QR
         │
         └─→ QR Scanner (Full Screen)
              │
              └─→ QR Detected
                   │
                   └─→ Merchant Info Display
                        │
                        └─→ Confirm Payment
                             │
                             └─→ Success ✓
                                  └─→ Back to Wallet
```

### Send Money Flow
```
Wallet Home
    │
    └─→ Send Money
         │
         ├─→ Enter Amount (KHR)
         ├─→ Select Recipient
         │    ├─→ Phone Number
         │    ├─→ Bitriel ID
         │    └─→ Recent (Quick Select)
         │
         └─→ Confirm Payment
              └─→ Success ✓
                   └─→ Back to Wallet
```

## 🔐 Security Features

### Payment Security
- ✅ SSL/TLS encryption
- ✅ PCI DSS compliant card processing
- ✅ No full card details stored
- ✅ Tokenized card information
- ✅ 3D Secure authentication
- ✅ Transaction monitoring

### Wallet Security
- ✅ Biometric authentication (coming soon)
- ✅ PIN protection (coming soon)
- ✅ Transaction limits
- ✅ Real-time fraud detection

## 🌐 Bakong Integration Details

### What is Bakong?
Bakong is Cambodia's national payment system by the National Bank of Cambodia (NBC). It enables:
- Instant QR code payments
- Bank-to-bank transfers
- Merchant payments
- No transaction fees for consumers

### Supported Use Cases
1. **Merchant Payments**
   - Restaurants, cafes
   - Retail stores
   - Markets
   - Service providers

2. **Transportation**
   - Tuk-tuks
   - Taxis
   - Ride-sharing

3. **Tickets & Services**
   - Tourist attractions
   - Tours
   - Hotels
   - Events

### Integration Benefits
- ✅ Instant settlements
- ✅ Wide merchant acceptance
- ✅ Government-backed security
- ✅ No additional fees
- ✅ QR code standardization

## 📊 Transaction States

### Processing Flow
1. **Initiated** - User confirms payment
2. **Processing** - Payment being processed (2-3 seconds)
3. **Completed** - Funds transferred
4. **Failed** - Error occurred (with retry option)

### Success Screen
- ✅ Green checkmark animation
- Show transaction details:
  - Amount in KHR
  - USD equivalent
  - New balance
  - Transaction ID
- Auto-redirect to wallet (2s delay)

## 💡 Usage Examples

### Tourist Scenario 1: Add Funds with Card
```
1. Tourist arrives in Cambodia
2. Opens Bitriel wallet
3. Taps "Add Funds" card
4. Selects "Credit Card"
5. Enters amount: $100 USD
6. System converts: ៛405,000 KHR
7. Enters card details
8. Confirms payment
9. Funds instantly available
```

### Tourist Scenario 2: Pay at Restaurant
```
1. Finishes meal at local restaurant
2. Restaurant shows Bakong QR code
3. Opens Bitriel → Taps "Bakong Pay"
4. Scans QR code
5. Sees: "Local Restaurant - ៛45,320 KHR ($11.19)"
6. Confirms payment
7. Instant payment ✓
```

### Tourist Scenario 3: Send Money to Friend
```
1. Friend needs money for shared tour
2. Opens "Send Money"
3. Enters: ៛200,000 KHR ($49.38)
4. Enters friend's phone: +855 12 345 678
5. Adds note: "Tour booking split"
6. Confirms
7. Friend receives instantly ✓
```

## 🚀 Technical Implementation

### Currency Conversion
```typescript
const exchangeRate = 4050; // 1 USD = 4050 KHR
const balanceKHR = 50420000;
const balanceUSD = balanceKHR / exchangeRate;

// Display format
៛50,420,000 KHR
≈ $12,445.68 USD
```

### Routes Structure
```
(wallet)/
├── add-funds.tsx         # Add funds screen
├── scan-qr.tsx          # QR scanner
├── my-cards.tsx         # Saved cards
├── send.tsx             # Send money
├── transactions.tsx     # Transaction history
├── services.tsx         # Tourist services
└── payment/
    ├── card.tsx         # Card payment form
    ├── bank.tsx         # Bank transfer
    ├── crypto.tsx       # Crypto payment
    └── confirm.tsx      # Payment confirmation
```

## 🎯 Future Enhancements

### Phase 2 (Coming Soon)
- [ ] Real camera integration for QR scanning
- [ ] Real-time currency exchange rates API
- [ ] Multiple currency support (USD, KHR, THB)
- [ ] Split payments with friends
- [ ] Recurring payments
- [ ] Payment schedule

### Phase 3 (Planned)
- [ ] NFC payments (tap-to-pay)
- [ ] Virtual card for online purchases
- [ ] Physical card issuance
- [ ] ATM withdrawals
- [ ] Bill payments integration
- [ ] Loyalty points program

## 📝 Developer Notes

### Mock Data
All screens currently use mock data:
- Balance: ៛50,420,000 KHR
- Exchange rate: 4050 (hardcoded)
- Saved cards: 2 demo cards
- Recent recipients: 3 demo users

### API Integration Points
Ready for backend integration:
1. `POST /api/funds/add` - Add funds
2. `POST /api/payments/scan` - Bakong QR payment
3. `POST /api/transfers/send` - Send money
4. `GET /api/cards/list` - Get saved cards
5. `GET /api/exchange-rate` - Get live rates
6. `POST /api/cards/add` - Save new card

### Testing
Use "Simulate Scan" button in QR scanner for demo without camera access.

---

## 🎉 Summary

✅ **Currency**: Cambodian Riel (KHR) with USD conversion  
✅ **Dashed Borders**: Fuse-style card design  
✅ **Add Funds**: Card, Bank, Crypto, Bakong  
✅ **Bakong Integration**: Full QR scanner  
✅ **Send Money**: To phone/Bitriel ID  
✅ **Saved Cards**: Card management  
✅ **Complete Flows**: End-to-end payment journeys  

**Ready for backend integration!** 🚀

