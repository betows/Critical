<template>
  <div class="race-selection">
    <!-- Race List -->
    <div class="race-grid" v-if="races.length">
      <v-card
        v-for="race in races"
        :key="race.index"
        :class="selectedRace?.index === race.index ? 'shiny-race-card' : 'race-card'"
        @click="selectRace(race)"
      >
        <v-img
          :src="getRaceImage(race.name)"
          class="race-card-image"
          @error="handleImageError"
          aspect-ratio="1.7"
        />
        <v-card-title>{{ race.name }}</v-card-title>
      </v-card>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "RaceSelection",
  data() {
    return {
      races: [],
      selectedRace: null
    };
  },
  emits: ["selected-race"],
  mounted() {
    this.loadRaces();
  },
  methods: {
    async loadRaces() {
      try {
        const response = await axios.get("https://www.dnd5eapi.co/api/races");
        this.races = response.data.results;
      } catch (error) {
        console.error("Error fetching races:", error);
      }
    },
    async selectRace(race) {
      const fetchedRace = await axios.get("https://www.dnd5eapi.co/api/races/" + race.index);
      const selectedRace = fetchedRace.data;
      console.log("selectedRace: ", selectedRace, "race on selection:", race);
      this.selectedRace = race;
      this.$emit("selected-race", selectedRace);
    },
    getRaceImage(raceName) {
      const formattedName = raceName.toLowerCase().replace(/\s+/g, "-");
      try {
        return require(`@/assets/images/${formattedName}.jpg`);
      } catch {
        return require("@/assets/images/fighter.jpg");
      }
    },
    handleImageError(event) {
      event.target.src = require("@/assets/images/fighter.jpg");
    }
  }
};
</script>

<style>
.race-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-gap: 1rem;
}
.race-card:hover {
  transform: scale(1.02);
}
.race-card {
  background-color: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2) !important;
  cursor: pointer;
  max-width: 200px;
}
.shiny-race-card {
  background-color: rgba(145, 48, 48, 0.2) !important;
  backdrop-filter: blur(10px) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3) !important;
  cursor: pointer;
  max-width: 200px;
}
.race-card-image {
  height: 100px; /* adjust as necessary */
}
</style>
