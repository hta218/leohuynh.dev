import clsx from 'clsx'

export function Button({
  children,
  as: Component = 'button',
  className,
  ...rest
}: {
  children: React.ReactNode
  as?: React.ElementType
  className?: string
} & React.ComponentProps<'button' | 'a'>) {
  return (
    <Component
      className={clsx([
        'border border-transparent',
        'bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500',
        'text-white hover:text-white dark:text-white dark:hover:text-white',
        'focus:shadow-outline-blue focus:outline-hidden',
        'transition-colors duration-150',
        'text-sm leading-5 font-medium',
        'inline rounded-lg px-4 py-2 shadow-sm',
        'inline-flex items-center gap-1 no-underline',
        className,
      ])}
      {...rest}
    >
      {children}
    </Component>
  )
}
