"use client"

import * as React from "react"

import { NavMain } from "@/components/layout/nav-main"
import { NavProjects } from "@/components/layout/nav-projects"
import { NavUser } from "@/components/layout/nav-user"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Command } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { FrameIcon, PieChartIcon, MapIcon, LifeBuoy, Send } from "lucide-react"
import { NavSecondary } from "./nav-secondary"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { useFilteredNav } from "@/hooks/use-nav"

// const data = {
//   projects: [
//     {
//       name: "Design Engineering",
//       url: "#",
//       icon: (
//         <FrameIcon
//         />
//       ),
//     },
//     {
//       name: "Sales & Marketing",
//       url: "#",
//       icon: (
//         <PieChartIcon
//         />
//       ),
//     },
//     {
//       name: "Travel",
//       url: "#",
//       icon: (
//         <MapIcon
//         />
//       ),
//     },
//   ],
// }

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = authClient.useSession();
  const nav = useFilteredNav(session?.user.role);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Good Taste</span>
                  <span className="truncate text-xs">Limited</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={nav} />
        {/* <NavProjects projects={data.projects} /> */}
        <NavSecondary className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
