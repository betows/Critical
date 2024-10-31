import { get_auth_header } from "~/static/functions";

export const state = () => ({
  adventures: [],
  items: null
});

export const mutations = {
  setAdventure(state, adventure) {
    state.adventures = [...state.adventures, adventure];
  },
  setItems(state, items) {
    state.items = items;
  }
};

export const actions = {
  loadItems(context) {
    const cfg = get_auth_header(this);
    return this.$axios.get("https://api.harmlesskey.com/items", cfg).then((r) => {
      context.commit("setItems", r.data);
    });
  },
  async criarPersonagem({ commit }, character) {
    const novoPersonagem = {
      name: character.name,
      race: character.race,
      attributes: character.attributes,
      abilities: character.abilities,
      equipment: character.equipment,
      characterClass: character.characterClass,
      hp: character.hp,
      currentHp: character.currentHp
    };
    await commit("addCharacter", novoPersonagem);
  }

};
