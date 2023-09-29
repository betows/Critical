<template>
  <div class="items-page">
    <!-- Search Bar -->
    <v-text-field
      v-model="searchQuery"
      label="Procure por um item"
      solo
      clearable
      @input="searchItems"
      class="search-bar"
    />
    <v-select
      v-model="selectedCategory"
      :items="categories"
      label="Selecione uma categoria de item"
      @change="filterByCategory"
    />

    <!-- Items List -->
    <div class="items-grid" v-if="items.length">
      <v-card
        v-for="item in items"
        :key="item.index"
        @click="fetchItemDetails(item.url)"
        class="item-card"
      >
        <img src="@/assets/images/magic_ring.jpg" alt="Item Image" width="100%">
        <v-card-title>{{ $t(item.name) }}</v-card-title>
      </v-card>
    </div>

    <!-- Item Details Modal -->
    <v-dialog v-model="itemDialog" max-width="600px">
      <v-card>
        <img
          :src="selectedItemImage"
          alt="Item Image"
          class="item-image"
        >
        <v-card-title>{{ selectedItem.name }}</v-card-title>
        <v-card-text>
          <!-- Equipment Category -->
          <div v-if="selectedItem.equipment_category">
            <strong>Categoria do equipamento:</strong> {{ selectedItem.equipment_category.name }}
          </div>

          <!-- Weapon Category -->
          <div v-if="selectedItem.weapon_category">
            <strong>Categoria da arma:</strong> {{ selectedItem.weapon_category }}
          </div>

          <!-- Cost -->
          <div v-if="selectedItem.cost">
            <strong>Custo:</strong> {{ selectedItem.cost.quantity }} {{ selectedItem.cost.unit }}
          </div>

          <!-- Damage -->
          <div v-if="selectedItem.damage">
            <strong>Dano:</strong> {{ selectedItem.damage.damage_dice }} ({{ selectedItem.damage.damage_type.name }})
          </div>

          <!-- Range -->
          <div v-if="selectedItem.range">
            <strong>Alcance:</strong> {{ selectedItem.range.normal }} ft.
          </div>

          <!-- Weight -->
          <div v-if="selectedItem.weight">
            <strong>Peso:</strong> {{ selectedItem.weight }} lbs.
          </div>

          <!-- Properties -->
          <div v-if="selectedItem.properties && selectedItem.properties.length">
            <strong>Propriedades:</strong>
            <ul>
              <li v-for="property in selectedItem.properties" :key="property.index">
                {{ property.name }}
              </li>
            </ul>
          </div>

          <!-- Description (if available) -->
          <div v-if="selectedItem.desc && selectedItem.desc.length">
            <strong>Descrição:</strong>
            <p>{{ selectedItem.desc.join(' ') }}</p>
          </div>
        </v-card-text>
        <v-card-actions style="padding: 24px;">
          <v-btn
            color="#6200ea"
            @click="itemDialog = false"
          >
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      searchQuery: "",
      items: [],
      selectedItem: {},
      categories: [],
      selectedCategory: null,
      itemDialog: false,
      selectedItemImage: ""
    };
  },
  mounted() {
    this.loadDefaultItems();
    this.fetchCategories(); // Fetch the categories when the component is mounted
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get("https://www.dnd5eapi.co/api/equipment-categories");
        this.categories = response.data.results.map(category => category.index);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },
    async loadDefaultItems() {
      try {
        const response = await axios.get("https://www.dnd5eapi.co/api/equipment");
        const items = response.data.results;
        // Add translations for each item
        items.forEach(item => {
          this.$i18n.setLocaleMessage("pt", { [item.name]: "Translated Item Name Here" });
        });
        this.items = items;
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    },
    async searchItems() {
      if (!this.searchQuery.trim()) {
        this.loadDefaultItems();
        return;
      }
      try {
        const response = await axios.get(`https://www.dnd5eapi.co/api/equipment?name=${this.searchQuery}`);
        this.items = response.data.results;
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    },
    async fetchItemDetails(url) {
      try {
        const response = await axios.get(`https://www.dnd5eapi.co${url}`);
        this.selectedItem = response.data;
        this.fetchItemImage(this.selectedItem.name);
        this.itemDialog = true;
      } catch (error) {
        console.error("Error fetching item details:", error);
      }
    },
    async fetchItemImage(itemName) {
      try {
        const apiKey = "39727587-8081f6ce0f6a5705761bb323d";
        const response = await axios.get(`https://pixabay.com/api/?key=${apiKey}&q=${itemName}&image_type=vector`);
        if (response.data.hits.length > 0) {
          this.selectedItemImage = response.data.hits[0].largeImageURL;
        } else {
          this.selectedItemImage = ""; // Default image or placeholder if no image found
        }
      } catch (error) {
        console.error("Error fetching image from Pixabay:", error);
      }
    },
    async filterByCategory() {
      if (!this.selectedCategory) {
        this.loadDefaultItems();
        return;
      }
      try {
        const categoryResponse = await axios.get(`https://www.dnd5eapi.co/api/equipment-categories/${this.selectedCategory.toLowerCase()}`);
        this.items = categoryResponse.data.equipment;
      } catch (error) {
        console.error("Error filtering items by category:", error);
      }
    }

  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=IM+Fell+English&display=swap');
.items-page {
  background: url('/path-to-game-background.jpg') no-repeat center center;
  background-size: cover;
}

.item-image {
  width: 600px;
  height: 250px;
  object-fit: cover; /* This will ensure the image covers the entire space without stretching */
}

.search-bar {
  margin-bottom: 20px;
}

.items-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.item-card {
  width: 200px;
  cursor: pointer;
  transition: transform 0.3s;
}

.item-card:hover {
  transform: scale(1.05);
}

.item-modal {
  border: 5px solid #6200ea; /* Dragon-themed color */
}
</style>
