<template>
  <div class="spells-page">
    <!-- Search Bar -->
    <v-text-field
      v-model="searchQuery"
      label="Search for a spell"
      solo
      clearable
      @input="searchSpells"
      class="search-bar"
    />
    <v-checkbox
      v-model="shouldTranslate"
      label="Traduzir feitiços"
      color="primary"
      style="margin-bottom: 20px;"
      @change="loadDefaultSpells"
    />
    <div class="class-filters">
      <div class="class-filters">
        <v-chip
          v-for="dndClass in dndClasses"
          :key="dndClass.ptName"
          @click="selectClass(dndClass)"
          :outlined="selectedClass !== dndClass.enName"
        >
          <v-icon left>
            {{ dndClass.icon }}
          </v-icon>
          {{ dndClass.ptName }}
        </v-chip>
      </div>
    </div>
    <!-- Spells List -->
    <div class="spells-grid" v-if="spells.length">
      <v-card
        v-for="spell in spells"
        :key="spell.index"
        @click="fetchSpellDetails(spell.url)"
        class="spell-card"
      >
        <v-card-title>{{ spell.name }}</v-card-title>
      </v-card>
    </div>

    <!-- Spell Details Modal -->
    <v-dialog
      :fullscreen="mobile"
      v-model="spellDialog"
      max-width="600px"
      content-class="taskbot-mobile-dialog"
    >
      <v-card>
        <v-card-title>
          <v-icon left v-if="selectedSpellClassIcon">
            {{ selectedSpellClassIcon }}
          </v-icon>
          <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center; width: 100% !important;">
            <div>
              {{ selectedSpell.name }}
            </div>
            <v-icon color="white" style="margin-bottom: 8px;" @click="spellDialog = false">
              mdi-close-circle-outline
            </v-icon>
          </div>
        </v-card-title>
        <v-card-text>
          <div v-if="selectedSpell.school">
            <strong>Escola:</strong> {{ selectedSpell.school.name }}
            <span v-if="selectedSpell.level">| Level: {{ selectedSpell.level }}</span>
          </div>

          <!-- Spell Description -->
          <div v-if="selectedSpell.desc && selectedSpell.desc.length">
            <strong>Descrição:</strong>
            <p v-for="(desc, index) in selectedSpell.desc" :key="index">
              {{ desc }}
            </p>
          </div>

          <!-- Spell Range -->
          <div v-if="selectedSpell.range">
            <strong>Alcance:</strong> {{ selectedSpell.range }}
          </div>

          <!-- Spell Components -->
          <div v-if="selectedSpell.components && selectedSpell.components.length">
            <strong>Componentes:</strong> {{ selectedSpell.components.join(', ') }}
          </div>

          <!-- Spell Duration -->
          <div v-if="selectedSpell.duration">
            <strong>Duração:</strong> {{ selectedSpell.duration }}
          </div>

          <!-- Spell Casting Time -->
          <div v-if="selectedSpell.casting_time">
            <strong>Tempo de conjuração:</strong> {{ selectedSpell.casting_time }}
          </div>

          <!-- Spell Damage -->
          <div v-if="selectedSpell.damage">
            <strong>Tipo de dano:</strong> {{ selectedSpell.damage.damage_type.name }}
            <div v-if="selectedSpell.damage.damage_at_character_level">
              <strong>Dano ao personagem level 1:</strong>
              <ul>
                <li v-for="(damage, level) in selectedSpell.damage.damage_at_character_level" :key="level">
                  Level {{ level }}: {{ damage }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Spell DC -->
          <div v-if="selectedSpell.dc">
            <strong>DC Type:</strong> {{ selectedSpell.dc.dc_type.name }}
            <div v-if="selectedSpell.dc.dc_success">
              <strong>DC Success:</strong> {{ selectedSpell.dc.dc_success }}
            </div>
          </div>

          <!-- Spell Classes -->
          <div v-if="selectedSpell.classes && selectedSpell.classes.length">
            <strong>Classes:</strong>
            <ul>
              <li v-for="cls in selectedSpell.classes" :key="cls.index">
                {{ cls.name }}
              </li>
            </ul>
          </div>

          <!-- Spell Subclasses -->
          <div v-if="selectedSpell.subclasses && selectedSpell.subclasses.length">
            <strong>Subclasses:</strong>
            <ul>
              <li v-for="subclass in selectedSpell.subclasses" :key="subclass.index">
                {{ subclass.name }}
              </li>
            </ul>
          </div>

          <div class="damage-section">
            <div v-if="selectedSpell.damage">
              <strong>Dano por slot:</strong>
              <div v-if="selectedSpell.damage.damage_at_slot_level">
                <ul>
                  <li v-for="(damage, level) in selectedSpell.damage?.damage_at_slot_level" :key="level">
                    Level {{ level }}: {{ damage }}
                  </li>
                </ul>
              </div>
            </div>
            <div v-if="selectedSpell.heal_at_slot_level">
              <strong>Cura por slot:</strong>
              <div v-if="selectedSpell.heal_at_slot_level">
                <ul>
                  <li v-for="(heal, level) in selectedSpell.heal_at_slot_level" :key="level">
                    Level {{ level }}: {{ heal }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </v-card-text>
        <v-card-actions style="padding: 24px;">
          <v-btn
            color="primary"
            @click="spellDialog = false"
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
      spells: [],
      selectedSpell: {},
      spellDialog: false,
      shouldTranslate: false,
      selectedClass: "",
      dndClasses: []
    };
  },
  mounted() {
    this.loadDefaultSpells();
    this.fetchAllClasses();
  },
  computed: {
    mobile() {
      if (process.browser) return window.innerWidth > 1100 ? false : true;
      else return false;
    },
    selectedSpellClassIcon() {
      if (this.selectedSpell.classes && this.selectedSpell.classes.length) {
        const className = this.selectedSpell.classes[0].name; // Assuming the first class is the primary class for the spell
        return this.getClassIcon(className);
      }
      return null;
    }
  },
  methods: {
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
    },
    async loadDefaultSpells() {
      try {
        const response = await axios.get("https://www.dnd5eapi.co/api/spells");
        this.spells = await Promise.all(response.data.results.map(async spell => {
          spell.name = await this.translateText(spell.name);
          return spell;
        }));
      } catch (error) {
        console.error("Error fetching default spells:", error);
      }
    },
    async selectClass(dndClass) {
      if (this.selectedClass === dndClass.enName) {
        this.selectedClass = "";
        this.loadDefaultSpells();
      } else {
        this.selectedClass = dndClass.enName;
        try {
          const response = await axios.get(`https://www.dnd5eapi.co/api/classes/${this.selectedClass.toLowerCase()}/spells`);
          this.spells = await Promise.all(response.data.results.map(async spell => {
            spell.name = await this.translateText(spell.name);
            return spell;
          }));
        } catch (error) {
          console.error("Error fetching spells for class:", error);
        }
      }
    },
    async fetchAllClasses() {
      try {
        const response = await axios.get("https://www.dnd5eapi.co/api/classes");
        this.dndClasses = response.data.results.map(cls => {
          return {
            ptName: this.translateClassName(cls.name), // You'll need a method to translate class names
            enName: cls.name,
            icon: this.getClassIcon(cls.name) // You'll need a method to assign icons based on class names
          };
        });
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    },
    async searchSpells() {
      try {
        let fetchedSpells = [];
        if (this.selectedClass) {
          const response = await axios.get(`https://www.dnd5eapi.co/api/classes/${this.selectedClass.toLowerCase()}/spells`);
          fetchedSpells = response.data.results;
        } else {
          const response = await axios.get("https://www.dnd5eapi.co/api/spells");
          fetchedSpells = response.data.results;
        }
        // If there's a search query, filter the spells based on the query
        if (this.searchQuery) {
          fetchedSpells = fetchedSpells.filter(spell => spell.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
        }
        this.spells = await Promise.all(fetchedSpells.map(async spell => {
          spell.name = await this.translateText(spell.name);
          return spell;
        }));
      } catch (error) {
        console.error("Error fetching spells:", error);
      }
    },
    async fetchSpellDetails(url) {
      try {
        const response = await axios.get(`https://www.dnd5eapi.co${url}`);
        this.selectedSpell = response.data;
        this.selectedSpell.name = await this.translateText(this.selectedSpell.name);
        if (this.selectedSpell.school) {
          this.selectedSpell.school.name = await this.translateText(this.selectedSpell.school.name);
        }
        if (this.selectedSpell.desc) {
          this.selectedSpell.desc = await Promise.all(this.selectedSpell.desc.map(desc => this.translateText(desc)));
        }
        this.spellDialog = true;
      } catch (error) {
        console.error("Error fetching spell details:", error);
      }
    },
    translateClassName(englishName) {
      const translations = {
        "Barbarian": "Bárbaro",
        "Fighter": "Guerreiro",
        "Monk": "Monge",
        "Rogue": "Ladino",
        "Bard": "Bardo",
        "Cleric": "Clérigo",
        "Druid": "Druida",
        "Paladin": "Paladino",
        "Ranger": "Patrulheiro",
        "Sorcerer": "Feiticeiro",
        "Warlock": "Bruxo",
        "Wizard": "Mago"
      };
      return translations[englishName] || englishName; // Return the English name if no translation is found
    },
    getClassIcon(className) {
      const icons = {
        "Bard": "mdi-music-note",
        "Cleric": "mdi-cross",
        "Druid": "mdi-leaf",
        "Paladin": "mdi-shield-cross",
        "Ranger": "mdi-bow-arrow",
        "Sorcerer": "mdi-fire",
        "Warlock": "mdi-skull",
        "Wizard": "mdi-wizard-hat"
      };
      return icons[className] || "mdi-help-circle"; // Return a default icon if no specific icon is found
    }
  }
};
</script>

<style scoped lang="scss">
.spells-page {
  /* You can use a different background or keep it consistent with the items page */
  background: url('/path-to-game-background.jpg') no-repeat center center;
  background-size: cover;
}

.search-bar {
  margin-bottom: 20px;
}

.spells-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.spell-card {
  width: 200px;
  cursor: pointer;
  transition: transform 0.3s;
}

.spell-card:hover {
  transform: scale(1.05);
}

.spell-modal {
  /* You can use a different border or keep it consistent with the items page */
  border: 5px solid #5c2a58; 
  border-image: url('/path-to-dragon-border.png') 30 round;
}

.class-filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}
.spell-modal .v-dialog__content::-webkit-scrollbar {
  width: 2px;
}

.spell-modal .v-dialog__content::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 2px;
}

.spell-modal .v-dialog__content::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}
@media (max-width: 600px) {
  .spells-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
}
.spell-card {
  width: 100%;
  cursor: pointer;
  transition: transform 0.3s;
}
  
}

</style>
