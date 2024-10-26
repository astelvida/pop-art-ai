'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import { Menu, X } from 'lucide-react'

export function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className='flex items-center justify-between border-b bg-background p-4'>
      <Link href='/' className='flex items-center space-x-2'>
        <Image src='/logo.webp' alt='POP ART Logo' width={50} height={50} />
        <p className='font-bangers text-xl font-bold'>moody pop art</p>
      </Link>

      <nav className='hidden md:block'>
        <ul className='flex space-x-4'>
          <li>
            <Link href='/explore' className={`text-lg ${pathname === '/explore' ? 'font-bold' : ''}`}>
              Explore
            </Link>
          </li>
          <li>
            <Link href='/library' className={`text-lg ${pathname === '/library' ? 'font-bold' : ''}`}>
              Library
            </Link>
          </li>
          <li>
            <Link href='/dashboard' className={`text-lg ${pathname === '/dashboard' ? 'font-bold' : ''}`}>
              Dashboard
            </Link>
          </li>
        </ul>
      </nav>

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
