<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <!-- Hero Section -->
    <section class="hero">
      <h1>Bem vindo ao CRITICAL!</h1>
      <p>Embarque em uma jornada pelo vasto mundo de Dungeons and Dragons. Explore itens, magias, monstros e mais!</p>
    </section>

    <!-- Browse Section -->
    <section class="browse">
      <div v-for="item in items" :key="item.title" class="category-card">
        <v-icon size="50" color="deep-purple accent-4">
          {{ item.icon }}
        </v-icon>
        <h2>{{ item.title }}</h2>
        <p>{{ item.description }}</p>
        <v-btn :to="item.to" color="deep-purple accent-4">
          Explore
        </v-btn>
      </div>
    </section>

    <!-- Featured Section -->
    <!-- This is a placeholder. You'd typically fetch and display data here. -->
    <section color="deep-purple" class="featured">
      <h2> AOBA </h2>
      <p>Descubra os aspectos mais intrigantes e populares do mundo de D&D.</p>
      <!-- Add featured items, spells, monsters here -->
    </section>

    <!-- Call to Action -->
    <section class="cta">
      <h2>Pronto pra mergulhar?</h2>
      <p>Junte se a nós e entre nesse mundo fantástico.</p>
      <v-btn color="deep-purple accent-4">
        Juntar-se
      </v-btn>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          title: "Items",
          description: "Descubra itens mágicos e poderosos.",
          icon: "mdi-sword",
          to: "/items"
        },
        {
          title: "Magias",
          description: "Explore magias e feitiços de todos os tipos.",
          icon: "mdi-book-open-page-variant",
          to: "/spells"
        },
        {
          title: "Monstros",
          description: "Enfrente monstros e criaturas de todos os tipos.",
          icon: "mdi-emoticon-devil-outline",
          to: "/monsters"
        }
      ]
    };
  }
};
</script>

<style scoped>
.hero {
  background: url('@/assets/images/giant.png') no-repeat center center;
  background-size: cover;
  opacity: 0.8;
  padding: 100px 0;
  text-align: center;
  color: white;
}

.browse {
  display: flex;
  justify-content: space-between;
  margin: 50px 0;
}

.category-card {
  text-align: center;
  width: 30%;
}

.category-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  margin-bottom: 20px;
}

.featured {
  padding: 50px 0;
  background-color: #6200ea;
  text-align: center;
}

.cta {
  padding: 50px 0;
  text-align: center;
}
</style>
