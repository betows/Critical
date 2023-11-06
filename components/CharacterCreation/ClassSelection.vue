<template>
  <div class="class-selection">
    <!-- Class List -->
    <div class="class-grid" v-if="classes.length">
      <v-card
        v-for="classItem in classes"
        :key="classItem.index"
        :class="selectedClass?.index === classItem.index ? 'shiny-class-card' : 'class-card'"
        @click="selectClass(classItem)"
      >
        <v-img
          :src="getClassImage(classItem.name)"
          class="class-card-image"
          @error="handleImageError"
          aspect-ratio="1.7"
        />
        <v-card-title>{{ classItem.name }}</v-card-title>
      </v-card>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ClassSelection",
  data() {
    return {
      classes: [],
      selectedClass: null
    };
  },
  emits: ["selected-class"],
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
    async selectClass(classItem) {
      const fetchedClass = await axios.get(`https://www.dnd5eapi.co/api/classes/${classItem.index}`);
      const selectedClass = fetchedClass.data;
      console.log("selectedClass:", selectedClass, "classItem on selection:", classItem);
      this.selectedClass = classItem;
      this.$emit("selected-class", selectedClass);
    },
    getClassImage(className) {
      const formattedName = className.toLowerCase().replace(/\s+/g, "-");
      try {
        return require(`@/assets/images/${formattedName}.jpg`);
      } catch {
        return require("@/assets/images/wizard.jpg");
      }
    },
    handleImageError(event) {
      event.target.src = require("@/assets/images/wizard.jpg");
    }
  }
};
</script>

<style scoped>
.class-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-gap: 1rem;
}
.class-card:hover {
  transform: scale(1.02);
}
.class-card {
  background-color: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2) !important;
  cursor: pointer;
  max-width: 200px;
}
.shiny-class-card {
  background-color: rgba(145, 48, 48, 0.2) !important;
  backdrop-filter: blur(10px) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3) !important;
  cursor: pointer;
  max-width: 200px;
}
.class-card-image {
  height: 100px; /* adjust as necessary */
}
</style>
