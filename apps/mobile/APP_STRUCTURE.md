# Updated App Structure

## 📁 New Folder Organization

```
app/
├── _layout.tsx              # Root Stack Navigator
├── index.tsx                # Entry point (redirects to wallet)
│
├── (tabs)/                  # 👥 Tab Navigation Group
│   ├── _layout.tsx          # Tab Navigator
│   ├── wallet.tsx           # ✅ Main wallet screen
│   ├── history.tsx          # Transaction history
│   ├── stake.tsx            # Staking
│   ├── card.tsx             # Crypto card
│   └── discover.tsx         # Explore/DApps
│
└── (routes)/                # 📱 Modal/Overlay Screens Group
    ├── _layout.tsx          # Stack Navigator for routes
    └── send/                # Send transaction flow
        ├── [asset].tsx      # Address selection
        ├── amount.tsx       # Amount input
        └── review.tsx       # Review & confirm
```

## 🎯 Why This Structure?

### Benefits:

1. **Clear Separation**: Tabs vs Modal screens
2. **Organized**: Send flow is grouped together in `(routes)/send/`
3. **Scalable**: Easy to add more route groups (e.g., `(routes)/receive/`, `(routes)/swap/`)
4. **Clean Navigation**: Routes are clearly prefixed `/(routes)/` and `/(tabs)/`

### Route Groups Explained:

- `(tabs)` - Bottom tab navigation (persistent across screens)
- `(routes)` - Full-screen modal/overlay screens (stacked on top of tabs)

## 🔗 Navigation Paths

### From Wallet to Send Flow:

```tsx
// Send button
router.push('/(routes)/send/SOL');

// Asset card click
router.push(`/(routes)/send/${asset.symbol}`);
```

### Within Send Flow:

```tsx
// [asset].tsx → amount.tsx
router.push({
  pathname: '/(routes)/send/amount',
  params: { asset, address, recipientName },
});

// amount.tsx → review.tsx
router.push({
  pathname: '/(routes)/send/review',
  params: { asset, address, recipientName, amount, usdValue },
});

// review.tsx → back to wallet
router.replace('/(tabs)/wallet');
```

## 📋 Layout Hierarchy

```
Root Layout (_layout.tsx)
├── index.tsx (redirects to wallet)
├── (tabs) Layout
│   ├── wallet ← Default tab
│   ├── history
│   ├── stake
│   ├── card
│   └── discover
└── (routes) Layout
    └── send/
        ├── [asset] ← Dynamic route (SOL, BTC, ETH, etc.)
        ├── amount
        └── review
```

## ✅ Updated Files

### Navigation Updates:

1. **`app/_layout.tsx`** - Registered `(routes)` group
2. **`app/(routes)/_layout.tsx`** - New layout for modal screens
3. **`app/(tabs)/wallet.tsx`** - Updated paths to `/(routes)/send/...`
4. **`app/(routes)/send/[asset].tsx`** - Updated path to `/(routes)/send/amount`
5. **`app/(routes)/send/amount.tsx`** - Updated path to `/(routes)/send/review`

## 🚀 How Navigation Works

### Tab Navigation:

- Always visible at the bottom
- Switching tabs maintains tab state
- Tabs: Wallet | History | Stake | Card | Discover

### Route Navigation:

- Opens as full-screen modals
- Stacks on top of tabs
- Back button returns to previous screen
- Send flow: Address → Amount → Review → Success

## 🎨 User Experience

1. **App starts** → `index.tsx` redirects to `/(tabs)/wallet`
2. **User taps "Send"** → Opens `/(routes)/send/SOL`
3. **User completes flow** → Returns to `/(tabs)/wallet`
4. **Tabs remain accessible** → User can switch tabs anytime

## 🔮 Future Additions

Easy to add more route groups:

```
app/
├── (tabs)/
├── (routes)/
│   ├── send/
│   ├── receive/        ← New
│   ├── swap/           ← New
│   └── settings/       ← New
└── (onboarding)/       ← New group
    ├── welcome.tsx
    ├── create-wallet.tsx
    └── import-wallet.tsx
```

## 📝 Notes

- Route groups `(folder)` don't appear in the URL
- Dynamic routes `[param]` create parameterized paths
- `initialRouteName="wallet"` sets the default tab
- All routes use `headerShown: false` for custom headers

---

**The app structure is now clean, organized, and scalable!** 🎉
