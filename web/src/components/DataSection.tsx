import { Suspense, type ReactNode } from 'react'
import { SectionErrorBoundary } from './SectionErrorFallback'

interface DataSectionProps {
    label: string
    fallback?: ReactNode
    children: ReactNode
}

export function DataSection({ label, fallback, children }: DataSectionProps) {
    return (
        <SectionErrorBoundary label={label}>
            <Suspense fallback={fallback ?? <div>Loading {label}…</div>}>
                {children}
            </Suspense>
        </SectionErrorBoundary>
    )
}
