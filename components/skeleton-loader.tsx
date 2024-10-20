export function SkeletonLoader() {
  return (
    <div className='flex h-full w-full animate-pulse items-center justify-center bg-muted'>
      <div className='h-16 w-16 rounded-full bg-muted-foreground/20'></div>

      {/* <div className='flex h-full w-56 flex-shrink-0 flex-col border-l'>
  <div className='border-b p-2 text-center text-xl'>{image.name || 'a pop art image'}</div>
  <div className='p-2'>
    <div>Uploaded By:</div>
    <div>{userInfo.fullName}</div>
  </div>

  <div className='p-2'>
    <div>Created On:</div>
    <div>{image.createdAt.toLocaleDateString()}</div>
  </div>
</div> 
 */}
    </div>
  )
}
