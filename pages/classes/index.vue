<template>
  <div class="classes-page">
    <!-- Classes List -->
    <div class="classes-grid" v-if="classes.length">
      <v-card
        v-for="classItem in classes"
        :key="classItem.index"
        @click="fetchClassDetails(classItem.url)"
        class="class-card"
      >
        <img
          :src="getClassImage(classItem.index)"
          class="class-card-image"
          @error="handleImageError"
        >
        <div>{{ classItem.name }}</div>
      </v-card>
    </div>

    <!-- Class Details Modal -->
    <v-dialog fullscreen v-model="classDialog" content-class="taskbot-mobile-dialog">
      <div class="character-sheet">
        <div style="display: flex; flex-direction: row; justify-content: space-between;">
          <div class="class-header">
            <div v-if="selectedClass" class="class-image-container">
              <img
                :src="getClassImage(selectedClass.name)"
                alt="Class Image"
                @error="handleImageError"
                class="class-image"
              >
            </div>
            <div style="display: flex; flex-direction: column;">
              <div class="class-title">
                <strong> {{ selectedClass.name }} </strong>
              </div>
              <div class="sheet-section">
                Dado de vida: D{{ selectedClass.hit_die }}
              </div>
            </div>
          </div>
          <v-icon
            size="50"
            color="white"
            @click="classDialog = false"
            style="align-self: flex-start; margin-right: 20px; cursor: pointer;"
          >
            mdi-close
          </v-icon>
        </div>
        <v-divider style="width: 100%; color: black;" />
        <div>
          <!-- Proficiency Choices -->
          <div v-for="(choice, index) in selectedClass?.proficiency_choices" :key="index">
            <strong v-if="choice?.desc">{{ choice.desc }}</strong>
            <ul>
              <li v-for="option in choice?.from?.options" :key="option.item?.index">
                {{ option.item?.name }}
              </li>
            </ul>
          </div>

          <!-- Proficiencies -->
          <div>
            <strong>Proficiências:</strong>
            <ul>
              <li v-for="proficiency in selectedClass.proficiencies" :key="proficiency.index">
                {{ proficiency.name }}
              </li>
            </ul>
          </div>

          <!-- Saving Throws -->
          <div>
            <strong>Saving Throws:</strong>
            <ul>
              <li v-for="savingThrow in selectedClass.saving_throws" :key="savingThrow.index">
                {{ savingThrow.name }}
              </li>
            </ul>
          </div>

          <!-- Starting Equipment -->
          <div>
            <strong>Equipamento inicial:</strong>
            <ul>
              <li v-for="equipment in selectedClass.starting_equipment" :key="equipment.equipment.index">
                {{ equipment.quantity }} x {{ equipment.equipment.name }}
              </li>
            </ul>
          </div>

          <!-- Starting Equipment Options -->
          <div v-for="(option, index ) in selectedClass?.starting_equipment_options" :key="index">
            <strong v-if="option?.desc">{{ option.desc }}</strong>
            <ul>
              <li v-for="choice in option?.from?.options" :key="choice.of?.index || choice.choice?.desc">
                {{ choice.of?.name || choice.choice?.desc }}
              </li>
            </ul>
          </div>

          <!-- Multi Classing -->
          <div v-if="selectedClass.multi_classing">
            <strong>Pré requisitos da multiclasse:</strong>
            <ul>
              <li v-for="prerequisite in selectedClass.multi_classing.prerequisites" :key="prerequisite.ability_score.index">
                {{ prerequisite.ability_score.name }}: {{ prerequisite.minimum_score }}
              </li>
            </ul>
          </div>

          <!-- Subclasses -->
          <div>
            <strong>Subclasses:</strong>
            <ul>
              <li v-for="subclass in selectedClass.subclasses" :key="subclass.index">
                {{ subclass.name }}
              </li>
            </ul>
          </div>
        </div>
        <div class="sheet-actions">
          <v-btn
            color="#6200ea"
            @click="classDialog = false"
          >
            Fechar
          </v-btn>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      classes: [],
      selectedClass: {},
      classDialog: false
    };
  },
  mounted() {
    this.loadClasses();
  },
  methods: {
    async loadClasses() {
      try {
        const response = await axios.get("https://www.dnd5eapi.co/api/classes");
        this.classes = response.data.results;
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    },
    async fetchClassDetails(url) {
      try {
        const response = await axios.get(`https://www.dnd5eapi.co${url}`);
        this.selectedClass = response.data;
        this.classDialog = true;
      } catch (error) {
        console.error("Error fetching class details:", error);
      }
    },
    getClassImage(className) {
    // Convert the class name to lowercase and replace spaces with hyphens (if any)
      const formattedName = className ? className.toLowerCase().replace(/ /g, "-") : "red-dragon";
      return require(`@/assets/images/${formattedName}.jpg`);
    },

    handleImageError(event) {
    // Fallback to a default image or handle the error
      event.target.src = require("@/assets/images/giant.png");
    }
  }
};
</script>

<style scoped>
.classes-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.classes-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.class-card {
  width: 150px;
  height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s;
}

.class-card:hover {
  transform: scale(1.05);
}

.class-icon {
  font-size: 48px;
  margin-bottom: 10px;
}
.class-image-container {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  width: 32%;
}

.class-image {
width: -webkit-fill-available;
padding: 12px;
height: auto;
border-radius: 26px;
}
.class-card-image {
  width: 70%;
}
.character-sheet {
  border: 2px solid #8a6d3b; /* Border color */
  font-family: 'Roboto', serif; /* A font that looks like handwriting */
  padding: 32px;
}

.class-header {
  display: flex;
  align-items: center;
}

.class-title {
  font-size: 2em;
    text-align: left;
    align-self: flex-start;
    margin-top: 32px;
    flex: 1;
    padding-left: 20px;

}

.sheet-section {
  font-size: 2em;
    text-align: left;
    align-self: flex-start;
    margin-top: 32px;
    flex: 1;
    padding-left: 20px;
}

.sheet-actions {
  justify-content: center;
  border-top: 1px solid #8a6d3b;
  margin-top: 20px;
  padding-top: 20px;
}


</style>
