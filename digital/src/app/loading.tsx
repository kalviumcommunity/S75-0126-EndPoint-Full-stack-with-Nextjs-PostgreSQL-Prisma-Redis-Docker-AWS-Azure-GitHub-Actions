import SkeletonLoader from '@/components/SkeletonLoader';

export default function GlobalLoading() {
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-screen">
      <div className="mb-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse mx-auto"></div>
      </div>
      <SkeletonLoader type="list" count={2} />
    </div>
  );
}