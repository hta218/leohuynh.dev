import { Brand } from '~/components/ui/brand'

export function BuiltWith() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-500 dark:text-gray-400 text-sm">
        Built with:
      </span>
      <div className="flex space-x-1.5">
        <Brand name="NextJS" iconClassName="h-5 w-5" />
        <Brand name="TailwindCSS" iconClassName="h-5 w-5" />
        <Brand name="Typescript" iconClassName="h-5 w-5" />
        <Brand name="Supabase" iconClassName="h-5 w-5" />
        <Brand name="Drizzle" iconClassName="h-5 w-5 bg-dark px-0.5" />
        <Brand name="Umami" iconClassName="h-5 w-5" className="pl-px" />
        <Brand name="Biome" iconClassName="h-5 w-5" />
      </div>
    </div>
  )
}
