<template>
  <div class="article-card">
    <a :href="href"><img :src="image" :alt="title"></a>
    <h2><a :href="href" class="title-link">{{ title }}</a></h2>
    <p>{{ excerpt }}</p>
    <div class="meta">
      <span>By {{ author }} | </span>
      <span>{{ date }}</span>
    </div>
    <a :href="href" class="read-more">Read more</a>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  excerpt: String,
  image: {
    type: String,
    default: './img/placeholder.png'
  },
  author: String,
  href: String,
  date: String
})
</script>

<style scoped>
.title-link {
  color: inherit;
  text-decoration: none;
}

.title-link:hover {
  text-decoration: underline;
}

.read-more {
  display: inline-block;
  margin-top: 8px;
  color: #007BFF;
  text-decoration: none;
  font-weight: bold;
}

.article-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
}

.article-card img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

.article-card img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  object-position: center;
  height: auto;
  border-radius: 4px;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.article-card img:hover {
  transform: scale(1.02) rotate(0.5deg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.meta {
  color: #666;
  font-size: 0.9em;
  margin: 8px 0;
}
</style>