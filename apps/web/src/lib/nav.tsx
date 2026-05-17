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
      { title: "Sale Reports",  url: "/dashboard/sale-reports", roles: ["admin", "officer", "agent"] },
      { title: "Order Reports",  url: "/dashboard/order-reports", roles: ["admin", "officer"] },
      // { title: "Settings", url: "/settings", roles: ["admin"] },
    ],
  },
  {
    title: "Products",
    url: "#",
    icon: <BotIcon />,
    roles: ["admin", "officer"],
    items: [
      { title: "List Products",  url: "/dashboard/products", roles: ["admin", "officer"] },
      { title: "Create Product", url: "/dashboard/products/create", roles: ["admin"] },
      { title: "Product Reports",  url: "/dashboard/products/reports", roles: ["admin"] },
    ],
  },
  {
    title: "Sales",
    url: "/dashboard/sales",
    icon: <BotIcon />,
    roles: ["admin", "officer"],
    // items: [
    //   { title: "List Sales",  url: "/dashboard/sales", roles: ["admin", "officer"] },
    //   { title: "Create Sale", url: "/dashboard/sales/create", roles: ["admin"] },
    //   { title: "Reports",  url: "/dashboard/sales/reports", roles: ["admin"] },
    // ],
  },
  {
    title: "Settings",
    url: "#",
    icon: <Settings2Icon />,
    roles: ["admin"],                      // admin only
    items: [
      { title: "General", url: "/dashboard/settings/general", roles: ["admin"] },
      { title: "Team",    url: "/dashboard/settings/team", roles: ["admin"] },
      { title: "Billing", url: "/dashboard/settings/billing", roles: ["admin"] },
      { title: "Limits",  url: "/dashboard/settings/limits", roles: ["admin"] },
    ],
  },
]