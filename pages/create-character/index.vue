<template>
  <div class="character-creation-page">
    <!-- Race Selection -->
    <v-card
      v-if="!selectedRace && races.length"
      class="selection-card"
      key="raceCard"
      transition="fade-transition"
    >
      <h2>Select a Race</h2>
      <v-chip-group column>
        <v-chip
          v-for="race in races"
          :key="race.index"
          @click="selectRace(race)"
        >
          {{ race.name }}
        </v-chip>
      </v-chip-group>
    </v-card>
    <!-- Class Selection -->
    <v-card
      v-if="selectedRace && !selectedClass && classes.length"
      class="selection-card"
      key="classCard"
      transition="fade-transition"
    >
      <h2>Select a Class</h2>
      <v-chip-group column>
        <v-chip
          v-for="classItem in classes"
          :key="classItem.index"
          @click="selectClass(classItem)"
        >
          {{ classItem.name }}
        </v-chip>
      </v-chip-group>
    </v-card>
    <!-- Background Selection -->
    <v-card
      v-if="selectedClass && !selectedBackground && backgrounds.length"
      class="selection-card"
      key="backgroundCard"
      transition="fade-transition"
    >
      <h2>Select a Background</h2>
      <v-chip-group column>
        <v-chip
          v-for="background in backgrounds"
          :key="background.index"
          @click="selectBackground(background)"
        >
          {{ background.name }}
        </v-chip>
      </v-chip-group>
    </v-card>
    <!-- Character Sheet -->
    <v-card v-if="selectedBackground" class="character-sheet" transition="fade-transition">
      <h2>Character Sheet</h2>
      <div class="sheet-section">
        <strong>Race:</strong> {{ selectedRace.name }}
      </div>
      <div>
        <strong>Class:</strong> {{ selectedClass.name }}
      </div>
      <div>
        <strong>Background:</strong> {{ selectedBackground.name }}
      </div>
      <div class="dice-container" v-if="rolling">
        <div class="dice" />
      </div>
      <div v-if="!rolling && diceRolled">
        <div v-for="(value, ability) in abilities" :key="ability">
          <strong>{{ ability.charAt(0).toUpperCase() + ability.slice(1) }}:</strong> {{ value }}
        </div>
      </div>
      <div style="display: flex; flex-direction:row; gap: 32px; margin-top: 24px;">
        <v-btn v-if="diceRolled" @click="finalizeCharacter">
          Finalize Character
        </v-btn>
        <v-btn @click="rollForAbilities">
          Roll for Abilities
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedRace: null,
      selectedClass: null,
      selectedBackground: null,
      diceRolled: false,
      rolling: false,
      races: [],
      abilities: {
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0
      }
    };
  },
  async asyncData({ params }) {
    const races = await fetch("https://www.dnd5eapi.co/api/races")
      .then(res => res.json())
      .then(data => data.results);
    const classes = await fetch("https://www.dnd5eapi.co/api/classes")
      .then(res => res.json())
      .then(data => data.results);
    const backgrounds = await fetch("https://www.dnd5eapi.co/api/backgrounds")
      .then(res => res.json())
      .then(data => data.results);
    return { races, classes, backgrounds };
  },
  methods: {
    selectRace(race) {
      this.selectedRace = race;
      // Proceed to next step or store selection
    },
    selectClass(classItem) {
      this.selectedClass = classItem;
      // Proceed to next step or store selection
    },
    selectBackground(background) {
      this.selectedBackground = background;
      // Store selection and proceed to character summary
    },
    rollForAbilities() {
      this.rolling = true;
      setTimeout(() => {
        for (let ability in this.abilities) {
          let rolls = Array.from({ length: 4 }, () => Math.ceil(Math.random() * 6));
          rolls.sort((a, b) => b - a);
          rolls.pop();
          this.abilities[ability] = rolls.reduce((a, b) => a + b, 0);
        }
        this.rolling = false;
        this.diceRolled = true;
      }, 1000);
    },
    finalizeCharacter() {
    // Handle character finalization, e.g., save to a database or local storage
      this.selectedBackground = null;
      this.selectedClass = null;
      this.selectedRace = null;
      this.diceRolled = false;
    }
  }
};
</script>
<style scoped>
.dice-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
}

.dice {
  width: 50px;
  height: 50px;
  background: white;
  border: 1px solid black;
  animation: rollDice 1s ease-out forwards;
}

@keyframes rollDice {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(90deg); }
  50% { transform: rotate(180deg); }
  75% { transform: rotate(270deg); }
  100% { transform: rotate(360deg); }
}
.character-sheet {
  background: #f4e9d8; /* Parchment color */
  border: 2px solid #8a6d3b; /* Border color */
  font-family: 'Roboto', serif; /* A font that looks like handwriting */
  color: #4a4a4a; /* Darker text color for better readability */
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 80%;
  margin-top: 100px;
}

.sheet-section {
  margin-bottom: 10px;
}
.character-creation-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.selection-card {
  max-width: 600px;
  width: 100%;
  text-align: center;
  padding: 20px;
  margin: 100px 0;
}

.v-chip {
  margin: 10px;
}
</style>
