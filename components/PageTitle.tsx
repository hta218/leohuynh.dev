import type { PageTitleProps } from '~/types'

export function PageTitle({ children }: PageTitleProps) {
  return (
    <h1 className="font-extrabold tracking-tight text-gray-900 dark:text-gray-100 text-[34px] leading-10 md:text-5xl md:leading-14 lg:text-[54px] lg:leading-[64px]">
      {children}
    </h1>
  )
}
