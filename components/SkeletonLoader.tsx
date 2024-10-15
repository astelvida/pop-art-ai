export function SkeletonLoader() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-muted animate-pulse">
      <div className="w-16 h-16 rounded-full bg-muted-foreground/20"></div>
    </div>
  )
}
