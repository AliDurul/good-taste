import { DataSection } from '@/components/DataSection'
import { getLoyaltyTiers } from '@/actions/queries'
import type { ILoyaltyTier } from '@workspace/schemas'
import { TierList } from './_components/TierList'

export default function LoyaltyTiersPage() {
    return (
        <div className="rounded-md border">
            <div className="flex flex-col gap-8 p-4 md:p-8">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-semibold tracking-tight">Loyalty Tiers</h2>
                    <p className="text-muted-foreground">
                        Create and manage customer loyalty tiers with spend thresholds and earn
                        multipliers.
                    </p>
                </div>

                <DataSection label="loyalty tiers">
                    <TiersData />
                </DataSection>
            </div>
        </div>
    )
}

async function TiersData() {
    const result = await getLoyaltyTiers()
    return <TierList initialTiers={result.data as ILoyaltyTier[]} />
}
