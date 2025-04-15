<script setup>
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <header class="bg-white shadow-md">
     
    </header>

    <main class="flex-grow">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-block-size: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  inline-size: 100%;
  font-size: 12px;
  text-align: center;
  margin-block-start: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-inline-start: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-inline-end: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: start;
    margin-inline-start: -1rem;
    font-size: 1rem;
    padding: 1rem 0;
    margin-block-start: 1rem;
  }
}
</style>
