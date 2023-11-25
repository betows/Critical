<template>
  <div class="items-page">
    <div style="margin-bottom: -50px;" v-if="!selectedType">
      Selecione um tipo de item que deseja visualizar
    </div>
    <div class="selection-cards" v-if="!selectedType">
      <v-card
        v-for="type in itemTypes"
        :key="type.name"
        @click="selectType(type)"
        class="selection-card"
      >
        <img :src="type.image" alt="Type Image" width="100%">
        <v-card-title>{{ type.ptName }}</v-card-title>
      </v-card>
    </div>

    <!-- Items Section -->
    <div style="align-self: flex-start; padding-left: 40px;" v-else>
      <v-btn
        color="primary"
        style="margin-bottom: 20px;"
        @click="backToTypeSelection"
        icon
      >
        <v-icon> mdi-arrow-left </v-icon>
      </v-btn>
      <!-- Search Bar -->
      <v-text-field
        v-model="searchQuery"
        label="Procure por um item (em inglês)"
        outlined
        color="primary"
        clearable
        @input="searchItems"
        class="search-bar"
      />
      <v-select
        v-if="selectedType === 'Equipment'"
        v-model="selectedCategory"
        :items="categories"
        label="Filtre por categoria"
        @change="filterByCategory"
        clearable
        clear-icon="mdi-close-circle-outline"
        outlined
        style="width: 300px"
        color="primary"
      />
      <v-checkbox
        v-model="shouldTranslate"
        label="Traduzir itens (pode levar alguns segundos para traduzir todos os itens!)"
        color="primary"
        style="margin-bottom: 20px;"
        @change="loadAllItemsOfType"
      />
    </div>
    <!-- Items List -->
    <div class="items-grid" v-if="items.length && !isTranslating">
      <v-card
        v-for="item in items"
        :key="item.index"
        @click="fetchItemDetails(item.url)"
        class="item-card"
      >
        <img src="@/assets/images/magic_ring.jpg" alt="Item Image" width="100%">
        <v-card-title>{{ item.name }}</v-card-title>
      </v-card>
    </div>
    <div class="skeleton-items-grid" v-if="isTranslating">
      <v-skeleton-loader
        v-for="(item, index) in 4"
        :key="index"
        style="width: 100%; height: 100%;"
        type="image, list-item-two-line"
        :loading="isTranslating"
      />
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
      selectedType: null,
      shouldTranslate: false,
      itemTypes: [
        { name: "Magic Items", ptName: "Itens mágicos", image: require("@/assets/images/dragon-sword.jpg") },
        { name: "Weapon Properties", ptName: "Propriedades das armas", image: require("@/assets/images/magic-properties.jpg") }
      ],
      itemDialog: false,
      selectedItemImage: "",
      isTranslating: false
    };
  },
  mounted() {
    this.fetchCategories();
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
        for (let item of items) {
          item.name = await this.translateText(item.name);
        }
        this.items = items;
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    },
    async fetchItemDetails(url) {
      try {
        const response = await axios.get(`https://www.dnd5eapi.co${url}`);
        this.selectedItem = response.data;
        // Translate selected item details
        this.selectedItem.name = await this.translateText(this.selectedItem.name);
        if (this.selectedItem.equipment_category) {
          this.selectedItem.equipment_category.name = await this.translateText(this.selectedItem.equipment_category.name);
        }
        if (this.selectedItem.damage && this.selectedItem.damage.damage_type) {
          this.selectedItem.damage.damage_type.name = await this.translateText(this.selectedItem.damage.damage_type.name);
        }
        if (this.selectedItem.properties) {
          for (let property of this.selectedItem.properties) {
            property.name = await this.translateText(property.name);
          }
        }
        if (this.selectedItem.desc) {
          for (let i = 0; i < this.selectedItem.desc.length; i++) {
            this.selectedItem.desc[i] = await this.translateText(this.selectedItem.desc[i]);
          }
        }
        this.fetchItemImage(this.selectedItem.name);
        this.itemDialog = true;
      } catch (error) {
        console.error("Error fetching item details:", error);
      }
    },
    async fetchItemImage(itemName) {
      try {
        const apiKey = process.env.PIXABAY_API_KEY;
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
    selectType(type) {
      this.selectedType = type.name;
      if (type.name === "Equipment") {
        this.fetchCategories();
      }
      this.loadAllItemsOfType();  // Load all items upon type selection
    },
    backToTypeSelection() {
      this.selectedType = null;
      this.items = [];
      this.selectedCategory = null;
    },
    async loadAllItemsOfType() {
      this.isTranslating = true;
      try {
        let apiUrl = "";
        switch (this.selectedType) {
        case "Equipment":
          apiUrl = "https://www.dnd5eapi.co/api/equipment";
          break;
        case "Magic Items":
          apiUrl = "https://www.dnd5eapi.co/api/magic-items";
          break;
        case "Weapon Properties":
          apiUrl = "https://www.dnd5eapi.co/api/weapon-properties";
          break;
        }
        const response = await axios.get(apiUrl);
        const items = response.data.results;
        for (let item of items) {
          item.name = await this.translateText(item.name);
        }
        this.items = items;
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        this.isTranslating = false;
      }
    },
    async searchItems() {
      if (!this.searchQuery.trim()) {
        this.items = [];
        return;
      }
      this.isTranslating = true;
      try {
        let apiUrl = "";
        switch (this.selectedType) {
        case "Equipment":
          apiUrl = `https://www.dnd5eapi.co/api/equipment?name=${this.searchQuery}`;
          break;
        case "Magic Items":
          apiUrl = `https://www.dnd5eapi.co/api/magic-items?name=${this.searchQuery}`;
          break;
        case "Weapon Properties":
          apiUrl = `https://www.dnd5eapi.co/api/weapon-properties?name=${this.searchQuery}`;
          break;
        }
        const response = await axios.get(apiUrl);
        const items = response.data.results;
        for (let item of items) {
          item.name = await this.translateText(item.name);
        }
        this.items = items;
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        this.isTranslating = false;
      }
    },
    async filterByCategory() {
      if (!this.selectedCategory) {
        this.items = [];
        return;
      }
      this.isTranslating = true;  // Set translating status to true
      try {
        const categoryResponse = await axios.get(`https://www.dnd5eapi.co/api/equipment-categories/${this.selectedCategory.toLowerCase()}`);
        const items = categoryResponse.data.equipment;
        for (let item of items) {
          item.name = await this.translateText(item.name);
        }
        this.items = items;
      } catch (error) {
        console.error("Error filtering items by category:", error);
      } finally {
        this.isTranslating = false;  // Reset translating status
      }
    },
    async translateText(text) {
      if (!this.shouldTranslate) {
        return text;  // Return original text if should not translate
      }
      try {
        const sourceLang = "en";
        const targetLang = "pt";
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURI(text)}`;
        const response = await axios.get(url);
        return response.data[0][0][0];
      } catch (error) {
        console.error("Translation Error:", error);
        return text;
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
  display: flex;
  flex-direction: column;
  align-items: center;

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

.skeleton-items-grid {
  display: flex;
  gap: 20px;
  justify-content: center;
  width:100%;
}

.selection-cards {
    display: flex;
    /* flex-wrap: wrap; */
    gap: 32px;
    margin-top: 100px;
    width: 100%;
    flex-direction: row;
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
  border: 5px solid #6200ea;
}

.selection-card{
  width: 30%;
  cursor: pointer;
  transition: transform 0.3s;
}

.selection-card:hover {
  transform: scale(1.05);
}
</style>
