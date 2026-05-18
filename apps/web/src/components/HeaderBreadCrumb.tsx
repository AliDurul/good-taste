'use client';
import React from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb";
import { usePathname } from 'next/navigation';

const formatSegment = (segment: string) => {
    const decodedSegment = decodeURIComponent(segment);

    return decodedSegment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export default function HeaderBreadCrumb() {
    const pathName = usePathname();
    const segments = pathName.split('/').filter(Boolean);

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {segments.map((segment, idx) => {
                    const href = '/' + segments.slice(0, idx + 1).join('/');
                    const isLast = idx === segments.length - 1;
                    const label = formatSegment(segment);

                    return (
                        <React.Fragment key={idx}>
                            {idx > 0 && (
                                <BreadcrumbSeparator className="hidden md:block" />
                            )}
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage>{label}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </React.Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
