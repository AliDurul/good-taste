// lib/nav.tsx
import { TerminalSquareIcon, BotIcon, Settings2Icon } from "lucide-react"

const navConfig = [
  {
    title: "Dashboard",
    icon: TerminalSquareIcon,
    isActive: true,
    roles: ["admin", "officer", "agent"],   // everyone
    items: [
      { title: "Sale Reports", url: "/dashboard/sale-reports", roles: ["admin", "officer", "agent"] },
      { title: "Order Reports", url: "/dashboard/order-reports", roles: ["admin", "officer"] },
      // { title: "Settings", url: "/settings", roles: ["admin"] },
    ],
  },
  {
    title: "Stocks",
    icon: BotIcon,
    roles: ["admin", "officer"],
    items: [
      { title: "Products", url: "/dashboard/products", roles: ["admin", "officer"] },
      { title: "Product variants", url: "/dashboard/products/variants", roles: ["admin", "officer"] },
      { title: "Product Categories", url: "/dashboard/products/categories", roles: ["admin"] },
    ],
  },
  {
    title: "Users",
    icon: BotIcon,
    roles: ["admin"],
    items: [
      { title: "User List", url: "/dashboard/users", roles: ["admin"] },
      { title: "Create User", url: "/dashboard/users/new", roles: ["admin"] },
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
    url: "/dashboard/settings",
    icon: Settings2Icon,
    roles: ["admin"],
    items: [
      { title: "Wallet Config", url: "/dashboard/settings/wallet-config", roles: ["admin"] },
      { title: "Loyalty Tiers", url: "/dashboard/settings/loyalty-tiers", roles: ["admin"] },
    ],
  },
]

export default navConfig