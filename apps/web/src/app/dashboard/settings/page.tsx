'use cache'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@workspace/ui/components/card'
import Link from 'next/link'
import { Wallet, Trophy } from 'lucide-react'

const sections = [
    {
        title: 'Wallet Configuration',
        description:
            'Manage earn rates, point expiry, and referral bonuses for the loyalty wallet.',
        href: '/dashboard/settings/wallet-config',
        icon: Wallet,
    },
    {
        title: 'Loyalty Tiers',
        description:
            'Create and manage customer tiers with spend thresholds and earn multipliers.',
        href: '/dashboard/settings/loyalty-tiers',
        icon: Trophy,
    },
]

export default async function SettingsPage() {
    return (
        <div className="rounded-md border">
            <div className="flex flex-col gap-8 p-4 md:p-8">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-semibold tracking-tight">Settings</h2>
                    <p className="text-muted-foreground">
                        Manage your application configuration and preferences.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {sections.map((section) => {
                        const Icon = section.icon
                        return (
                            <Link key={section.href} href={section.href}>
                                <Card className="h-full cursor-pointer transition-all hover:shadow-lg hover:ring-2 hover:ring-primary/20">
                                    <CardHeader className="flex flex-row items-center gap-3 pb-3">
                                        <div className="rounded-lg bg-primary/10 p-2.5">
                                            <Icon className="h-5 w-5 text-primary" />
                                        </div>
                                        <CardTitle className="text-base">{section.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription>{section.description}</CardDescription>
                                    </CardContent>
                                </Card>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
