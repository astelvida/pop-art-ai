import { Palette, Sparkles, Zap } from 'lucide-react'
import Link from 'next/link'

const navTabs = [
  { id: 'explore', name: 'Explore', href: '/explore', icon: Sparkles },
  { id: 'library', name: 'Library', href: '/library', icon: Palette },
  { id: 'favorites', name: 'Favorites', href: '/favorites', icon: Zap },
]

type TabButtonsProps = {
  activeTab: string
  children?: React.ReactNode
}

export function TabButtons({ activeTab, children }: TabButtonsProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {navTabs.map((tab) => (
            <Link href={tab.href} key={tab.id} scroll={false}>
              <button
                key={tab.id}
                className={`
            flex items-center justify-center gap-2 py-4 px-6 text-lg font-bold uppercase
            transition-all duration-300 ease-in-out
            ${
              activeTab === tab.id
                ? 'bg-black text-white translate-y-1 translate-x-1 shadow-none'
                : 'bg-white text-black border-4 border-black hover:bg-purple-100'
            }
            rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
          `}
              >
                <tab.icon className="w-6 h-6" />
                <h4 className="text-lg">{tab.name}</h4>
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
