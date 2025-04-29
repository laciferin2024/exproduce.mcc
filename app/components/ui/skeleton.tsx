import { cn } from '~/lib/utils'

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] rounded-[var(--radius)] bg-background dark:bg-foreground',
        className
      )}
      {...props}
    />
  )
}

export function TextSkeleton({ width = '100%' }: { width?: string | number }) {
  return (
    <Skeleton
      className="h-[var(--space-4)]"
      style={{ 
        '--w-base': typeof width === 'number' ? `${width}px` : width,
        width: 'clamp(var(--space-8), cqw, var(--w-base))'
      }}
    />
  )
}