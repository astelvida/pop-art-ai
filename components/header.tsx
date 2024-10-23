'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { GitHubLogoIcon } from '@radix-ui/react-icons'

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { Menu, MessageSquare, X } from 'lucide-react'
import { useState } from 'react'
import { ModeToggle } from '@/components/mode-toggle'
export function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const toggleMenu = () => {
    setIsMenuOpen(isMenuOpen)
  }
  return (
    <header className='flex items-center justify-between border-b bg-background p-4'>
      <div className='flex items-center space-x-4'>
        <Button variant='ghost' size='icon'>
          <GitHubLogoIcon className='h-6 w-6' />
        </Button>
        <Link href='/' className='flex items-center space-x-2'>
          <Image src='/logo.png' alt='POP ART Logo' width={40} height={40} />
          <p className='text-2xl font-bold' style={{ fontFamily: "'Rubik Mono One', sans-serif" }}>
            moody comics
          </p>
        </Link>
      </div>
      <nav className='flex space-x-4'>
        <Link href='/' className={`${pathname === '/' ? 'font-bold' : ''}`}>
          Home
        </Link>
        <Link href='/explore' className={`${pathname === '/explore' ? 'font-bold' : ''}`}>
          Explore
        </Link>
        <Link href='/my-library' className={`${pathname === '/my-library' ? 'font-bold' : ''}`}>
          My Library
        </Link>
        <Link href='/sdxl' className={`${pathname === '/sdxl' ? 'font-bold' : ''}`}>
          SDXL
        </Link>
      </nav>
      <div className='flex items-center space-x-2'>
        <Button variant='ghost' size='sm'>
          <MessageSquare className='mr-2 h-4 w-4' />
          Feedback
        </Button>
        <ModeToggle />
      </div>

      <div className='mr-4 mt-4 flex items-center justify-end space-x-4'>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <div className='md:hidden'>
          <Button variant='ghost' size='icon' onClick={toggleMenu} aria-label='Toggle menu'>
            {isMenuOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
          </Button>
        </div>
      </div>
    </header>
  )
}
