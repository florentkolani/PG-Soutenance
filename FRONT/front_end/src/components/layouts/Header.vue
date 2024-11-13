<template>
    <header class="bg-lime-500 p-4 shadow-md">
      <div class="container mx-auto flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <img src="@/assets/logo.png" alt="Logo" class="h-10" />
          <span class="text-white text-xl font-bold">NOVA Lead</span>
        </div>
        <div class="flex items-center space-x-4">
          <button @click="$emit('showProductModal')" class="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition">
            Nouveau <span class="ml-1">+</span>
          </button>
          <button class="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition flex items-center">
            Filtrer
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  </template>
  
  <script>
  export default {
    name: "Header"
  };
  </script>
  
  <style scoped>
  /* Ajoutez ici tout style spécifique à votre header */
  </style>
  