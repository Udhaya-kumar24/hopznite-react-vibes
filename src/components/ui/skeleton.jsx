import React from 'react';
import { cn } from "@/lib/utils"

const Skeleton = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

const CardSkeleton = ({ className = "" }) => (
  <div className={`overflow-hidden bg-card/80 border border-border ${className}`}>
    <div className="aspect-video">
      <Skeleton className="w-full h-full bg-muted" />
    </div>
    <div className="p-4">
      <Skeleton className="h-6 w-3/4 mb-2 bg-muted" />
      <Skeleton className="h-4 w-1/2 mb-1 bg-muted" />
      <Skeleton className="h-4 w-2/3 mb-3 bg-muted" />
      <div className="flex gap-2">
        <Skeleton className="h-8 flex-1 bg-muted" />
      </div>
    </div>
  </div>
);

export { Skeleton, CardSkeleton }
