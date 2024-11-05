'use client'
import React, { Suspense, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import { Menu, X } from 'lucide-react'
import { SearchBox } from './search-box'

export function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className='flex items-center justify-between bg-background'>
      <Link href='/' className='flex items-center space-x-2'>
        <Image src='/speech-bubble.webp' alt='POP ART Logo' width={60} height={60} className='rounded-full' />
        <h2 className='font-rubik text-2xl font-bold'>Pop Art AI </h2>
      </Link>

      <SearchBox />

      <div className='flex items-center space-x-4'>
        <Link href='https://github.com/astelvida/pop-art-ai' target='_blank' rel='noopener noreferrer'>
          <GitHubLogoIcon className='h-8 w-8' />
        </Link>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <div className='md:hidden'>
          <Button variant='ghost' size='icon' onClick={toggleMenu} aria-label='Toggle menu'>
            {isMenuOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className='absolute left-0 right-0 top-16 z-50 bg-background p-4 md:hidden'>
          <nav>
            <ul className='space-y-2'>
              <li>
                <Link href='/explore' className={`block ${pathname === '/explore' ? 'font-bold' : ''}`}>
                  Explore
                </Link>
              </li>
              <li>
                <Link href='/library' className={`block ${pathname === '/library' ? 'font-bold' : ''}`}>
                  Library
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}
