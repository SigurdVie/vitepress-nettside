import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Sigurd E. H. Vie",
  description: "Politics, technology, sience & nature",
  themeConfig: {
    footer: {
      message: 'Released under the X License.',
      copyright: 'Copyright © 2025-present Sigurd E. H. Vie',
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Blog', link: '/blog' }
    ],

    sidebar: [
      {
        text: 'Blog',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})

export interface Footer {
  message: string
  copyright: string
}