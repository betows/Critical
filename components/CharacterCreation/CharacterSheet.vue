<template>
  <div class="character-sheet">
    <header>
      <v-text-field v-model="characterDetails.name" type="text" placeholder="Character Name" />
      <div class="header-details">
        <div style="display: flex; flex-direction: row; gap: 24px;">
          <v-text-field :value="classDetails.index" type="text" placeholder="Class" disabled />
          <v-text-field
            v-model="characterDetails.level"
            type="number"
            :max="20"
            @input="level > 20 ? level = 20 : level = level"
            placeholder="Level"
          />
        </div>
        <v-text-field v-model="characterDetails.background" type="text" placeholder="Background" />
        <v-text-field v-model="characterDetails.playerName" type="text" placeholder="Player Name" />
        <v-text-field :value="raceDetails.index" type="text" placeholder="Race" disabled />
        <v-text-field v-model="characterDetails.alignment" type="text" placeholder="Alignment" />
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
            v-model="bonus.value"
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
    <v-btn color="success" @click="saveCharacter(characterDetails)">
      Save Character
    </v-btn>
    <!-- Additional sections for skills, attacks & spellcasting, equipment, etc. -->
  </div>
</template>

<script>

export default {
  name: "CharacterSheet",
  emits: ["save-character"],
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
      characterDetails: {
        name: "",
        level: 1,
        background: "",
        playerName: "",
        alignment: ""
      }
    };
  },
  computed: {
    combinedAttributes() {
      let attributes = this.initializeAttributes();
      for (let bonus of this.raceDetails.ability_bonuses) {
        attributes[bonus.ability_score.index].bonus += bonus.bonus;
      }
      return Object.values(attributes);
    },
    languages() {
      return this.raceDetails.languages.map(lang => lang.name).join(", ");
    }
  },
  methods: {
    async saveCharacter(characterDetails) {
      const response = await fetch("/character-sheet.pdf");
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.statusText}`);
      }
      const existingPdfBytes = await response.arrayBuffer();
      const pdfDoc = await this.$pdfLib.PDFDocument.load(existingPdfBytes);
      const form = pdfDoc.getForm();
      let strValue = this.combinedAttributes[0].value + this.combinedAttributes[0].bonus;
      let dexValue = this.combinedAttributes[1].value + this.combinedAttributes[1].bonus;
      let conValue = this.combinedAttributes[2].value + this.combinedAttributes[2].bonus;
      let intValue = this.combinedAttributes[3].value + this.combinedAttributes[3].bonus;
      let wisValue = this.combinedAttributes[4].value + this.combinedAttributes[4].bonus;
      let chaValue = this.combinedAttributes[5].value + this.combinedAttributes[5].bonus;
      console.log(this.combinedAttributes);
      // Fill in the form fields with the user's data
      form.getTextField("CharacterName").setText(characterDetails.name);
      form.getTextField("Race ").setText(this.raceDetails.index);
      form.getTextField("ClassLevel").setText(characterDetails.level.toString());
      form.getTextField("Background").setText(characterDetails.background);
      form.getTextField("STR").setText(strValue.toString());
      form.getTextField("DEX").setText(dexValue.toString());
      form.getTextField("CON").setText(conValue.toString());
      form.getTextField("INT").setText(intValue.toString());
      form.getTextField("WIS").setText(wisValue.toString());
      form.getTextField("CHA").setText(chaValue.toString());
      form.getTextField("Alignment").setText(characterDetails.alignment);
      // Serialize the updated PDF document to bytes
      const pdfBytes = await pdfDoc.save();
      // Trigger the PDF download
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "character-sheet.pdf";
      link.click();
    },
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
    },
    async listFormFields() {
      const response = await fetch("/character-sheet.pdf");
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.statusText}`);
      }
      const existingPdfBytes = await response.arrayBuffer();
      const pdfDoc = await this.$pdfLib.PDFDocument.load(existingPdfBytes);
      const form = pdfDoc.getForm();
      const fields = form.getFields();
      fields.forEach(field => {
        console.log(field.getName());
      });
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
