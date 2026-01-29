import SkeletonLoader from '@/components/SkeletonLoader';

export default function DashboardLoading() {
  return (
    <div className="p-6">
      <SkeletonLoader type="dashboard" count={1} />
    </div>
  );
}