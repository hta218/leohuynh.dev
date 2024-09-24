import clsx from 'clsx'

export function PageHeader({
  title,
  description,
  children,
  className,
}: {
  title: string
  description: React.ReactNode
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div className={clsx('space-y-2 py-6 md:space-y-5', className)}>
      <h1 className="text-3xl font-extrabold leading-9 tracking-tight sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
        {title}
      </h1>
      <div className="text-gray-600 dark:text-gray-400 md:text-lg md:leading-7">{description}</div>
      {children}
    </div>
  )
}
