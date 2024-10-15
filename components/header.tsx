// "use client"

// import Link from "next/link"
// import Image from "next/image"
// import { GithubIcon, MessageSquare } from "lucide-react"
// import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs"

// import { Button } from "@/components/ui/button"

// export function Header() {
//   const { isSignedIn } = useAuth()

//   return (
//     <header className="border-b">
//       <div className="container flex h-16 items-center justify-between px-4">
//         <div className="flex items-center space-x-4">
//           <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
//             <Button variant="ghost" size="icon">
//               <GithubIcon className="h-5 w-5" />
//               <span className="sr-only">GitHub</span>
//             </Button>
//           </Link>
//           <Link href="/feedback">
//             <Button variant="ghost" size="sm" className="hidden sm:flex">
//               <MessageSquare className="mr-2 h-4 w-4" />
//               Feedback
//             </Button>
//           </Link>
//           {isSignedIn ? (
//             <UserButton afterSignOutUrl="/" />
//           ) : (
//             <div className="flex items-center space-x-2">
//               <SignInButton mode="modal">
//                 <Button variant="ghost" size="sm">
//                   Sign In
//                 </Button>
//               </SignInButton>
//               <SignUpButton mode="modal">
//                 <Button variant="ghost" size="sm">
//                   Sign Up
//                 </Button>
//               </SignUpButton>
//             </div>
//           )}
//         </div>
//         <Link href="/" className="flex items-center space-x-2">
//           <Image
//             src="/placeholder.svg?height=32&width=32"
//             alt="App logo"
//             width={32}
//             height={32}
//             className="rounded-lg"
//           />
//           <span className="text-xl font-bold">App Name</span>
//         </Link>
//       </div>
//     </header>
//   )
// }
"use client";

import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"; import { Menu, X } from "lucide-react"; import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(isMenuOpen);
  }
  return (
    <div className="flex items-center space-x-4 justify-end mt-4 mr-4">
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
      {/* <div className="md:hidden">
        <Button
          variant="ghost"
          size="icon" onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div> */}
    </div >
  );
}
