<template>
  <!-- Pagination -->
  <div class="flex justify-end mt-4">
    <button 
      @click="previousPage" 
      :disabled="currentPage === 1" 
      class="px-4 py-2 bg-gray-300 text-gray-700 rounded-l hover:bg-gray-400 disabled:bg-gray-200">
      &laquo; <!-- Left double angle quote entity -->
    </button>
    <span class="px-4 py-2 bg-gray-100 text-gray-700">{{ currentPage }} / {{ totalPages }}</span>
    <button 
      @click="nextPage" 
      :disabled="currentPage === totalPages" 
      class="px-4 py-2 bg-gray-300 text-gray-700 rounded-r hover:bg-gray-400 disabled:bg-gray-200">
      &raquo; <!-- Right double angle quote entity -->
    </button>
  </div>
</template>

<script>
export default {
  props: {
    totalItems: {
      type: Number,
      required: true,
    },
    itemsPerPage: {
      type: Number,
      default: 10,
    },
    initialPage: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      currentPage: this.initialPage,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.itemsPerPage);
    },
  },
  methods: {
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.emitPageChange();
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.emitPageChange();
      }
    },
    emitPageChange() {
      // Émet l'événement avec la page actuelle
      this.$emit("page-changed", this.currentPage);
    },
  },
  watch: {
    totalItems(newTotal) {
      // Si la page actuelle dépasse le total après le changement, réinitialise à 1
      if (this.currentPage > this.totalPages) {
        this.currentPage = 1;
      }
    },
    initialPage(newPage) {
      // Réinitialise la page si `initialPage` change
      if (newPage >= 1 && newPage <= this.totalPages) {
        this.currentPage = newPage;
      }
    },
  },
};
</script>

<style scoped>
/* Style optionnel, adapté à Tailwind CSS */
</style>
