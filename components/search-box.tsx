'use client'

import { Input } from '@/components/ui/input'
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import { SearchIcon } from 'lucide-react'
import { useRef, useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useDebouncedCallback } from 'use-debounce'
import SearchStatus from './search-status'

export function SearchBox({ query, disabled }: { query?: string | null; disabled?: boolean }) {
  const [isPending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isValid, setIsValid] = useState(true)

  const searchParams = useSearchParams()
  const q = searchParams.get('q')?.toString() ?? ''
  const router = useRouter()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (term) {
      params.set('q', term)
    } else {
      params.delete('q')
    }

    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false })
    })
  }, 200)

  const resetQuery = () => {
    startTransition(() => {
      router.push('/', { scroll: false })
      if (inputRef.current) {
        inputRef.current.value = ''
        inputRef.current?.focus()
      }
    })
  }

  return (
    <div className='flex flex-col'>
      <div className='mx-auto mb-4 w-full'>
        <div className='relative flex items-center space-x-2'>
          <div className='relative flex w-full items-center'>
            <SearchStatus searching={isPending} />
            <Input
              disabled={disabled}
              ref={inputRef}
              defaultValue={query ?? ''}
              minLength={3}
              onChange={(e) => {
                const newValue = e.target.value
                if (newValue.length > 2) {
                  setIsValid(true)
                  handleSearch(newValue)
                } else if (newValue.length === 0) {
                  handleSearch(newValue)
                  setIsValid(false)
                } else {
                  setIsValid(false)
                }
              }}
              className={
                'w-full rounded-lg border border-gray-300 py-3 pl-12 pr-4 text-base focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-500'
              }
              placeholder='Search...'
            />
            {q.length > 0 ? (
              <Button
                className='absolute right-2 h-8 w-8 rounded-full text-gray-400'
                variant='ghost'
                type='reset'
                size={'icon'}
                onClick={resetQuery}
              >
                <X className='h-5 w-5' />
              </Button>
            ) : null}
          </div>
        </div>
        {!isValid ? (
          <div className='pt-2 text-xs text-destructive'>Query must be 3 characters or longer</div>
        ) : (
          <div className='h-6' />
        )}
      </div>
    </div>
  )
}

export function SearchSkeleton() {
  return <input className='mt-7 w-full sm:w-96' placeholder='Loading...' disabled />
}
