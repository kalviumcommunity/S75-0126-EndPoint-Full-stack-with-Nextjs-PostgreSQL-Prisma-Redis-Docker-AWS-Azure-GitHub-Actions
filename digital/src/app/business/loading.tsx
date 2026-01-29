import SkeletonLoader from '@/components/SkeletonLoader';

export default function BusinessLoading() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
      </div>
      <SkeletonLoader type="card" count={3} />
    </div>
  );
}