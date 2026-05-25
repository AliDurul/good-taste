import { notFound } from 'next/navigation'
import { getUser } from '@/actions/queries'
import { DataSection } from '@/components/DataSection'
import { UserForm } from '../../_components/UserForm'

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
    return (
        <div className="flex flex-col gap-8 p-4 md:p-8">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-semibold tracking-tight">Edit User</h2>
                <p className="text-muted-foreground">
                    Update the user&apos;s information below.
                </p>
            </div>
            <div className="rounded-md border p-4 md:p-6">
                <DataSection label="user details">
                    <FormData params={params} />
                </DataSection>
            </div>
        </div>
    )
}

async function FormData({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const result = await getUser(id)

    if (!result.success) {
        notFound()
    }

    const user = result.data

    // Convert ISO birthday to YYYY-MM-DD for the HTML date input
    const birthday = user.birthday
        ? user.birthday.split('T')[0]
        : ''

    return (
        <UserForm
            mode="edit"
            userId={user.id}
            defaultValues={{
                name: user.name,
                email: user.email,
                phone: user.phone ?? '',
                address: user.address ?? '',
                city: user.city ?? '',
                country: user.country ?? '',
                birthday,
            }}
        />
    )
}
