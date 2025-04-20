// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import '@cynber/vitepress-valence/style.css'

import authors from './data/authors.js'
import { data as postsData } from './data/posts.data.mjs';  
import { BlogPostHeader } from '@cynber/vitepress-valence';  
import { BlogPostList } from '@cynber/vitepress-valence';  

//import { BlogHero } from './components/BlogHero.vue';

export default {
  extends: DefaultTheme,
  //Layout: CustomLayout,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'home-hero-image': () => {
        return h('img', {
          src: '/img/avatar.jpg',
          alt: 'Sigurd Vie',
          class: 'home-hero-image'
        })
        
      }
    })
  },
  enhanceApp({ app, router, siteData }) {
    app.provide('authors', authors)  
    app.provide('postsData', postsData)  
    app.component('BlogPostHeader', BlogPostHeader);  
    app.component('BlogPostList', BlogPostList);  
  
    //app.component('BlogHero', BlogHero);
  }
} satisfies Theme
