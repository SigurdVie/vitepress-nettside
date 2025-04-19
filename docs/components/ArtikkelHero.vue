<template>
  <div class="artikkel-hero">
    <img v-if="image" :src="image" :alt="title" class="hero-image" />
    <div class="hero-content">
      <h1 class="title">{{ title }}</h1>
      <h2 v-if="subtitle" class="subtitle">{{ subtitle }}</h2>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: null,
  },
  image: {
    type: String,
    default: '/img/placeholder.png', // Default image path
  },
});
</script>

<style scoped>
.artikkel-hero {
  text-align: center;
  margin-bottom: 2rem;
}

.hero-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.title {
  font-size: 2.5rem;
  margin: 0.5rem 0;
}

.subtitle {
  font-size: 1.5rem;
  color: gray;
  margin: 0;
}
</style>