export function SkeletonLoader() {
  return (
    <div className='flex h-full w-full animate-pulse items-center justify-center bg-muted'>
      <div className='h-16 w-16 rounded-full bg-muted-foreground/20'></div>
    </div>
  )
}
