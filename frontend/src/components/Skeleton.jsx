import React from 'react';

const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-white/5 rounded-2xl ${className}`} />
);

export const ProductSkeleton = () => (
  <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 h-full flex flex-col gap-4">
    <Skeleton className="h-48 w-full rounded-[1.5rem]" />
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <div className="mt-auto space-y-3">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  </div>
);

export default Skeleton;
