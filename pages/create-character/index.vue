<template>
  <v-app>
    <v-main style="padding-top: 40px;">
      <v-container style="width: 100%;">
        <v-stepper v-model="e1" vertical>
          <v-stepper-step :complete="e1 > 1" step="1">
            Choose Race
          </v-stepper-step>

          <v-stepper-content step="1">
            <!-- Race Selection Component Here -->
            <RaceSelection @selected-race="handleSelectRace" />
            <div style="display: flex; flex-direction: row; gap: 20px; margin-top: 20px;">
              <v-btn :disabled="!selectedRace" color="primary" @click="e1 = 2">
                Continue
              </v-btn>
            </div>
          </v-stepper-content>

          <v-stepper-step :complete="e1 > 2" step="2">
            Choose Class
          </v-stepper-step>

          <v-stepper-content step="2">
            <ClassSelection @selected-class="handleSelectClass" />
            <div style="display: flex; flex-direction: row; gap: 20px; margin-top: 20px;">
              <v-btn
                dense
                color="primary"
                @click="e1 = 1"
              >
                return
              </v-btn>
              <v-btn :disabled="!selectedClass" color="primary" @click="e1 = 3">
                Continue
              </v-btn>
            </div>
          </v-stepper-content>

          <v-stepper-content step="3">
            <CharacterSheet v-if="selectedRace && selectedClass" :race-details="selectedRace" :class-details="selectedClass" />
            <div style="display: flex; flex-direction: row; gap: 20px; margin-top: 20px;">
              <v-btn
                style="text-transform: none !important;"
                text
                color="primary"
                @click="e1 = 2"
              >
                return
              </v-btn>
              <v-btn :disabled="!selectedClass" color="primary" @click="e1 = 4">
                Continue
              </v-btn>
            </div>
          </v-stepper-content>

          <!-- Add more steps for abilities, equipment, etc. -->

          <v-stepper-step step="final">
            Finalize Your Character
          </v-stepper-step>

          <v-stepper-content step="final">
            <CharacterSheet
              v-if="selectedRace && selectedClass"
              :race-details="selectedRace"
              :class-details="selectedClass"
              @save-character="saveCharacter($event)"
            />
            <!-- Character Finalization Component Here -->
            <!-- Include options to print or download -->
          </v-stepper-content>
        </v-stepper>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import pdfLib from "pdf-lib";
import jsPDF from "jspdf";

export default {
  components: { 
    RaceSelection: () => import("@/components/CharacterCreation/RaceSelection"),
    ClassSelection: () => import("@/components/CharacterCreation/ClassSelection"),
    CharacterSheet: () => import("@/components/CharacterCreation/CharacterSheet")
  },
  data: () => ({
    e1: 1,
    selectedRace: null,
    selectedClass: null
    // Other reactive data properties for character creation
  }),
  mounted() {
    this.$pdfLib.PDFDocument; // Access pdf-lib
    this.$jsPDF;
  },
  methods: {
    handleSelectRace(race) {
      this.selectedRace = race;
    },
    handleSelectClass(classItem) {
      this.selectedClass = classItem;
    },
    async saveCharacter(characterDetails) {
      console.log(characterDetails);
      // Load the blank character sheet PDF
      const existingPdfBytes = await fetch("/assets/character-sheet.pdf").then(res => res.arrayBuffer());
      // Load a PDFDocument from the existing PDF bytes
      const pdfDoc = await pdfLib.PDFDocument.load(existingPdfBytes);
      // Get the form containing all the fields
      const form = pdfDoc.getForm();
      // Fill in the form fields with the user's data
      form.getTextField("Character Name").setText(characterDetails.name);
      form.getTextField("Race").setText(characterDetails.race);
      // ... fill other fields similarly
      // Serialize the PDFDocument to bytes (a Uint8Array)
      const pdfBytes = await pdfDoc.save();
      // Trigger the download
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "character-sheet.pdf";
      link.click();
    }
    // Other methods for character creation
  }
};
</script>

<style>
/* Add your styles here */
</style>
