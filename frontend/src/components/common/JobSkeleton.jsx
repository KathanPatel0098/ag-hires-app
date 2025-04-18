import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const JobSkeleton = () => {
  return (
    <div className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Skeleton circle width={40} height={40} />
          </div>
          <div className="ml-4 w-full">
            <Skeleton width={200} height={24} />
            <Skeleton width={150} height={16} className="mt-2" />
          </div>
        </div>
        <div className="mt-4">
          <Skeleton width={100} height={16} />
          <Skeleton width={80} height={16} className="mt-2" />
        </div>
        <div className="mt-4">
          <Skeleton width={120} height={32} />
        </div>
      </div>
    </div>
  );
};

export default JobSkeleton; 