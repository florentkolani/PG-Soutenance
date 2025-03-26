<template>
  <div v-if="show" class="fixed inset-0 z-[60] overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen">
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-50"></div>
      </div>

      <div class="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-md w-full mx-4 sm:mx-0 relative z-[70]">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="flex flex-col items-center justify-center">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full mb-4"
                 :class="{'bg-green-100': type === 'success', 'bg-red-100': type === 'error'}">
              <!-- Icône de succès -->
              <svg v-if="type === 'success'" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <!-- Icône d'erreur -->
              <svg v-else class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div class="text-center">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-2">
                {{ title }}
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  {{ message }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="px-4 py-3 flex justify-center">
          <button
            type="button"
            class="inline-flex justify-center rounded-md border border-transparent shadow-lg px-8 py-3 text-lg font-medium text-black transition-colors duration-200 w-24"
            :class="{
              'bg-green-500 hover:bg-green-600': type === 'success',
              'bg-red-500 hover:bg-red-600': type === 'error'
            }"
            @click="$emit('close')"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DialogModal',
  props: {
    show: Boolean,
    type: {
      type: String,
      default: 'success',
      validator: value => ['success', 'error'].includes(value)
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    }
  },
  emits: ['close']
}
</script> 