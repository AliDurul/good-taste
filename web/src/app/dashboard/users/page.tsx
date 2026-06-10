import React from 'react'
import { DataSection } from '@/components/DataSection'
import { getUsers } from '@/actions/queries';
import UserTable from './_components/UserTable';
import { IPageSearchParams } from '@/types';

export default function page({ searchParams }: IPageSearchParams) {
    return (

        <div className='rounded-md border'>
            <div className="flex flex-col gap-8 p-4 md:p-8">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        Good Taste Users
                    </h2>
                    <p className="text-muted-foreground">
                        A list of all the users in Good Taste. You can search, filter, and sort the users to find specific information. Use the actions menu to view more details about each user.
                    </p>
                </div>
                <DataSection label="users">
                    <Users searchParams={searchParams} />
                </DataSection>
            </div>
        </div>
    )
}

async function Users({ searchParams }: IPageSearchParams) {

    const params = await searchParams;

    const result = await getUsers({ ...params, roles: params.roles ?? 'customer' });
    
    return (
        <UserTable result={result} />
    )
}
