import { AppSidebar } from "@/components/app-sidebar"
import DashHeader from "@/components/dash-header"

import {
    SidebarInset,
    SidebarProvider,
} from "@workspace/ui/components/sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <DashHeader />
                <div className="flex flex-1 flex-col gap-4 p-3 bg-muted">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider >
    )
}