<template>
  <div class="min-h-screen bg-gray-100">
    <Header 
      title=" NOVA LEAD" 
      @primaryAction="redirectToDashboard"
    />
    <div class="container mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h1 class="text-3xl font-bold mb-4 text-center text-gray-800">À propos de NOVA LEAD</h1>
      <p class="mb-4 text-gray-600"> 
        NOVA LEAD est une entreprise innovante spécialisée dans la fourniture de solutions technologiques avancées. Depuis sa création, elle s'engage à fournir des solutions financières
        innovantes et adaptées aux besoins des petites et moyennes entreprises ainsi qu'aux particuliers.
      </p>
      
      <h2 class="text-2xl font-semibold mb-2 text-gray-700">Notre Mission</h2>
      <p class="mb-4 text-gray-600">
        Concevoir des solutions logicielles sur mesure qui facilitent la gestion et le développement des
        entreprises, en leur offrant des outils numériques innovants, fiables et adaptés à leurs besoins
        spécifiques forment la mission de NOVA LEAD.
      </p>
      
      <h2 class="text-2xl font-semibold mb-2 text-gray-700">Nos Services</h2>
      <p class="mb-4 text-gray-600">
        Les activités faites par NOVA LEAD sont suivantes :
      </p>
      <ul>
        <li>• Le développement de logiciels sur mesure : la conception et le développement de logiciels personnalisés pour répondre aux besoins spécifiques des clients dans divers secteurs, mais surtout, la microfinance.</li>
        <li>• Les services de maintenance et de support technique : la fourniture de services de maintenance continue et de support technique pour assurer la performance, la fiabilité et la sécurité des solutions logicielles livrées.</li>
        <li>• L’hébergement des applications : c’est la gestion efficace des serveurs, des bases de données et des services cloud.</li>
        <li>• La vente de matériel informatique indispensable à l’utilisation de ses productions : La vente de matériel informatique complémentaire pour assurer une utilisation optimale des logiciels développés.</li>
      </ul>
      
      <h2 class="text-2xl font-semibold mb-2 text-gray-700">Nos Produits</h2>
      <p class="mb-4 text-gray-600">
        Nova Lead a déjà conçu des logiciels parmi lesquels peuvent être cités :
      </p>
      <ul>
        <li>• DOGA KABA : une plateforme digitale de gestion des demandes de crédit, des plaintes, des réclamations, de la performance sociale et environnementale. Elle est spécialement conçue sur mesure pour les microfinances.</li>
        <li>• LETAVI : une plateforme de services à valeur ajoutée (envoi de SMS en masse).</li>
        <li>• MIVO CRM : une plateforme de décentralisation des activités opérationnelles de MIVO ENERGY.</li>
      </ul>
      
      <h2 class="text-2xl font-semibold mb-2 text-gray-700">Plan de Localisation</h2>
      <div class="mb-4">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3955.123456789012!2d1.191111111111!3d6.131111111111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xabcdefabcdefabcdef%3A0xabcdefabcdefabcdef!2sRue%20186%20AFG%2C%20Lom%C3%A9%2C%20Togo!5e0!3m2!1sen!2sus!4v1633021234567!5m2!1sen!2sus" 
          width="600" 
          height="450" 
          style="border:0;" 
          allowfullscreen="" 
          loading="lazy">
        </iframe>
      </div>
      
      <h2 class="text-2xl font-semibold mb-2 text-gray-700">Contactez-nous</h2>
      <p class="text-gray-600">
        Pour plus d'informations, veuillez nous contacter à <a href="hello@novalead.dev" class="text-blue-500 underline">hello@novalead.dev</a>
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
