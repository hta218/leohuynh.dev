import clsx from 'clsx'

export function AsciiArtText({
  content,
  className,
}: { content?: string; className?: string }) {
  if (!content) {
    return null
  }
  return (
    <pre
      className={clsx(
        'text-xs pb-2 leading-tight font-mono overflow-x-auto whitespace-pre',
        className,
      )}
      style={{
        fontFamily:
          'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
        fontFeatureSettings: '"liga" 0, "clig" 0',
        textRendering: 'optimizeSpeed',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        wordSpacing: '0',
        letterSpacing: '0',
        fontVariantLigatures: 'none',
      }}
    >
      {content}
    </pre>
  )
}
