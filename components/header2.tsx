import Link from "next/link";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
// import { ModeToggle } from "./mode-toggle";
import Github from "./icons/Github";
import { ThemeToggle } from "./theme-toggle";
// import { EmojiSearch } from "./emoji-search";
// import { SidebarTrigger } from "./ui/sidebar";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background mx-auto ">
      <div className="rounded-xl bg-background shadow-lg">
        <div className="flex h-16 items-center gap-4 px-4">
          <nav className="ml-4 ">
            <Link href="/" className="font-medium hover:text-primary">
              
            </Link>
            <Link href="/favorites" className="font-medium hover:text-primary">
              Faves
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-6">
            <ThemeToggle />
            <Github />
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
        {/* <EmojiSearch placeholder="Search and download AI emojis" /> */}
      </div>
    </header>
  );
}
