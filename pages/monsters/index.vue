<template>
  <div class="monsters-page">
    <!-- Search Bar -->
    <v-text-field
      v-model="searchQuery"
      label="Search for a monster"
      solo
      clearable
      @input="searchMonsters"
      class="search-bar"
    />
    <v-checkbox
      v-model="shouldTranslate"
      label="Traduzir"
      color="#6200ea"
      style="margin-bottom: 20px;"
      @change="loadDefaultMonsters"
    />
    <!-- Monsters List -->
    <div class="monsters-grid" v-if="monsters.length">
      <v-card
        v-for="monster in monsters"
        :key="monster.index"
        @click="fetchMonsterDetails(monster.url)"
        class="monster-card"
      >
        <v-card-title>{{ monster.name }}</v-card-title>
      </v-card>
    </div>

    <!-- Monster Details Modal -->
    <v-dialog
      v-if="selectedMonster"
      v-model="monsterDialog"
      max-width="600px"
      class="monster-modal"
    >
      <v-card v-if="selectedMonster">
        <v-card-title>{{ selectedMonster.name }}</v-card-title>
        <v-card-text>
          <!-- Monster Details -->
          <div><strong>Challenge Rating:</strong> {{ selectedMonster.challenge_rating }}</div>
          <div><strong>Type:</strong> {{ selectedMonster.type }}</div>
          <div><strong>Size:</strong> {{ selectedMonster.size }}</div>
          <div v-if="selectedMonster.armor_class">
            <strong>Armor Class:</strong> {{ selectedMonster.armor_class[0].value }} ({{ selectedMonster.armor_class[0].type }})
          </div>
          <div><strong>Hit Points:</strong> {{ selectedMonster.hit_points }} ({{ selectedMonster.hit_dice }})</div>
          <div v-if="selectedMonster.speed">
            <strong>Speed:</strong> {{ selectedMonster.speed.walk }}
          </div>
          <div><strong>Strength:</strong> {{ selectedMonster.strength }}</div>
          <!-- ... Add more details as needed ... -->
          <div v-if="selectedMonster.special_abilities">
            <strong>Special Abilities:</strong>
            <ul>
              <li v-for="ability in selectedMonster.special_abilities" :key="ability.name">
                <strong>{{ ability.name }}:</strong> {{ ability.desc }}
              </li>
            </ul>
          </div>
        <!-- ... -->
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="monsterDialog = false">
            Close
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
      monsters: [],
      selectedMonster: {},
      monsterDialog: false,
      shouldTranslate: false // Add a flag for translation
    };
  },
  mounted() {
    this.loadDefaultMonsters();
  },
  methods: {
    async loadDefaultMonsters() {
      try {
        const response = await axios.get("https://www.dnd5eapi.co/api/monsters");
        this.monsters = response.data.results;
      } catch (error) {
        console.error("Error fetching default monsters:", error);
      }
    },
    async searchMonsters() {
      try {
        const response = await axios.get("https://www.dnd5eapi.co/api/monsters");
        let fetchedMonsters = response.data.results;
        if (this.searchQuery) {
          fetchedMonsters = fetchedMonsters.filter(monster => monster.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
        }
        this.monsters = fetchedMonsters;
      } catch (error) {
        console.error("Error searching monsters:", error);
      }
    },
    async fetchMonsterDetails(url) {
      try {
        const response = await axios.get(`https://www.dnd5eapi.co${url}`);
        this.selectedMonster = response.data;
        // Translate if shouldTranslate is true
        if (this.shouldTranslate) {
          this.selectedMonster.name = await this.translateText(this.selectedMonster.name);
          this.selectedMonster.type = await this.translateText(this.selectedMonster.type);
          this.selectedMonster.size = await this.translateText(this.selectedMonster.size);
          // ... Translate other properties as needed ...
        }
        this.monsterDialog = true;
      } catch (error) {
        console.error("Error fetching monster details:", error);
      }
    },
    async translateText(text) {
      if (!this.shouldTranslate) return text;
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
.monsters-page {
  background: url('/path-to-game-background.jpg') no-repeat center center;
  background-size: cover;
}

.search-bar {
  margin-bottom: 20px;
}

.monsters-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.monster-card {
  width: 200px;
  cursor: pointer;
  transition: transform 0.3s;
}

.monster-card:hover {
  transform: scale(1.05);
}

.monster-modal {
  border: 5px solid #5c2a58; 
  border-image: url('/path-to-dragon-border.png') 30 round;
}
</style>
