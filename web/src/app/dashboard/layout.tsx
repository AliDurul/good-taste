import { AppSidebar } from "@/components/layout/app-sidebar"
import DashHeader from "@/components/layout/dash-header"

import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { Suspense } from "react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <Suspense fallback={<div>Loading...</div>}>
                <AppSidebar />
            </Suspense>
            <SidebarInset className="min-w-0">
                <Suspense fallback={<div>Loading...</div>}>
                    <DashHeader />
                </Suspense>
                <div className="flex flex-1 flex-col gap-4 p-3 min-w-0">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider >
    )
}