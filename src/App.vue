<script setup>
import { ref } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import FightModal from './components/FightModal.vue'
import { fetchPokemonList, fetchRandomPokemon } from './services/pokemonApi'

const pokemons = ref(null)
const isDarkTheme = ref(true)
const selectedPokemons = ref([])
const showFightModal = ref(false)

function toggleTheme() {
  isDarkTheme.value = !isDarkTheme.value
  document.body.classList.toggle('light-theme')
}

function togglePokemonSelection(pokemon) {
  const index = selectedPokemons.value.findIndex(p => p.name === pokemon.name)
  if (index === -1) {
    if (selectedPokemons.value.length < 2) {
      selectedPokemons.value.push(pokemon)
    }
  } else {
    selectedPokemons.value.splice(index, 1)
  }
}

function openFightModal() {
  if (selectedPokemons.value.length === 2) {
    showFightModal.value = true
  }
}

function closeFightModal() {
  showFightModal.value = false
}

async function getData() {
  try {
    const data = await fetchPokemonList()
    pokemons.value = data.results
  } catch (error) {
    console.error('Error fetching Pokemon list:', error)
  }
}

async function addRandomPokemon() {
  try {
    const pokemon = await fetchRandomPokemon()
    pokemons.value.push({
      name: pokemon.name,
      url: `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`
    })
  } catch (error) {
    console.error('Error fetching random Pokemon:', error)
  }
}

function removePokemon(pokemon) {
  pokemons.value = pokemons.value.filter((t) => t !== pokemon)
  selectedPokemons.value = selectedPokemons.value.filter((t) => t.name !== pokemon.name)
}

getData()

function getStatClass(statName, index, value) {
  if (selectedPokemons.value.length !== 2) return '';
  
  const otherIndex = index === 0 ? 1 : 0;
  const otherPokemon = selectedPokemons.value[otherIndex];
  
  if (statName === 'height' || statName === 'weight') {
    const currentValue = selectedPokemons.value[index][statName];
    const otherValue = otherPokemon[statName];
    return currentValue > otherValue ? 'higher' : currentValue < otherValue ? 'lower' : '';
  } else {
    const currentStat = selectedPokemons.value[index].stats.find(s => s.stat.name === statName);
    const otherStat = otherPokemon.stats.find(s => s.stat.name === statName);
    
    if (!currentStat || !otherStat) return '';
    
    return currentStat.base_stat > otherStat.base_stat ? 'higher' : 
           currentStat.base_stat < otherStat.base_stat ? 'lower' : '';
  }
}
</script>

<template>
  <div :class="{ 'light-theme': !isDarkTheme }" class="app-container">
    <div class="left-panel">
      <div class="header">
        <h1 id="title">Pokemons</h1>
        <button class="theme-toggle" @click="toggleTheme">
          {{ isDarkTheme ? '☀️' : '🌙' }}
        </button>
      </div>
      <button class="add-pokemon-btn" @click="addRandomPokemon">Add Random Pokemon</button>
      
      <div class="selected-pokemon">
        <h3>Selected for Battle:</h3>
        <div v-for="pokemon in selectedPokemons" :key="pokemon.name" class="selected-pokemon-item">
          <img :src="pokemon.sprites?.front_default" :alt="pokemon.name">
          <span>{{ pokemon.name }}</span>
        </div>
        <button 
          class="fight-btn" 
          @click="openFightModal"
          :disabled="selectedPokemons.length !== 2"
        >
          Start Battle
        </button>
      </div>
    </div>

    <div class="right-panel">
      <div class="wrap">
        <HelloWorld 
          v-for="poke in pokemons" 
          :key="poke.name" 
          :name="poke.name" 
          @delCard="removePokemon(poke)"
          @toggleSelect="togglePokemonSelection"
          :isSelected="selectedPokemons.some(p => p.name === poke.name)"
        />
      </div>
    </div>

    <FightModal
      v-if="showFightModal"
      :selectedPokemons="selectedPokemons"
      @close="closeFightModal"
    />
  </div>
</template>

<style>
:root {
  --bg-color: rgb(51 65 85);
  --text-color: azure;
  --card-bg: #2d3748;
  --card-text: #e2e8f0;
  --card-header-bg: #1a202c;
  --card-border: #4a5568;
  --card-shadow: rgba(0, 0, 0, 0.3);
  --panel-bg: #1a202c;
}

.light-theme {
  --bg-color: #f0f2f5;
  --text-color: #2d3748;
  --card-bg: #ffffff;
  --card-text: #2d3748;
  --card-header-bg: #edf2f7;
  --card-border: #e2e8f0;
  --card-shadow: rgba(0, 0, 0, 0.1);
  --panel-bg: #ffffff;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s, color 0.3s;
  margin: 0;
  min-height: 100vh;
}

.app-container {
  display: flex;
  min-height: 100vh;
}

.left-panel {
  width: 300px;
  background-color: var(--panel-bg);
  padding: 2rem;
  border-right: 1px solid var(--card-border);
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: fixed;
  height: 100vh;
  box-sizing: border-box;
}

.right-panel {
  flex: 1;
  margin-left: 300px;
  padding: 2rem;
  min-height: 100vh;
  box-sizing: border-box;
  overflow-x: hidden;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

#title {
  font-size: 2.5em;
  text-align: center;
  color: var(--text-color);
  margin: 0;
}

.theme-toggle {
  background: none;
  border: none;
  font-size: 2em;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: transform 0.3s;
}

.theme-toggle:hover {
  transform: scale(1.1);
}

.wrap {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 300px));
  gap: 20px;
  width: 100%;
  max-width: 100%;
  justify-content: center;
}

.add-pokemon-btn {
  width: 100%;
  padding: 15px;
  font-size: 1.2em;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: auto;
}

.add-pokemon-btn:hover {
  background-color: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.selected-pokemon {
  margin-top: 2rem;
  padding: 1rem;
  background-color: var(--card-bg);
  border-radius: 8px;
  border: 1px solid var(--card-border);
}

.selected-pokemon h3 {
  margin: 0 0 1rem 0;
  color: var(--text-color);
}

.selected-pokemon-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  background-color: var(--card-header-bg);
  border-radius: 4px;
}

.selected-pokemon-item img {
  width: 50px;
  height: 50px;
}

.fight-btn {
  width: 100%;
  padding: 10px;
  margin-top: 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.fight-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.fight-btn:not(:disabled):hover {
  background-color: #c82333;
}
</style>


