import { SearchIcon, Loader2 } from 'lucide-react'

export default function SearchStatus({ searching }: { searching: boolean }) {
  return (
    <div className='absolute left-4 w-5'>
      {searching ? (
        <Loader2 aria-hidden='true' className='text-gray h-5 w-5 animate-spin' />
      ) : (
        <SearchIcon aria-hidden='true' className='text-gray h-5 w-5' />
      )}
    </div>
  )
}
