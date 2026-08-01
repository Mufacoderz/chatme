export function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`bg-[var(--surface2)] animate-pulse ${className}`} />
}
