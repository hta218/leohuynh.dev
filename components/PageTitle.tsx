import type { PageTitleProps } from '~/types'

export function PageTitle({ children }: PageTitleProps) {
  return (
    <h1 className="text-[24px] font-extrabold leading-10 tracking-tight text-gray-900 dark:text-gray-100 md:text-base md:leading-14 lg:text-[34px] lg:leading-[44px]">
      {children}
    </h1>
  )
}
