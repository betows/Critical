<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div style="width: 100%; padding: 0px; justify-content: space-between">
    <!-- Hero Section -->
    <section class="hero">
      <h2 class="page-title">
        Bem vindo ao CRITICAL!
      </h2>
      <p>Embarque em uma jornada pelo vasto mundo de Dungeons and Dragons. Explore itens, magias, monstros e mais!</p>
    </section>

    <!-- Browse Section -->
    <section class="browse">
      <div v-for="item in items" :key="item.title" class="category-card">
        <v-icon size="50" color="primary">
          {{ item.icon }}
        </v-icon>
        <h2 class="page-title" style="color: white">
          {{ item.title }}
        </h2>
        <p>{{ item.description }}</p>
        <v-btn :to="item.to" color="primary">
          Explore
        </v-btn>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="cta">
      <h2 class="page-title">
        Pronto pra mergulhar?
      </h2>
      <p>Junte se a nós e entre nesse mundo fantástico.</p>
      <v-btn color="primary">
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
  border-radius: 8px;
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
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  margin-bottom: 40px;
}
.glass-panel {
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 15px;
  text-align: center;
}
.page-title {
  font-family: Arial, Helvetica, sans-serif;
  color: #ffff;
}
</style>
