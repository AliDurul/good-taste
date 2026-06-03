'use client'
import { Search } from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { useUrlParams } from '@/hooks/useUrlParams';

export default function SearchInput({ className, placeholder }: { className?: string, placeholder?: string }) {
    const { updateUrlParams, getParam, hasParam } = useUrlParams();

    const [query, setQuery] = useState(getParam('search') || '');
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        const delayBounceFn = setTimeout(() => {
            startTransition(() => {
                if (query) {
                    updateUrlParams({ search: query, page: null }, { replace: true })
                } else {
                    if (hasParam('search')) {
                        updateUrlParams({ search: null, page: null }, { replace: true })
                    }
                }
            })
        }, 500)

        return () => clearTimeout(delayBounceFn)

    }, [query])


    return (
        <div className={`relative flex-1 ${className}`}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 text-center sm:text-left"
            />
            {isPending && <div className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />}
        </div>
    )
}
