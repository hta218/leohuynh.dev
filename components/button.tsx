import clsx from 'clsx'

export function Button({
  children,
  as: Component = 'button',
  className,
}: {
  children: React.ReactNode
  as?: React.ElementType
  className?: string
}) {
  return (
    <Component
      className={clsx([
        'border border-transparent',
        'bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-500',
        'focus:shadow-outline-blue focus:outline-none',
        'transition-colors duration-150',
        'text-sm font-medium leading-5',
        'inline rounded-lg px-4 py-2 shadow',
        className,
      ])}
    >
      {children}
    </Component>
  )
}
