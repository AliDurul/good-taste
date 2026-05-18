// lib/nav.tsx
import { TerminalSquareIcon, BotIcon, Settings2Icon } from "lucide-react"

export const navMain = [
  {
    title: "Dashboard",
    url: "#",
    icon: <TerminalSquareIcon />,
    isActive: true,
    roles: ["admin", "officer", "agent"],   // everyone
    items: [
      { title: "Sale Reports", url: "/dashboard/sale-reports", roles: ["admin", "officer", "agent"] },
      { title: "Order Reports", url: "/dashboard/order-reports", roles: ["admin", "officer"] },
      // { title: "Settings", url: "/settings", roles: ["admin"] },
    ],
  },
  {
    title: "Stock",
    url: "#",
    icon: <BotIcon />,
    roles: ["admin", "officer"],
    items: [
      { title: "Products", url: "/dashboard/products", roles: ["admin", "officer"] },
      { title: "Product variants", url: "/dashboard/products/variants", roles: ["admin", "officer"] },
      { title: "Product Categories", url: "/dashboard/products/categories", roles: ["admin"] },
    ],
  },
  // {
  //   title: "Sales",
  //   url: "/dashboard/sales",
  //   icon: <BotIcon />,
  //   roles: ["admin", "officer"],
  //   items: [
  //     { title: "List Sales",  url: "/dashboard/sales", roles: ["admin", "officer"] },
  //     { title: "Create Sale", url: "/dashboard/sales/create", roles: ["admin"] },
  //     { title: "Reports",  url: "/dashboard/sales/reports", roles: ["admin"] },
  //   ],
  // },
  {
    title: "Settings",
    url: "#",
    icon: <Settings2Icon />,
    roles: ["admin"],                      // admin only
    items: [
      { title: "Wallet Config", url: "/dashboard/settings/wallet-config", roles: ["admin"] },
      { title: "Loyalty Tiers", url: "/dashboard/settings/loyalty-tiers", roles: ["admin"] },
    ],
  },
]