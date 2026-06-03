'use client'

import { Component, useTransition, type ReactNode } from 'react'
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react'
import { ApiError } from '@/lib/error'

// Shared — used by both SectionErrorBoundary and the route-segment error.tsx
export function ErrorFallback({
    label,
    error,
    onRetry,
}: {
    label?: string
    error: Error
    onRetry: () => void
}) {
    const [isPending, startTransition] = useTransition()
    const apiError = error instanceof ApiError ? error : null

    return (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <div>
                <p className="font-medium text-destructive">
                    {label ? `Failed to load ${label}` : 'Something went wrong'}
                </p>
                {apiError && (
                    <p className="mt-1 text-sm text-muted-foreground">
                        {apiError.status >= 500
                            ? 'Server error — please try again'
                            : apiError.message}
                    </p>
                )}
            </div>
            <button
                onClick={() => startTransition(onRetry)}
                disabled={isPending}
                className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-muted disabled:opacity-50"
            >
                {isPending
                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    : <RefreshCw className="h-3.5 w-3.5" />}
                {isPending ? 'Retrying…' : 'Try again'}
            </button>
        </div>
    )
}

// Class component required for getDerivedStateFromError
class ErrorBoundary extends Component<
    { label: string; children: ReactNode },
    { error: Error | null }
> {
    state = { error: null }

    static getDerivedStateFromError(error: Error) {
        return { error }
    }

    reset = () => this.setState({ error: null })

    render() {
        if (this.state.error) {
            return (
                <ErrorFallback
                    label={this.props.label}
                    error={this.state.error}
                    onRetry={this.reset}
                />
            )
        }
        return this.props.children
    }
}

export { ErrorBoundary as SectionErrorBoundary }