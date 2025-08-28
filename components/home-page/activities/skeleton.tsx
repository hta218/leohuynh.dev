export function ActivitiesSkeleton() {
  return (
    <div className="space-y-4 md:space-y-8 pt-8">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold sm:text-2xl sm:leading-10 md:text-4xl">
          Side quests and activities
        </h3>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700" />
      <div className="pt-2 md:pt-0 space-y-6 animate-pulse">
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32" />
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-40" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-36" />
          <div className="flex items-center gap-3">
            <div className="w-20 h-28 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
