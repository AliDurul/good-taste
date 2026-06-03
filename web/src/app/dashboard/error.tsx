'use client'

export default function Error({
    error,
    unstable_retry,
}: {
    error: Error & { digest?: string }
    unstable_retry: () => void
}) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 p-6">
            <h2 className="font-semibold text-destructive">Something went wrong</h2>
            <button onClick={() => unstable_retry()} className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted">
                Try again
            </button>
        </div>
    )
}