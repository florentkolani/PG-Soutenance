<template>
  <div class="min-h-screen bg-gray-100">
    <Header 
      title=" NOVA LEAD" 
      @primaryAction="redirectToDashboard"
    />
    <div class="container mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h1 class="text-3xl font-bold mb-4 text-center text-gray-800">À propos de NOVA LEAD</h1>
      <p class="mb-4 text-gray-600">
        NOVA LEAD est une entreprise innovante spécialisée dans la fourniture de solutions technologiques avancées. 
        Notre mission est de transformer les défis complexes en opportunités grâce à des solutions sur mesure et à la pointe de la technologie.
      </p>
      <h2 class="text-2xl font-semibold mb-2 text-gray-700">Notre Vision</h2>
      <p class="mb-4 text-gray-600">
        Être un leader mondial dans le domaine des technologies de l'information, en offrant des produits et services de qualité supérieure 
        qui répondent aux besoins évolutifs de nos clients.
      </p>
      <h2 class="text-2xl font-semibold mb-2 text-gray-700">Nos Valeurs</h2>
      <ul class="list-disc list-inside mb-4 text-gray-600">
        <li>Innovation</li>
        <li>Excellence</li>
        <li>Intégrité</li>
        <li>Collaboration</li>
        <li>Responsabilité</li>
      </ul>
      <h2 class="text-2xl font-semibold mb-2 text-gray-700">Contactez-nous</h2>
      <p class="text-gray-600">
        Pour plus d'informations, veuillez nous contacter à <a href="mailto:hello@novalead.dev" class="text-blue-500 underline">hello@novalead.dev</a>
      </p>
    </div>
  </div>
</template>

<script>
import Header from '@/components/layouts/Header.vue';

export default {
  name: 'Apropos',
  components: {
    Header,
  },
  methods: {
    redirectToDashboard() {
      this.$router.push('/dashboard');
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
  background-color: #f9fafb;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
h1 {
  color: #2d3748;
}
h2 {
  color: #4a5568;
}
p, ul {
  color: #718096;
}
a {
  color: #4299e1;
  text-decoration: underline;
}
</style>
