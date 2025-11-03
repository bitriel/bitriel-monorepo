# Wallet UI Design Specifications

## 🎨 Visual Design Inspired by Fuse Wallet

### Design Principles from Fuse Wallet

Based on the Fuse Wallet website (https://fusewallet.com), the design incorporates:

1. **Modern Card-First Design**
   - Large, prominent virtual card display
   - Gradient backgrounds for visual appeal
   - Clear card information hierarchy

2. **Feature Highlights with Icons**
   - Each feature has a distinctive icon
   - Color-coded categories
   - Rounded containers with shadows

3. **Zero-Fee Emphasis**
   - Clear display of "0% Fee" benefits
   - Prominent reward percentages
   - Trust signals (security, self-custody)

4. **Clean Typography**
   - Clear hierarchy (Large titles, body text, captions)
   - Ample white space
   - Easy-to-scan layout

## 📱 Screen Layouts

### 1. Main Wallet Screen

```
┌─────────────────────────────────────┐
│                                     │
│  Total Balance              [📋]   │
│  $12,458.32                         │
│  ↗ +12.5% Last 30 days             │
│                                     │
│  [Send] [Receive] [Buy] [Swap]     │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Your Card         Manage   │   │
│  │  ┌───────────────────────┐  │   │
│  │  │ Virtual Card    💳    │  │   │
│  │  │                       │  │   │
│  │  │ •••• •••• •••• 4829   │  │   │
│  │  │                       │  │   │
│  │  │ Tourist User   12/28  │  │   │
│  │  │               [VISA]  │  │   │
│  │  └───────────────────────┘  │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🌍 Spend like a local       │   │
│  │                             │   │
│  │ Access everything you need  │   │
│  │ as a tourist - payments,    │   │
│  │ tickets, local experiences  │   │
│  └─────────────────────────────┘   │
│                                     │
│  Tourist Services       See All    │
│  ┌──────────┐  ┌──────────┐        │
│  │ 🛒       │  │ 🎫       │        │
│  │ Shopping │  │ Tickets  │        │
│  │ Local    │  │ Tours &  │        │
│  │ markets  │  │ attract. │        │
│  └──────────┘  └──────────┘        │
│  ┌──────────┐  ┌──────────┐        │
│  │ 🍴       │  │ 📍       │        │
│  │ Dining   │  │ Experien │        │
│  │ Restaur. │  │ Local    │        │
│  │ & cafes  │  │ activit. │        │
│  └──────────┘  └──────────┘        │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Earn Rewards      Up to 5%  │   │
│  │                             │   │
│  │ Get cashback on local       │   │
│  │ purchases                   │   │
│  │                             │   │
│  │   [Start Earning]           │   │
│  └─────────────────────────────┘   │
│                                     │
│  Why Choose Us                      │
│  ┌─────────────────────────────┐   │
│  │ 🛡️  Secure & Safe           │   │
│  │     Enterprise-grade...     │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 💲  Zero Fees               │   │
│  │     No hidden charges...    │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 🌍  Global Access           │   │
│  │     Use anywhere...         │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ ✨  Smart Rewards           │   │
│  │     Earn while you travel   │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### 2. Transactions Screen

```
┌─────────────────────────────────────┐
│  ← Transactions                     │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🍴  Local Restaurant        │   │
│  │     Thai Street Food        │   │
│  │     Nov 3, 2024             │   │
│  │                    -$45.32  │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ ⬇️  Received                │   │
│  │     From John Doe           │   │
│  │     Nov 2, 2024             │   │
│  │                   +$120.00  │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🎫  Tour Booking            │   │
│  │     City Heritage Walk      │   │
│  │     Nov 1, 2024             │   │
│  │                    -$89.99  │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🛒  Shopping                │   │
│  │     Local Market            │   │
│  │     Oct 31, 2024            │   │
│  │                    -$23.45  │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ ⭐  Cashback Reward         │   │
│  │     Monthly rewards         │   │
│  │     Oct 30, 2024            │   │
│  │                    +$12.50  │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### 3. Services Screen

```
┌─────────────────────────────────────┐
│  ← All Services                     │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🛒  Shopping                │   │
│  │                             │   │
│  │  • Local Markets        →   │   │
│  │    Traditional goods...     │   │
│  │                             │   │
│  │  • Fashion Stores       →   │   │
│  │    Latest trends...         │   │
│  │                             │   │
│  │  • Souvenirs           →    │   │
│  │    Take home memories       │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🎫  Tours & Tickets         │   │
│  │                             │   │
│  │  • City Tours           →   │   │
│  │    Guided heritage walks    │   │
│  │                             │   │
│  │  • Museums             →    │   │
│  │    Art & history exhibits   │   │
│  │                             │   │
│  │  • Theme Parks         →    │   │
│  │    Fun for all ages         │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🍴  Dining                  │   │
│  │                             │   │
│  │  • Local Cuisine       →    │   │
│  │    Authentic flavors        │   │
│  │                             │   │
│  │  • Fine Dining         →    │   │
│  │    Premium restaurants      │   │
│  │                             │   │
│  │  • Street Food         →    │   │
│  │    Quick bites              │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

## 🎨 Color Usage

### Primary Actions (Blue)
- Send button: `#0385FF`
- Primary CTAs
- Links and navigation

### Success/Positive (Green)
- Receive button: `#00C853`
- Positive balance changes
- Success indicators

### Shopping/Alerts (Red)
- Buy button: `#FF3B57`
- Shopping services
- Important notices

### Swap/Dining (Orange)
- Swap button: `#FF9500`
- Dining services
- Secondary actions

### Experiences (Purple)
- Experience services: `#8E44AD`
- Premium features

### Rewards (Gold)
- Cashback: `#FFD700`
- Achievements
- Special features

## 📐 Spacing & Layout

- **Screen Padding**: 24px (px-6)
- **Card Padding**: 16-24px (p-4 to p-6)
- **Vertical Spacing**: 32px between sections (mb-8)
- **Card Gaps**: 12px (gap-3)
- **Border Radius**: 
  - Cards: 24px (rounded-3xl)
  - Buttons: 16px (rounded-2xl)
  - Icons: 12px (rounded-xl)

## 🔤 Typography Scale

Following NativeWindUI text variants:
- **largeTitle**: Main balance ($12,458.32)
- **title2-3**: Section headers
- **callout**: Card titles
- **subhead**: Descriptions, metadata
- **caption1-2**: Small text, dates
- **body**: Regular content

## 🎭 Animations

All animations use React Native Reanimated for 60fps performance:

1. **Entrance Animations**
   - Hero section: `FadeIn.duration(600)`
   - Cards: `FadeInDown.delay(100 * index).duration(600)`
   - Staggered for visual hierarchy

2. **Interaction Feedback**
   - Haptic feedback on all taps
   - Opacity changes (70-80%) on press
   - Smooth transitions

## 🌓 Dark Mode Support

All colors adapt automatically:
- Card backgrounds change
- Border colors adjust
- Text maintains contrast
- Gradients switch palettes

## 📱 Responsive Design

- Safe area insets respected on all screens
- Dynamic card sizing
- Flexible grid layouts
- Proper keyboard avoidance

## ♿ Accessibility

- Semantic text variants
- Proper hit areas (44pt minimum)
- Color contrast ratios maintained
- Screen reader compatible structure

---

## Fuse Wallet Feature Comparison

| Feature | Fuse Wallet | Bitriel Implementation |
|---------|-------------|------------------------|
| Virtual Card | ✅ Prepaid Debit Visa | ✅ Virtual card UI |
| Zero-Fee Swaps | ✅ Jupiter integration | 🔄 UI ready |
| Staking | ✅ SOL rewards | 🔄 UI ready |
| Yield/Earn | ✅ DeFi integrations | ✅ Cashback section |
| Smart Accounts | ✅ Multi-sig | 🔄 Security features |
| Tourist Services | ❌ | ✅ Core feature |
| E-commerce | ❌ | ✅ Integrated |
| Ticketing | ❌ | ✅ Tours & attractions |
| Local Dining | ❌ | ✅ Restaurant bookings |

✅ = Implemented | 🔄 = UI Ready/Backend Pending | ❌ = Not available

---

**Design Status**: ✅ Complete  
**Implementation Status**: ✅ UI Complete | 🔄 Backend Integration Pending

