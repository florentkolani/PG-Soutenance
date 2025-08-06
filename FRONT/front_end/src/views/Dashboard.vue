<template>
  <div>
    <!-- Notification Bell for Dashboard -->
    <button @click="showNotifications = true" class="fixed top-4 right-4 z-50 bg-white rounded-full shadow p-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700 hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    </button>
    <NotificationModal :visible="showNotifications" @close="showNotifications = false" />
    <!-- ... existing dashboard content ... -->
  </div>
</template>

<script>
import NotificationModal from '@/components/layouts/NotificationModal.vue';
// ... existing code ...
export default {
  // ... existing code ...
  components: {
    // ... existing code ...
    NotificationModal,
  },
  data() {
    return {
      showNotifications: false,
      // ... existing code ...
    };
  },
  // ... existing code ...
};
</script>
// ... existing code ... 