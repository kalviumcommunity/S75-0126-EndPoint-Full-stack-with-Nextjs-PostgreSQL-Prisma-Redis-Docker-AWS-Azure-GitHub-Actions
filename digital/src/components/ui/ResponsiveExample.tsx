export default function ResponsiveExample() {
  return (
    <div className="p-4 md:p-8 lg:p-12 bg-white dark:bg-gray-900">
      <h1 className="text-lg md:text-2xl lg:text-3xl font-semibold text-gray-900 dark:text-white">
        Responsive Heading
      </h1>
      <p className="mt-4 text-base md:text-lg text-gray-600 dark:text-gray-300">
        This text size and padding adjusts based on screen size.
      </p>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
          <h3 className="font-medium text-gray-800 dark:text-gray-200">Column 1</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">On small screens: full width</p>
        </div>
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
          <h3 className="font-medium text-gray-800 dark:text-gray-200">Column 2</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">On medium screens: half width</p>
        </div>
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
          <h3 className="font-medium text-gray-800 dark:text-gray-200">Column 3</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">On large screens: third width</p>
        </div>
      </div>
    </div>
  );
}