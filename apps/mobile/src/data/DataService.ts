export interface ServicesItem {
    id: string;
    name: string;
    icon: string;
    route: string;
}

export const dataService: ServicesItem[] = [
    {
        id: "1",
        name: "send money",
        icon: "arrow-up",
        route: "/home/send/",
    },
    {
        id: "2",
        name: "receive money",
        icon: "arrow-down",
        route: "/home/receive/",
    },
    {
        id: "3",
        name: "scan explorer",
        icon: "cube",
        route: "/webview/explorer",
    },
    {
        id: "4",
        name: "Point Swap",
        icon: "sync-alt",
        route: "./../swap/pointswap/",
    },

    {
        id: "5",
        name: "cashback offer",
        icon: "tag",
        route: "./../send/send",
    },
    {
        id: "6",
        name: "discount/coupon",
        icon: "buromobelexperte",
        route: "./../send/send",
    },
    {
        id: "7",
        name: "movie ticket",
        icon: "ticket-alt",
        route: "./../send/send",
    },
    {
        id: "8",
        name: "mobile prepaid",
        icon: "mobile-alt",
        route: "/home/webview/explorer",
    },
];
