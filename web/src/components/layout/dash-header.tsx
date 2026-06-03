'use client'

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Bell, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import HeaderBreadCrumb from "../HeaderBreadCrumb";

export default function DashHeader() {
    const { theme, setTheme } = useTheme();

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12  justify-between px-4">

            <div className="flex gap-3">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                />
            </div>

            <HeaderBreadCrumb />

            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                >
                    {theme === "light" ? (
                        <Moon className="h-5 w-5" />
                    ) : (
                        <Sun className="h-5 w-5" />
                    )}
                </Button>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                </Button>
            </div>

        </header>
    )
}
