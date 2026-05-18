import { DataSection } from '@/components/DataSection'
import { getWalletConfigs } from '@/actions/queries'
import { WalletConfigForm } from './_components/WalletConfigForm'
import type { IWalletConfig } from '@workspace/schemas'

export default function WalletConfigPage() {
    return (
        <div className="rounded-md border">
            <div className="flex flex-col gap-8 p-4 md:p-8">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        Wallet Configuration
                    </h2>
                    <p className="text-muted-foreground">
                        Global settings for the loyalty wallet earn rates and referral bonuses.
                    </p>
                </div>

                <DataSection label="wallet config">
                    <WalletConfigData />
                </DataSection>
            </div>
        </div>
    )
}

async function WalletConfigData() {
  const result = await getWalletConfigs()
    const config = result.data[0] as IWalletConfig | undefined

    if (!config) {
        return (
            <div className="flex h-40 items-center justify-center rounded-xl border border-dashed">
                <p className="text-sm text-muted-foreground">No wallet configuration found.</p>
            </div>
        )
    }

    return <WalletConfigForm config={config} />
}
