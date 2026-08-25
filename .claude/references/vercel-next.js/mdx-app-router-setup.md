---
library: /vercel/next.js
topic: mdx-app-router-setup
query: "Configure MDX with @next/mdx in App Router: next.config setup, mdx-components.tsx file, and rendering .mdx pages"
fetched: 2026-08-25
---

### Configure next.config.mjs for MDX

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/mdx.mdx

Update your project configuration to include markdown and MDX file extensions.

```javascript
import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // Optionally, add any other Next.js config below
}

const withMDX = createMDX({
  // Add markdown plugins here, as desired
})

// Merge MDX config with Next.js config
export default withMDX(nextConfig)
```

--------------------------------

### Define global MDX components

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/mdx.mdx

Create this file in the project root to export the useMDXComponents function. This file is mandatory for App Router support.

```tsx
import type { MDXComponents } from 'mdx/types'

const components: MDXComponents = {}

export function useMDXComponents(): MDXComponents {
  return components
}
```

--------------------------------

### Rendering Imported MDX in Pages

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/mdx.mdx

Importing and rendering an MDX file as a component in App or Pages router.

```tsx
import Welcome from '@/markdown/welcome.mdx'

export default function Page() {
  return <Welcome />
}
```

--------------------------------

### Dynamic MDX Imports

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/mdx.mdx

Using dynamic imports to load MDX files based on route parameters in the App Router.

```tsx
export async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { default: Post } = await import(`@/content/${slug}.mdx`)

  return <Post />
}

export function generateStaticParams() {
  return [{ slug: 'welcome' }, { slug: 'about' }]
}

export const dynamicParams = false
```

--------------------------------

### Add an mdx-components.tsx file

Source: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/mdx.mdx

To use MDX with the App Router, you must create an mdx-components.tsx or .js file in the root of your project.
This file is required for the @next/mdx package to function correctly and serves as the central location for
defining global MDX components.
