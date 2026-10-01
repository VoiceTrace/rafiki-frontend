import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return <div className="mx-auto grid w-full max-w-300 gap-4" aria-busy="true">
    <Skeleton className="h-16 w-2/3" />
    <div className="grid gap-3 md:grid-cols-3"><Skeleton className="h-16" /><Skeleton className="h-16" /><Skeleton className="h-16" /></div>
    <Skeleton className="h-14" />
    <div className="grid gap-4 lg:grid-cols-2"><Skeleton className="h-72" /><Skeleton className="h-72" /></div>
  </div>
}
