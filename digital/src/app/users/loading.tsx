import SkeletonLoader from '@/components/SkeletonLoader';

export default function UsersLoading() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
      </div>
      <SkeletonLoader type="list" count={5} />
    </div>
  );
}