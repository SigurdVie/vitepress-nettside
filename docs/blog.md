---
layout: home
title: "My Blog"
sidebar: false
---

<script setup>
  import Hero from './components/Hero.vue'
</script>

<Hero 
    title="My Blog"
    subtitle="Welcome to my ramblings."
  />

<BlogPostList
    format="horizontal"
    filterAuthors="sigurd"
    maxCards="-1"
    excerptLines="2"
  />
