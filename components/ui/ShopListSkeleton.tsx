import { Skeleton } from "./skeleton";

export default function ShopListSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-5 w-[220px]" />
      <Skeleton className="h-5 w-[200px]" />
      <Skeleton className="h-5 w-[180px]" />
    </div>
  );
}
