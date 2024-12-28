import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

export function ImageDetails({
  title,
  caption,
  description,
  isOpen,
  setIsOpen,
}: {
  title: string
  caption: string
  description: string
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}) {
  return (
    <div
      className={`relative z-20 w-full overflow-y-auto border-l border-gray-200 bg-white p-4 md:fixed md:right-0 md:bottom-0 md:top-0 md:w-[400px] md:transform md:transition-transform md:duration-300 md:ease-in-out ${isOpen ? 'md:translate-x-0' : 'md:translate-x-full'} `}
    >
      <div className="self-start align-top md:hidden">
        <h2 className="mb-6 font-bangers text-4xl font-bold">{title}</h2>
        <p className="mb-4 text-base font-medium">{caption}</p>
        <p className="mb-4 text-sm text-gray-600">{description}</p>
      </div>
      <div className="hidden md:block">
        <Button
          variant="ghost"
          size="icon"
          className="to§p-4 absolute right-4"
          onClick={() => setIsOpen(false)}
          aria-label="Close details"
        >
          <X className="h-4 w-4" />
        </Button>
        <h2 className="mb-6 font-bangers text-4xl font-bold">{title}</h2>
        <p className="mb-4 text-base font-semibold">{caption}</p>
        <p className="mb-4 text-base text-gray-600">{description}</p>
      </div>
    </div>
  )
}
