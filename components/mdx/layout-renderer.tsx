import type { MDXComponents } from 'mdx/types'
import React from 'react'
import ReactDOM from 'react-dom'
import * as _jsx_runtime from 'react/jsx-runtime'

export interface MDXLayoutRenderer {
  code: string
  components?: MDXComponents
  [key: string]: unknown
}

function getMDXComponent(
  code: string,
  globals: Record<string, unknown> = {}
): React.ComponentType<any> {
  let scope = { React, ReactDOM, _jsx_runtime, ...globals }
  let fn = new Function(...Object.keys(scope), code)
  return fn(...Object.values(scope)).default
}

// TS transpile it to a require which causes ESM error
// Copying the function from contentlayer as a workaround
// Copy of https://github.com/contentlayerdev/contentlayer/blob/main/packages/next-contentlayer/src/hooks/useMDXComponent.ts
export function useMDXComponent(
  code: string,
  globals: Record<string, unknown> = {}
): React.ComponentType<any> {
  return React.useMemo(() => getMDXComponent(code, globals), [code, globals])
}

export function MDXLayoutRenderer({ code, components, ...rest }: MDXLayoutRenderer) {
  let Mdx = useMDXComponent(code)
  return <Mdx components={components} {...rest} />
}
