<template>
  <div>
    <div
      tabindex="-1"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50"
    >
      <div class="relative p-4 w-full max-w-2xl bg-white rounded-lg shadow">
        <div class="relative p-4">
          <div class="flex justify-between items-center pb-4 mb-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900">Add User</h3>
            <button
              @click="$emit('close')"
              class="text-red-600 hover:text-red-800 text-2xl"
            >
              &times;
            </button>
          </div>
          <!-- Modal body -->
          <form @submit.prevent="registerUser">
            <div class="grid gap-4 mb-4 sm:grid-cols-2">
              <div>
                <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Name</label>
                <input
                  v-model="user.name"
                  type="text"
                  id="name"
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900">Email</label>
                <input
                  v-model="user.email"
                  type="email"
                  id="email"
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <label for="password" class="block mb-2 text-sm font-medium text-gray-900">Password</label>
                <input
                  v-model="user.password"
                  type="password"
                  id="password"
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <div>
                <label for="contact" class="block mb-2 text-sm font-medium text-gray-900">Contact</label>
                <input
                  v-model="user.contact"
                  type="text"
                  id="contact"
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                  placeholder="Enter your contact number"
                  required
                />
              </div>
              <div>
                <label for="role" class="block mb-2 text-sm font-medium text-gray-900">Role</label>
                <select
                  v-model="user.role"
                  id="role"
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                >
                  <option value="Client">Client</option>
                  <option value="Admin">Admin</option>
                  <option value="AgentSupport">Agent Support</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              class="text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              Add User
            </button>
          </form>
        </div>
      </div>
    </div>

    
    <div v-if="showDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="bg-white p-5 rounded-lg shadow-xl text-center">
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
</template>

<script>
export default {
  data() {
    return {
      user: {
        name: '',
        email: '',
        password: '',
        contact: '',
        role: 'Client',
      },
      showDialog: false,
      dialogMessage: '',
      dialogType: '',
    };
  },
  methods: {
    async registerUser() {
      try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.user),
        });
        if (response.ok) {
          this.dialogType = 'success';
          this.dialogMessage = 'User registered successfully';
          this.showDialog = true;
          this.resetForm();
        } else {
          this.dialogType = 'error';
          this.dialogMessage = 'Failed to register user';
          this.showDialog = true;
        }
      } catch (error) {
        console.error('Error registering user:', error);
        this.dialogType = 'error';
        this.dialogMessage = 'An error occurred';
        this.showDialog = true;
      }
    },
    closeDialog() {
      this.showDialog = false;
    },
    resetForm() {
      this.user = {
        name: '',
        email: '',
        password: '',
        contact: '',
        role: 'Client',
      };
    },
  },
};
</script>

<style scoped>
/* Ajoutez vos styles personnalisés ici si nécessaire */
</style>
