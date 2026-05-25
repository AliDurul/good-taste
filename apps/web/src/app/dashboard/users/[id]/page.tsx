import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { format } from 'date-fns'
import { ArrowLeft } from 'lucide-react'
import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Separator } from '@workspace/ui/components/separator'
import { Skeleton } from '@workspace/ui/components/skeleton'
import { getUser } from '@/actions/queries'
import { DataSection } from '@/components/DataSection'
import { UserActions } from './_components/UserActions'

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
    return (
        <div className="rounded-md border">
            <div className="flex flex-col gap-6 p-4 md:p-8">
                <DataSection label="user details">
                    <UserDetail params={params} />
                </DataSection>
            </div>
        </div>
    )
}

async function UserDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const result = await getUser(id)

    if (!result.success) {
        notFound()
    }

    const user = result.data

    return (
        <div className="flex flex-col gap-6">
            {/* Back */}
            <Button variant="ghost" size="sm" className="-ml-2 w-fit" asChild>
                <Link href="/dashboard/users">
                    <ArrowLeft className="mr-1 size-4" />
                    Back to Users
                </Link>
            </Button>

            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold tracking-tight">{user.name}</h1>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline">{user.role}</Badge>
                        {user.banned && <Badge variant="destructive">Banned</Badge>}
                        <Badge variant={user.emailVerified ? 'success' : 'secondary'}>
                            {user.emailVerified ? 'Email Verified' : 'Unverified'}
                        </Badge>
                    </div>
                </div>
                <Suspense
                    fallback={
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-8 w-16 rounded-md" />
                            <Skeleton className="h-8 w-20 rounded-md" />
                        </div>
                    }
                >
                    <UserActions userId={user.id} userName={user.name} />
                </Suspense>
            </div>

            {/* Details */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Account Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Account</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                            <div>
                                <p className="mb-0.5 text-muted-foreground">Email</p>
                                <p className="font-medium break-all">{user.email}</p>
                            </div>
                            <div>
                                <p className="mb-0.5 text-muted-foreground">Role</p>
                                <Badge variant="outline">{user.role}</Badge>
                            </div>
                            <div>
                                <p className="mb-0.5 text-muted-foreground">Phone</p>
                                <p className="font-medium">{user.phone ?? '—'}</p>
                            </div>
                            <div>
                                <p className="mb-0.5 text-muted-foreground">Birthday</p>
                                <p className="font-medium">
                                    {user.birthday
                                        ? format(new Date(user.birthday), 'dd MMM yyyy')
                                        : '—'}
                                </p>
                            </div>
                            <div>
                                <p className="mb-0.5 text-muted-foreground">Created</p>
                                <p className="font-medium">{format(new Date(user.createdAt), 'dd MMM yyyy')}</p>
                            </div>
                            <div>
                                <p className="mb-0.5 text-muted-foreground">Last Updated</p>
                                <p className="font-medium">{format(new Date(user.updatedAt), 'dd MMM yyyy')}</p>
                            </div>
                        </div>

                        {user.banned && user.banReason && (
                            <>
                                <Separator />
                                <div>
                                    <p className="mb-1 text-sm text-muted-foreground">Ban Reason</p>
                                    <p className="text-sm">{user.banReason}</p>
                                    {user.banExpires && (
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Expires: {format(new Date(user.banExpires), 'dd MMM yyyy HH:mm')}
                                        </p>
                                    )}
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Location & Financials */}
                <Card>
                    <CardHeader>
                        <CardTitle>Location & Wallet</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                            <div>
                                <p className="mb-0.5 text-muted-foreground">Country</p>
                                <p className="font-medium">{user.country ?? '—'}</p>
                            </div>
                            <div>
                                <p className="mb-0.5 text-muted-foreground">City</p>
                                <p className="font-medium">{user.city ?? '—'}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="mb-0.5 text-muted-foreground">Address</p>
                                <p className="font-medium">{user.address ?? '—'}</p>
                            </div>
                            <div>
                                <p className="mb-0.5 text-muted-foreground">Wallet Balance</p>
                                <p className="font-medium">K{user.walletBalance?.toFixed(2) ?? '0.00'}</p>
                            </div>
                            <div>
                                <p className="mb-0.5 text-muted-foreground">Total Spend</p>
                                <p className="font-medium">K{user.totalSpend?.toFixed(2) ?? '0.00'}</p>
                            </div>
                            <div>
                                <p className="mb-0.5 text-muted-foreground">Referral Code</p>
                                <p className="font-mono text-sm font-medium">{user.referralCode ?? '—'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
