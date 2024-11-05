import React from 'react'
// import { SearchIcon } from './icons/SearchIcon';
// import { SpinnerIcon } from './icons/SpinnerIcon';

export function SearchIcon({ className, ...otherProps }: Props & React.SVGAttributes<SVGElement>) {
  return (
    <svg
      {...otherProps}
      className={className}
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth='2'
    >
      <path strokeLinecap='round' strokeLinejoin='round' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
    </svg>
  )
}

export function SpinnerIcon({ className, ...otherProps }: Props & React.SVGAttributes<SVGElement>) {
  return (
    <svg {...otherProps} className={className} xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
      <path
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
        d='M20 4v5h-.582m0 0a8.001 8.001 0 00-15.356 2m15.356-2H15M4 20v-5h.581m0 0a8.003 8.003 0 0015.357-2M4.581 15H9'
      />
    </svg>
  )
}

export default function SearchStatus({ searching }: { searching: boolean }) {
  return (
    <div className='absolute left-4'>
      {searching ? (
        <div aria-label='searching...' className='h-fit w-fit animate-spin'>
          <SpinnerIcon aria-hidden='true' width={16} height={16} className='text-gray stroke-slate-500' />
        </div>
      ) : (
        <SearchIcon aria-hidden='true' width={16} height={16} className='text-gray stroke-slate-500' />
      )}
    </div>
  )
}
