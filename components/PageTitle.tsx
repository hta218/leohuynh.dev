import type { PageTitleProps } from '~/types'

export function PageTitle({ children }: PageTitleProps) {
  return (
    <h1 className="text-[34px] font-extrabold leading-10 tracking-tight text-gray-900 dark:text-gray-100 md:text-5xl md:leading-14 lg:text-[54px] lg:leading-[64px]">
      {children}
    </h1>
  )
}
