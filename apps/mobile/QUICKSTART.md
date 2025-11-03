# 🚀 Quick Start Guide - Wallet UI

## Get Started in 3 Steps

### 1️⃣ Start the Development Server

```bash
cd /Users/samallen/Developer/bitriel
pnpm dev:mobile
```

### 2️⃣ Open on Your Device

**For iOS:**
```bash
pnpm --filter @bitriel/mobile ios
```

**For Android:**
```bash
pnpm --filter @bitriel/mobile android
```

**For Web (preview):**
```bash
pnpm --filter @bitriel/mobile web
```

### 3️⃣ Navigate to the Wallet

1. App opens on the home screen (component showcase)
2. **Tap the blue "Open Wallet" button** at the top
3. 🎉 Enjoy the beautiful wallet UI!

---

## 🎨 What You'll See

### Main Wallet Screen
- Your balance: **$12,458.32** (+12.5%)
- Four colorful action buttons (Send, Receive, Buy, Swap)
- A beautiful gradient virtual card
- Tourist services grid
- Cashback rewards section

### Explore More
- **Tap the transaction icon** (📋 top right) → See transaction history
- **Tap "See All"** under services → Browse all tourist services
- **Tap any service card** → View category details

---

## 🎯 Key Features to Try

✅ **Scroll through the main wallet** - See all features  
✅ **Tap quick action buttons** - Feel the haptic feedback  
✅ **View transactions** - See categorized history  
✅ **Browse services** - Explore tourist categories  
✅ **Toggle dark mode** - Via settings modal  

---

## 📱 Navigation Map

```
Home Screen (index.tsx)
    │
    └─→ [Open Wallet Button]
            │
            ├─→ Main Wallet (wallet.tsx)
            │      │
            │      ├─→ [Transaction Icon] → Transactions
            │      │
            │      └─→ [See All / Service Cards] → Services
            │
            ├─→ Transactions (/(wallet)/transactions.tsx)
            │      └─→ [Back Button] → Main Wallet
            │
            └─→ Services (/(wallet)/services.tsx)
                   └─→ [Back Button] → Main Wallet
```

---

## 🔧 Troubleshooting

### App won't start?
```bash
# Clear cache and reinstall
cd apps/mobile
rm -rf node_modules .expo
pnpm install
pnpm dev
```

### Build errors?
```bash
# Rebuild from root
cd /Users/samallen/Developer/bitriel
pnpm install
pnpm build:mobile
```

### Navigation not working?
- Make sure you're on the latest Expo Router 6.x
- Check that all route files are in the correct folders

---

## 🎨 Design Inspired by Fuse Wallet

This UI takes inspiration from [Fuse Wallet](https://fusewallet.com) but adapts it for tourists with:
- **Local services** (Shopping, Dining, Tours)
- **"Spend like a local"** branding
- **Tourist-focused features**
- **Travel ecosystem integration**

---

## 📚 Full Documentation

- **README_WALLET_UI.md** - Complete feature list
- **WALLET_UI_GUIDE.md** - Detailed user guide
- **DESIGN_SPECS.md** - Visual specifications

---

## 🎉 That's It!

You're ready to explore the beautiful wallet UI. Have fun! 🚀

Questions? Check the docs or run:
```bash
expo doctor
```

