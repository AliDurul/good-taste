// lib/nav.tsx
import { TerminalSquareIcon, BotIcon, Settings2Icon, Users, Boxes, Settings, LayoutDashboardIcon, ShoppingCart } from "lucide-react"

const navConfig = [
  {
    title: "Dashboard",
    icon: LayoutDashboardIcon,
    isActive: true,
    roles: ["admin", "officer", "agent"],   // everyone
    items: [
      { title: "Sale Reports", url: "/dashboard/sale-reports", roles: ["admin", "officer", "agent"] },
      { title: "Order Reports", url: "/dashboard/order-reports", roles: ["admin", "officer"] },
      // { title: "Settings", url: "/settings", roles: ["admin"] },
    ],
  },
  {
    title: "Orders",
    icon: ShoppingCart,
    isActive: true,
    roles: ["admin", "officer", "agent"],
    items: [
      { title: "Order List", url: "/dashboard/orders", roles: ["admin", "officer", "agent"] },
      { title: "Create Order", url: "/dashboard/orders/new", roles: ["admin", "officer"] },
    ],
  },
  {
    title: "Stocks",
    icon: Boxes,
    roles: ["admin", "officer"],
    items: [
      { title: "Products", url: "/dashboard/products", roles: ["admin", "officer"] },
      { title: "Product Categories", url: "/dashboard/products/categories", roles: ["admin"] },
    ],
  },

  {
    title: "Users",
    icon: Users,
    roles: ["admin", 'agent', 'officer'],
    items: [
      { title: "User List", url: "/dashboard/users", roles: ["admin", 'officer'] },
      { title: "Create User", url: "/dashboard/users/new", roles: ["admin", 'officer', 'agent'] },
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
    icon: Settings,
    roles: ["admin"],
    items: [
      { title: "Wallet Config", url: "/dashboard/settings/wallet-config", roles: ["admin"] },
      { title: "Loyalty Tiers", url: "/dashboard/settings/loyalty-tiers", roles: ["admin"] },
    ],
  },
]

export default navConfig