export interface ServicesItem {
    id: string;
    name: string;
    icon: string;
    route: string;
    category?: string;
    isNew?: boolean;
    description?: string;
}

// Quick Actions for Home Screen
export const quickActionsService: ServicesItem[] = [
    {
        id: "send",
        name: "Send Money",
        icon: "arrow-up",
        route: "/home/send/",
        category: "financial",
        description: "Send crypto to any address",
    },
    {
        id: "receive",
        name: "Receive Money",
        icon: "arrow-down",
        route: "/home/receive/",
        category: "financial",
        description: "Receive crypto payments",
    },
    {
        id: "qr-pay",
        name: "QR Pay",
        icon: "qrcode",
        route: "/home/qrScanner/",
        category: "financial",
        description: "Scan QR codes to pay",
    },
    {
        id: "top-up",
        name: "Top Up",
        icon: "credit-card",
        route: "/home/topup/",
        category: "financial",
        description: "Add funds to wallet",
    },
];

// Financial Services
export const financialServices: ServicesItem[] = [
    {
        id: "defi-hub",
        name: "DeFi Hub",
        icon: "chart-line",
        route: "/ecosystem/defi/",
        category: "financial",
        isNew: true,
        description: "Decentralized finance services",
    },
    {
        id: "staking",
        name: "Staking",
        icon: "coins",
        route: "/ecosystem/staking/",
        category: "financial",
        description: "Earn rewards by staking",
    },
    {
        id: "lending",
        name: "Lending",
        icon: "hand-holding-usd",
        route: "/ecosystem/lending/",
        category: "financial",
        description: "Lend and borrow crypto",
    },
    {
        id: "savings",
        name: "Crypto Savings",
        icon: "piggy-bank",
        route: "/ecosystem/savings/",
        category: "financial",
        description: "High yield savings accounts",
    },
];

// Marketplace & Services
export const marketplaceServices: ServicesItem[] = [
    {
        id: "bills",
        name: "Bill Payments",
        icon: "file-invoice-dollar",
        route: "/ecosystem/bills/",
        category: "marketplace",
        description: "Pay utilities and bills",
    },
    {
        id: "prepaid",
        name: "Mobile Top-up",
        icon: "mobile-alt",
        route: "/ecosystem/prepaid/",
        category: "marketplace",
        description: "Mobile prepaid and postpaid",
    },
    {
        id: "shopping",
        name: "Shopping",
        icon: "shopping-cart",
        route: "/ecosystem/shopping/",
        category: "marketplace",
        description: "Shop with cryptocurrency",
    },
    {
        id: "travel",
        name: "Travel Booking",
        icon: "plane",
        route: "/ecosystem/travel/",
        category: "marketplace",
        description: "Book flights and hotels",
    },
];

// Entertainment & Gaming
export const entertainmentServices: ServicesItem[] = [
    {
        id: "web3-games",
        name: "Web3 Games",
        icon: "gamepad",
        route: "/ecosystem/games/",
        category: "entertainment",
        isNew: true,
        description: "Play-to-earn games",
    },
    {
        id: "nft-marketplace",
        name: "NFT Marketplace",
        icon: "images",
        route: "/ecosystem/nft/",
        category: "entertainment",
        description: "Buy, sell, and trade NFTs",
    },
    {
        id: "streaming",
        name: "Streaming",
        icon: "play-circle",
        route: "/ecosystem/streaming/",
        category: "entertainment",
        description: "Music and video streaming",
    },
    {
        id: "events",
        name: "Events & Tickets",
        icon: "ticket-alt",
        route: "/ecosystem/events/",
        category: "entertainment",
        description: "Buy event tickets with crypto",
    },
];

// Rewards & Loyalty
export const rewardsServices: ServicesItem[] = [
    {
        id: "points-program",
        name: "Points Program",
        icon: "star",
        route: "/rewards/points/",
        category: "rewards",
        description: "Earn and redeem points",
    },
    {
        id: "cashback",
        name: "Cashback Rewards",
        icon: "money-bill-wave",
        route: "/rewards/cashback/",
        category: "rewards",
        description: "Earn cashback on transactions",
    },
    {
        id: "referral",
        name: "Referral Program",
        icon: "users",
        route: "/rewards/referral/",
        category: "rewards",
        description: "Refer friends and earn rewards",
    },
];

// Legacy services for backward compatibility
export const dataService: ServicesItem[] = [
    {
        id: "1",
        name: "send money",
        icon: "arrow-up",
        route: "/home/send/",
        category: "financial",
    },
    {
        id: "2",
        name: "receive money",
        icon: "arrow-down",
        route: "/home/receive/",
        category: "financial",
    },
    {
        id: "3",
        name: "scan explorer",
        icon: "cube",
        route: "/webview/explorer",
        category: "tools",
    },
    {
        id: "4",
        name: "Point Swap",
        icon: "sync-alt",
        route: "/rewards/points/",
        category: "rewards",
    },
    {
        id: "5",
        name: "cashback offer",
        icon: "tag",
        route: "/rewards/cashback/",
        category: "rewards",
    },
    {
        id: "6",
        name: "discount/coupon",
        icon: "percentage",
        route: "/rewards/",
        category: "rewards",
    },
    {
        id: "7",
        name: "movie ticket",
        icon: "ticket-alt",
        route: "/ecosystem/events/",
        category: "entertainment",
    },
    {
        id: "8",
        name: "mobile prepaid",
        icon: "mobile-alt",
        route: "/ecosystem/prepaid/",
        category: "marketplace",
    },
];

// All ecosystem services combined
export const allEcosystemServices: ServicesItem[] = [
    ...financialServices,
    ...marketplaceServices,
    ...entertainmentServices,
    ...rewardsServices,
];

// Helper function to get services by category
export const getServicesByCategory = (category: string): ServicesItem[] => {
    if (category === "all") {
        return allEcosystemServices;
    }
    return allEcosystemServices.filter(service => service.category === category);
};
