"use client"

import Link from "next/link"
import {
  Atom,

} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  // SidebarFooter,
  SidebarHeader,
  SidebarItem,
  // SidebarLabel,
} from "@/components/ui/sidebar"
import { SearchBar } from "./SearchBar"

const data = {

  searchResults: [
    {
      title: "Routing Fundamentals",
      teaser:
        "The skeleton of every application is routing. This page will introduce you to the fundamental concepts of routing for the web and how to handle routing in Next.js.",
      url: "#",
    },
    {
      title: "Layouts and Templates",
      teaser:
        "The special files layout.js and template.js allow you to create UI that is shared between routes. This page will guide you through how and when to use these special files.",
      url: "#",
    },
    {
      title: "Data Fetching, Caching, and Revalidating",
      teaser:
        "Data fetching is a core part of any application. This page goes through how you can fetch, cache, and revalidate data in React and Next.js.",
      url: "#",
    },
    {
      title: "Server and Client Composition Patterns",
      teaser:
        "When building React applications, you will need to consider what parts of your application should be rendered on the server or the client. ",
      url: "#",
    },
    {
      title: "Server Actions and Mutations",
      teaser:
        "Server Actions are asynchronous functions that are executed on the server. They can be used in Server and Client Components to handle form submissions and data mutations in Next.js applications.",
      url: "#",
    },
  ],
}

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium">
          <Atom className="h-5 w-5" />
          AI-pop-art
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarItem>
          <SearchBar
            items={[]} // Pass an empty array as we don't need any items
            searchResults={data.searchResults} // Pass an empty array or actual search results if available
          />
        </SidebarItem>
      </SidebarContent>
    </Sidebar>
  )
}
