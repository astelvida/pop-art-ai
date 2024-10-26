'use client'

import Link from 'next/link'
import { ChevronRight, Search, type LucideIcon } from 'lucide-react'

import { useIsMobile } from '@/hooks/useMobile'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'

export function SearchBar({
  className,
  items,
  searchResults,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
  searchResults: React.ComponentProps<typeof SidebarSearch>['results']
} & React.ComponentProps<'ul'>) {
  return (
    <ul className={cn('grid gap-0.5', className)}>
      <li>
        <SidebarSearch results={searchResults} />
      </li>
    </ul>
  )
}

export function SidebarSearch({
  results,
}: {
  results: {
    title: string
    teaser: string
    url: string
  }[]
}) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger className='flex h-8 w-full min-w-8 flex-1 items-center gap-2 overflow-hidden rounded-md px-1.5 text-sm font-medium outline-none ring-ring transition-all hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground'>
          <Search className='h-4 w-4 shrink-0' />
          <div className='flex flex-1 overflow-hidden'>
            <div className='line-clamp-1 pr-6'>Search</div>
          </div>
        </DrawerTrigger>
        <DrawerContent>
          <form>
            <div className='border-b p-2.5'>
              <Input
                type='search'
                placeholder='Search...'
                className='h-8 rounded-sm shadow-none focus-visible:ring-0'
              />
            </div>
          </form>
          <div className='grid gap-1 p-1.5 text-sm'>
            {results.map((result) => (
              <Link
                href={result.url}
                key={result.title}
                className='rounded-md p-2.5 outline-none ring-ring hover:bg-accent hover:text-accent-foreground focus-visible:ring-2'
              >
                <div className='font-medium'>{result.title}</div>
                <div className='line-clamp-2 text-muted-foreground'>{result.teaser}</div>
              </Link>
            ))}
            <Separator className='my-1.5' />
            <Link
              href='#'
              className='rounded-md px-2.5 py-1 text-muted-foreground outline-none ring-ring hover:text-foreground focus-visible:ring-2'
            >
              See all results
            </Link>
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Popover>
      <PopoverTrigger className='flex h-8 w-full min-w-8 flex-1 items-center gap-2 overflow-hidden rounded-md px-1.5 text-sm font-medium outline-none ring-ring transition-all hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground'>
        <Search className='h-4 w-4 shrink-0' />
        <div className='flex flex-1 overflow-hidden'>
          <div className='line-clamp-1 pr-6'>Search</div>
        </div>
      </PopoverTrigger>
      <PopoverContent side='right' align='start' sideOffset={4} className='w-96 p-0'>
        <form>
          <div className='border-b p-2.5'>
            <Input type='search' placeholder='Search...' className='h-8 rounded-sm shadow-none focus-visible:ring-0' />
          </div>
        </form>
        <div className='grid gap-1 p-1.5 text-sm'>
          {results.map((result) => (
            <Link
              href={result.url}
              key={result.title}
              className='rounded-md p-2.5 outline-none ring-ring hover:bg-accent hover:text-accent-foreground focus-visible:ring-2'
            >
              <div className='font-medium'>{result.title}</div>
              <div className='line-clamp-2 text-muted-foreground'>{result.teaser}</div>
            </Link>
          ))}
          <Separator className='my-1.5' />
          <Link
            href='#'
            className='rounded-md px-2.5 py-1 text-muted-foreground outline-none ring-ring hover:text-foreground focus-visible:ring-2'
          >
            See all results
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  )
}
