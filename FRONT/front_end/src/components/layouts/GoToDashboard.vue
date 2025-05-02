<template>
  <button @click="goToDashboard"
    class="flex items-center space-x-2 text-white bg-green-700 px-4 py-2 rounded-md hover:bg-green-800 transition m-2">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
      stroke-width="2">
      <rect x="3" y="3" width="8" height="8" rx="1" ry="1" fill="currentColor" />
      <rect x="13" y="3" width="8" height="5" rx="1" ry="1" fill="currentColor" />
      <rect x="3" y="13" width="5" height="8" rx="1" ry="1" fill="currentColor" />
      <rect x="13" y="13" width="8" height="8" rx="1" ry="1" fill="currentColor" />
    </svg>

    <span>Dashboard</span>
  </button>
</template>

<script>
export default {
  name: "GoToDashboard",
  methods: {
    goToDashboard() {
      this.$router.push('/dashboard');
    },
  },
};
</script>

<style scoped></style>
