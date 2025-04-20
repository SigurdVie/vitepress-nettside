<template>
  <div class="blog-hero">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">{{ title }}</h1>
        <h2 class="subtitle">
          {{ subtitle }}
        </h2>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
  },
};
</script>


<style scoped>
.blog-hero {
  text-align: center;
}

h1.title {
  margin-bottom: 0.5rem; /* Reduce the bottom margin */
}

h2.subtitle {
  font-size: 1.2rem;
  border-top: none;
  color: gray;
  margin-top: 0; /* Remove any top margin */
}
</style>