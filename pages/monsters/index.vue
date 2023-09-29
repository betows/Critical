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
    <v-dialog v-model="monsterDialog" max-width="600px" class="monster-modal">
      <v-card>
        <v-card-title>{{ selectedMonster.name }}</v-card-title>
        <v-card-text>
          <!-- Monster Details -->
          <div><strong>Challenge Rating:</strong> {{ selectedMonster.challenge_rating }}</div>
          <div><strong>Type:</strong> {{ selectedMonster.type }}</div>
          <div><strong>Size:</strong> {{ selectedMonster.size }}</div>
          <!-- ... Add more details as needed ... -->
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
      monsterDialog: false
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
        this.monsterDialog = true;
      } catch (error) {
        console.error("Error fetching monster details:", error);
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
