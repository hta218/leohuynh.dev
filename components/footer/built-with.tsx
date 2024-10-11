import { Brand } from '~/components/ui/brand'

export function BuiltWith() {
  return (
    <div className="flex items-center space-x-1">
      {/* <span className="mr-1 text-gray-500 dark:text-gray-400">Built with</span> */}
      <div className="flex space-x-1.5">
        <Brand name="NextJS" iconClassName="h-5 w-5" />
        <Brand name="TailwindCSS" iconClassName="h-5 w-5" />
        <Brand name="Prisma" iconClassName="h-5 w-5" />
        <Brand name="Typescript" iconClassName="h-5 w-5" />
        <Brand name="Umami" iconClassName="h-5 w-5" className="pl-px" />
      </div>
    </div>
  )
}
