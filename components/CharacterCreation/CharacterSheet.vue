<template>
  <div class="character-sheet">
    <header>
      <v-text-field type="text" placeholder="Character Name" />
      <div class="header-details">
        <div style="display: flex; flex-direction: row; gap: 24px;">
          <v-text-field :value="classDetails.index" type="text" placeholder="Class" />
          <v-text-field
            v-model="level"
            type="number"
            :max="20"
            @input="level > 20 ? level = 20 : level = level"
            placeholder="Level"
          />
        </div>
        <v-text-field type="text" placeholder="Background" />
        <v-text-field type="text" placeholder="Player Name" />
        <v-text-field type="text" placeholder="Race" />
        <v-text-field type="text" placeholder="Alignment" />
        <v-text-field type="text" placeholder="Experience Points" />
      </div>
    </header>
    <section class="main-stats">
      <div class="attributes">
        <h3>Attributes</h3>
        <div class="attribute" v-for="(bonus, index) in combinedAttributes" :key="index">
          <label style="margin-bottom: 24px;" :for="bonus.ability_score.name">{{ bonus.ability_score.name }}</label>
          <v-text-field
            :id="bonus.ability_score.name"
            type="number"
            outlined
            dense
            style="width: 80px; min-width: 80px; max-width: 80px; padding-top: 2px;"
            :value="bonus.value + bonus.bonus"
          />
        </div>
      </div>
      <div class="details">
        <h3>Details</h3>
        <p><strong>Speed:</strong> {{ raceDetails.speed }}ft</p>
        <p><strong>Size:</strong> {{ raceDetails.size }}</p>
        <p><strong>Alignment:</strong> {{ raceDetails.alignment }}</p>
        <p><strong>Age:</strong> {{ raceDetails.age }}</p>
        <p><strong>Languages:</strong> {{ languages }}</p>
        <p><strong>Starting Proficiencies:</strong> {{ classDetails.proficiencies | joinNames }}</p>
      </div>
    </section>
    <!-- Additional sections for skills, attacks & spellcasting, equipment, etc. -->
  </div>
</template>

<script>
export default {
  name: "CharacterSheet",
  props: {
    raceDetails: {
      type: Object,
      default: () => {}
    },
    classDetails: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      level: 1
    };
  },
  computed: {
    combinedAttributes() {
      // Assuming classDetails have a similar structure for abilities
      // and the bonuses from raceDetails and classDetails need to be combined.
      let attributes = this.initializeAttributes();
      // Add bonuses from raceDetails
      for (let bonus of this.raceDetails.ability_bonuses) {
        attributes[bonus.ability_score.index].bonus += bonus.bonus;
      }
      
      // Assuming classDetails has ability_bonuses as well
      // Add bonuses from classDetails
      // for (let bonus of this.classDetails.ability_bonuses) {
      //   attributes[bonus.ability_score.index].bonus += bonus.bonus;
      // }
      
      // Convert the attributes object to an array for rendering
      return Object.values(attributes);
    },
    languages() {
      return this.raceDetails.languages.map(lang => lang.name).join(", ");
    }
  },
  methods: {
    initializeAttributes() {
      // Initialize attributes, potentially with base scores or other logic
      const attributes = {
        str: { ability_score: { name: "Strength" }, value: 10, bonus: 0 },
        dex: { ability_score: { name: "Dexterity" }, value: 10, bonus: 0 },
        con: { ability_score: { name: "Constitution" }, value: 10, bonus: 0 },
        int: { ability_score: { name: "Intelligence" }, value: 10, bonus: 0 },
        wis: { ability_score: { name: "Wisdom" }, value: 10, bonus: 0 },
        cha: { ability_score: { name: "Charisma" }, value: 10, bonus: 0 }
      };
      return attributes;
    }
  },
  filters: {
    joinNames(value) {
      return value.map(item => item.name).join(", ");
    }
  }
};
</script>

<style>
.character-sheet {
  /* Your CSS styling */
}
.attribute {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}
</style>
