# Send Transaction Flow

## Overview

A complete multi-step flow for sending cryptocurrency (SOL) with address selection, amount input, review, and confirmation.

## Screens

### 1. Send Asset Screen (`app/send/[asset].tsx`)

**Purpose**: Select recipient address

**Features**:

- Dynamic asset parameter (e.g., `/send/SOL`, `/send/BTC`)
- Address input field with QR code scanner button
- Real-time address validation
- Two sections:
  - **Recent Transfers**: Last 3 transactions
  - **Saved Addresses**: User's address book
- Auto-populate address when selecting from list
- "Address found" indicator when valid address is entered
- Orange "Continue" button (enabled when address is valid)

**UI Elements**:

- Back button in header
- Title: "Send {ASSET}"
- Address input with placeholder "Enter address"
- QR scanner icon in input field
- Recent transfers list with avatars
- Saved addresses list with custom names
- Continue button at bottom

---

### 2. Amount Input Screen (`app/send/amount.tsx`)

**Purpose**: Enter amount to send

**Features**:

- Shows recipient name badge
- Displays available balance with "Max" button
- Large amount display with asset symbol
- USD value conversion in real-time
- Custom numpad (0-9, decimal point, backspace)
- Currency swap button (SOL ↔ USD)
- Haptic feedback on all interactions

**Calculations**:

- Real-time USD conversion (hardcoded at $138.52/SOL for now)
- Max button fills available balance
- Decimal point support (only one decimal allowed)

**UI Elements**:

- Recipient chip: "👤 {name}"
- Balance info: "Available balance: 329.27 SOL"
- Amount: "10 SOL" (large, bold)
- USD value: "$1385.2" (secondary)
- Swap icon button
- 4x3 numpad grid
- Orange "Confirm" button

---

### 3. Review & Confirm Screen (`app/send/review.tsx`)

**Purpose**: Review and confirm transaction

**Features**:

- Bottom sheet modal with transaction details
- Slide-to-confirm interaction
- Transaction summary with fees
- Success screen after confirmation
- Two-step confirmation process

**Review Modal Details**:

- Amount: "10 SOL" + "$1385.2"
- Recipient: Shortened address
- Send time: "est. about 2 minutes"
- Network fee: "0.005 SOL" (with info icon)
- Total: Amount + Network fee
- Slide-to-confirm slider (70% threshold)

**Slide-to-Confirm**:

- Custom pan responder for gesture handling
- Orange progress bar follows finger
- Haptic feedback on release
- Success/failure based on slide distance
- "Confirming..." state while processing

**Success Screen**:

- Green checkmark animation
- "Successful!" heading
- Confirmation message
- Two buttons:
  - Orange "Done" → Returns to wallet
  - White "View on explorer" → Opens blockchain explorer

---

## Flow Diagram

```
Wallet Screen
    ↓ (Tap "Send" or Asset)
Send Asset Screen
    ↓ (Enter address & Continue)
Amount Screen
    ↓ (Enter amount & Confirm)
Review Screen
    ↓ (Open modal)
Review Modal
    ↓ (Slide to confirm)
Processing (2s simulation)
    ↓
Success Screen
    ↓ (Done)
Back to Wallet
```

## Navigation

### Entry Points:

1. **From Wallet Screen**:
   - Tap "Send" button → `/send/SOL`
   - Tap any asset card → `/send/{ASSET_SYMBOL}`

### Routes:

- `/send/[asset]` - Address selection
- `/send/amount` - Amount input
- `/send/review` - Review & confirm

### Parameters Passed:

```typescript
// To amount screen
{
  asset, address, recipientName;
}

// To review screen
{
  asset, address, recipientName, amount, usdValue;
}
```

## Components & Interactions

### Address Input

- TextInput with dark background
- QR code scanner button (styled as orange square)
- Clear on selection from list
- Keyboard management (dismisses when selecting address)

### Address Lists

- Card-based layout
- Avatar icon for each contact
- Name + truncated address
- Tap to select and auto-fill

### Custom Numpad

- 4 rows × 3 columns
- Numbers 1-9, 0
- Decimal point (.)
- Backspace icon (delete.left)
- Rounded buttons with background color
- Haptic feedback on press

### Slide-to-Confirm

- Horizontal pan gesture
- Minimum 70% slide required
- Orange progress bar animation
- Arrow icon in slider button
- White slider thumb with shadow
- Text changes: "Slide to confirm" → "Confirming..."

### Success Animation

- Green circular border with checkmark
- Fade-in modal
- 2-second simulated processing
- Auto-transition from review

## Styling

### Colors

- **Primary Action**: #FF8A3D (Orange)
- **Success**: #10B981 (Green)
- **Error**: #EF4444 (Red)
- **Background**: Theme-aware (dark/light)
- **Cards**: Theme grey6 color
- **Text**: Theme foreground

### Typography

- **Large Amount**: 60px, bold
- **Headers**: 18-20px, semibold
- **Body**: 16px
- **Secondary**: 14px, 60% opacity

### Spacing

- Screen padding: 20px horizontal
- Card gaps: 8-12px
- Safe area insets respected
- Bottom padding includes safe area

## State Management

Currently uses local state:

- `address` - Recipient address
- `amount` - SOL amount
- `usdValue` - USD equivalent
- `isAddressFound` - Validation state
- `showReviewModal` - Modal visibility
- `isConfirming` - Processing state
- `showSuccess` - Success screen

**Future**: Should integrate with wallet state management (Redux/Zustand/Context)

## API Integration Points

### To Implement:

1. **Address Validation**

   - Real blockchain address validation
   - ENS/domain name resolution
   - Contact book API

2. **Balance Fetching**

   - Live balance from wallet
   - Real-time price feeds
   - Gas/fee estimation API

3. **Transaction Submission**

   - Sign transaction with wallet
   - Broadcast to blockchain
   - Transaction hash generation

4. **Explorer Links**
   - Generate proper explorer URLs
   - Deep link to transaction

## Accessibility

- ✅ Haptic feedback on all interactions
- ✅ Keyboard-friendly (auto-dismiss)
- ✅ Safe area handling
- ✅ Dark mode support
- ⚠️ Screen reader support (needs improvement)
- ⚠️ Voice control (needs improvement)

## Testing Checklist

- [ ] Address validation works
- [ ] QR scanner integration
- [ ] Amount calculations accurate
- [ ] Max button uses correct balance
- [ ] Slide gesture threshold (70%)
- [ ] Back navigation preserves state
- [ ] Success screen timeout (2s)
- [ ] Modal dismissal on backdrop
- [ ] Keyboard handling
- [ ] Dark/light theme switching

## Known Limitations

1. **Hardcoded Data**:

   - Recent transfers (mock)
   - Saved addresses (mock)
   - SOL price ($138.52)
   - Network fee (0.005 SOL)
   - Available balance (329.27 SOL)

2. **No Real Blockchain Integration**:

   - Simulated transaction (2s timeout)
   - No actual signing
   - No real validation

3. **Missing Features**:
   - QR code scanner
   - Contact management
   - Transaction history
   - Multiple currencies
   - Custom gas fees
   - Address book editing

## Future Enhancements

- [ ] Integrate real wallet SDK (e.g., Solana Web3.js)
- [ ] Add QR code scanner
- [ ] Support multiple assets (not just SOL)
- [ ] Add contact management
- [ ] Implement address book CRUD
- [ ] Add transaction history
- [ ] Support custom network fees
- [ ] Add memo/note field
- [ ] Biometric confirmation
- [ ] Transaction scheduling
- [ ] Multi-signature support
- [ ] Hardware wallet integration

## Dependencies

```json
{
  "expo-router": "File-based routing",
  "expo-haptics": "Haptic feedback",
  "react-native-safe-area-context": "Safe area handling",
  "nativewind": "Tailwind CSS styling"
}
```

## Running the Flow

```bash
# Start dev server
pnpm dev

# Navigate to wallet
# Tap "Send" button or any asset card
# Follow the 3-step flow
```

The complete send flow is now functional with mock data!
