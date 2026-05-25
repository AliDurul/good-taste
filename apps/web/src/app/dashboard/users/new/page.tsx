import { getAgents } from '@/actions/queries'
import { DataSection } from '@/components/DataSection'
import { UserForm } from '../_components/UserForm'

export default function NewUserPage() {
    return (
        <div className="flex flex-col gap-8 p-4 md:p-8">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-semibold tracking-tight">New User</h2>
                <p className="text-muted-foreground">
                    Fill in the details below to add a new user to Good Taste.
                </p>
            </div>
            <div className="rounded-md border p-4 md:p-6">
                <DataSection label="user details">
                    <FormData />
                </DataSection>
            </div>
        </div>
    )
}

async function FormData() {
    const result = await getAgents()
    return <UserForm mode="create" agents={result.data ?? []} />
}
