"use client"
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Github, MessageSquare } from "lucide-react"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(isMenuOpen);
  }
  return (
    <header className="flex items-center justify-between p-4 bg-background border-b">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Github className="h-6 w-6" />
          </Button>
          <Image
            src="/logo.png"
            alt="POP ART Logo"
            width={40}
            height={40}
          />
          <Link href="/" className="text-2xl font-bold" style={{ fontFamily: "'Rubik Mono One', sans-serif" }}>
            POP ART
          </Link>
        </div>
        <nav className="flex space-x-4">
          <Link href="/" className={`${pathname === '/' ? 'font-bold' : ''}`}>
            Home
          </Link>
          <Link href="/explore" className={`${pathname === '/explore' ? 'font-bold' : ''}`}>
            Explore
          </Link>
          <Link href="/my-library" className={`${pathname === '/my-library' ? 'font-bold' : ''}`}>
            My Library
          </Link>
        </nav>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Feedback
          </Button>
        </div>

    <div className="flex items-center space-x-4 justify-end mt-4 mr-4">
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="icon" onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>
    </div >
    </header>
  )
}
