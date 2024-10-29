<template>
  <div>
    <!-- Add Product Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="relative p-4 w-full max-w-2xl bg-white rounded-lg shadow">
        <div class="relative p-4">
          <div class="flex justify-between items-center pb-4 mb-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900">Add Product</h3>
            <button @click="$emit('close')" class="text-red-600 hover:text-red-800 text-2xl">&times;</button>
          </div>

          <form @submit.prevent="addProduct">
            <div class="mb-4">
              <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Product Name</label>
              <input v-model="product.name" type="text" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5" placeholder="Enter product name" required />
            </div>
            
            <div class="mb-4">
              <label for="description" class="block mb-2 text-sm font-medium text-gray-900">Description</label>
              <textarea v-model="product.description" id="description" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5" placeholder="Enter product description"></textarea>
            </div>
            <button type="submit" class="text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-5 py-2.5">Add Product</button>
          </form>
        </div>
      </div>
    </div>

    <!-- Dialog for success/error messages -->
    <div v-if="showDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="relative p-4 w-full max-w-md bg-white rounded-lg shadow">
        <div class="text-center p-4">
          <div :class="['text-6xl mb-4', dialogType === 'success' ? 'text-green-500' : 'text-red-500']">
            <i v-if="dialogType === 'success'" class="fas fa-check-circle"></i>
            <i v-else class="fas fa-times-circle"></i>
          </div>
          <p class="text-xl mb-4">{{ dialogMessage }}</p>
          <button @click="closeDialog" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['showModal'],
  data() {
    return {
      product: {
        name: '',
        description: '',
      },
      showDialog: false,
      dialogMessage: '',
      dialogType: '',
    };
  },
  methods: {
    async addProduct() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(this.product),
        });

        if (response.ok) {
          this.dialogType = 'success';
          this.dialogMessage = 'Product added successfully';
          this.showDialog = true;
          this.resetForm();
          this.$emit('product-added'); // Émet un événement pour rafraîchir la liste des produits
        } else {
          this.dialogType = 'error';
          this.dialogMessage = 'Failed to add product';
          this.showDialog = true;
        }
      } catch (error) {
        console.error('Error adding product:', error);
        this.dialogType = 'error';
        this.dialogMessage = 'An error occurred';
        this.showDialog = true;
      }
    },
    closeDialog() {
      this.showDialog = false;
      this.$emit('close'); // Ferme le modal principal après la fermeture du message de succès
    },
    resetForm() {
      this.product = {
        name: '',
        description: '',
      };
    },
  },
};
</script>

<style scoped>
/* Custom styles if necessary */
</style>
