<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Detalhes da Aventura</v-card-title>
          <v-card-text>
            <v-text-field
              label="Nome da aventura" 
              dense 
              v-model="adventureData.adventureName"
            />
            <v-textarea
              label="Descrição"
              v-model="adventureData.adventureDescription"
              outlined
            />
            <v-textarea
              label="Notas"
              v-model="adventureData.adventureNotes"
              outlined
            />
            <v-file-input
              v-model="adventureData.adventureImage"
              :show-size="1000"
              accept="image/*"
              placeholder="Imagem da Aventura"
              label="Imagem da Aventura"
              outlined
            />
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="saveAdventure">
              Salvar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Fichas dos Personagens</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="selectedCharacter"
              :items="characters"
              item-text="name"
              label="Selecionar Personagem"
              outlined
            />
            <v-data-table
              :headers="headers"
              :items="characters"
              :search="searchCharacter"
              :items-per-page="5"
              class="elevation-1"
            >
              <template #item.action="{ item }">
                <v-btn color="primary" small @click="rollDice(item)">
                  ver ficha
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
        <v-btn color="primary" small @click="$router.push('/create-character')">
          Criar personagem
        </v-btn>
      </v-col>
    </v-row>
    <v-dialog v-if="selectedCharacter" v-model="dialog" class="right-sided-dialog">
      <v-card>
        <v-card-title class="headline purple lighten-2 white--text">
          {{ selectedCharacter.name }}
        </v-card-title>
        <v-card-text>
          <div class="dialog-grid">
            <div class="attribute">
              <span>Pontos de vida totais</span>
              <v-text-field
                flat
                solo
                class="attribute-value"
                v-model="hp"
              />
            </div>
            <div class="attribute">
              <span>Pontos de vida atuais</span>
              <v-text-field
                flat
                solo
                class="attribute-value"
                v-model="currentHp"
              />
            </div>
            <div class="attribute">
              <span>Força</span>
              <div class="attribute-value">
                {{ selectedCharacter.attributes[0].value }}
              </div>
            </div>
            <div class="attribute">
              <span>Destreza</span>
              <div class="attribute-value">
                {{ selectedCharacter.attributes[1].value }}
              </div>
            </div>
            <div class="attribute">
              <span>Constituição</span>
              <div class="attribute-value">
                {{ selectedCharacter.attributes[2].value }}
              </div>
            </div>
            <div class="attribute">
              <span>Inteligência</span>
              <div class="attribute-value">
                {{ selectedCharacter.attributes[3].value }}
              </div>
            </div>
            <div class="attribute">
              <span>Sabedoria</span>
              <div class="attribute-value">
                {{ selectedCharacter.attributes[4].value }}
              </div>
            </div>
            <div class="attribute">
              <span>Carisma</span>
              <div class="attribute-value">
                {{ selectedCharacter.attributes[5].value }}
              </div>
            </div>
            <div class="attribute">
              <span>Itens</span>
              <v-text-field v-model="selectedCharacter.equipment" />
            </div>
            <div class="attribute">
              <span>ação</span>
              <div class="attribute-value">
                {{ selectedCharacter.action }}
              </div>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="purple darken-2" text @click="dialog = false">
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      adventureData: {
        id: 1,
        adventureName: "",
        adventureDescription: "",
        adventureNotes: "",
        adventureImage: null,
        progress: 10
      },
      dialog: false,
      hp: 0,
      currentHp: 0,
      selectedCharacter: null,
      headers: [
        { text: "Nome", value: "name" },
        { text: "Raça", value: "race" },
        { text: "Classe", value: "characterClass" },
        { text: "Ação", value: "action" }
      ],
      searchCharacter: ""
    };
  },
  computed: {
    characters() {
      return this.$store.state.personagens.characters;
    }
  },
  methods: {
    saveAdventure() {
      this.$store.commit("adventure/setAdventure", this.adventureData);
      this.$router.push("/adventure");
    },
    rollDice(character) {
      this.dialog = true;
      this.characters.forEach((el, i) => {
        this.selectedCharacter = this.characters[i];
        this.currentHp = this.characters[i].currentHp,
        this.hp = this.characters[i].hp;
      });
      const diceResult = Math.floor(Math.random() * 20) + 1;
      character.action = `Rolou um dado de 20 e obteve ${diceResult}`;
    }
  }
};
</script>
<style>.attribute {
  margin-bottom: 16px;
}
.dialog-grid {
  width:100%;
  margin-top: 16px;
  padding: 8px 16px;
  display: grid;
  grid-template-columns: repeat(2,calc((100% - 20px)/2));
  grid-column-gap: 20px;
  align-items: center; 
}
.attribute span {
  display: block;
  margin-bottom: 4px;
  font-size: 18px;
  font-weight: 500;
  color: purple;
  text-transform: uppercase;
  letter-spacing: 1px;
  animation: fade-in 0.5s ease-in-out;
}

.attribute-value {
  display: inline-block;
  margin-left: 16px;
  font-size: 24px;
  font-weight: 700;
  color: #4a4a4a;
  animation: slide-in 0.5s ease-in-out;
}

@keyframes slide-in {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>