<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['delCard', 'toggleSelect'])

const API_URL = `https://pokeapi.co/api/v2/pokemon/${props.name}`
const pokemonData = ref(null)
const isLoading = ref(true)
const error = ref(null)

async function fetchPokemonData() {
  try {
    isLoading.value = true
    error.value = null
    const response = await fetch(API_URL)
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon data: ${response.status}`)
    }
    pokemonData.value = await response.json()
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

const abilities = computed(() => {
  return pokemonData.value?.abilities || []
})

const stats = computed(() => {
  return pokemonData.value?.stats || []
})

const pokemonImage = computed(() => {
  return pokemonData.value?.sprites?.front_default || 'https://www.freepnglogos.com/uploads/pokemon-symbol-logo-png-31.png'
})

onMounted(() => {
  fetchPokemonData()
})

const handleDelete = () => {
  emit('delCard')
}

const handleSelect = () => {
  if (pokemonData.value) {
    emit('toggleSelect', pokemonData.value)
  }
}
</script>

<template>
  <div class="pokemon-card" :class="{ 'loading': isLoading, 'selected': isSelected }">
    <div v-if="isLoading" class="loading-spinner">
      Loading...
    </div>
    
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>
    
    <template v-else>
      <div class="pokemon-header">
        <h2 class="pokemon-name">{{ name.toUpperCase() }}</h2>
        <button class="select-button" @click="handleSelect" :class="{ 'selected': isSelected }">
          {{ isSelected ? '✓' : '+' }}
        </button>
      </div>
      
      <div class="pokemon-image">
        <img :src="pokemonImage" :alt="name">
      </div>
      
      <div class="pokemon-details">
        <div class="abilities-section">
          <h3>Abilities:</h3>
          <ul class="abilities-list">
            <li v-for="ability in abilities" :key="ability.ability.name">
              {{ ability.ability.name }}
            </li>
          </ul>
        </div>
        
        <div class="stats-section">
          <div class="stat-item">
            <span class="stat-label">Height:</span>
            <span class="stat-value">{{ pokemonData?.height }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Weight:</span>
            <span class="stat-value">{{ pokemonData?.weight }}</span>
          </div>
          <div v-for="stat in stats" :key="stat.stat.name" class="stat-item">
            <span class="stat-label">{{ stat.stat.name }}:</span>
            <span class="stat-value">{{ stat.base_stat }}</span>
          </div>
        </div>
      </div>
      
      <button class="delete-button" @click="handleDelete">
        Delete
      </button>
    </template>
  </div>
</template>

<style scoped>
.pokemon-card {
  position: relative;
  background-color: var(--card-bg);
  width: 100%;
  max-width: 300px;
  height: 500px;
  border-radius: 15px;
  box-shadow: 0 4px 6px var(--card-shadow);
  overflow: hidden;
  transition: transform 0.2s ease;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
}

.pokemon-card:hover {
  transform: translateY(-5px);
}

.pokemon-header {
  position: relative;
  padding: 1rem;
  background-color: var(--card-header-bg);
  border-bottom: 1px solid var(--card-border);
}

.pokemon-name {
  margin: 0;
  font-size: 1.5rem;
  text-align: center;
  color: var(--card-text);
}

.pokemon-image {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.pokemon-image img {
  max-height: 100%;
  object-fit: contain;
}

.pokemon-details {
  padding: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  flex: 1;
  overflow-y: auto;
  margin-bottom: 50px;
}

.abilities-section, .stats-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.abilities-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.abilities-list li {
  padding: 0.25rem 0;
  color: var(--card-text);
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0;
}

.stat-label {
  font-weight: 600;
  color: var(--card-text);
}

.stat-value {
  color: var(--card-text);
  opacity: 0.8;
}

.delete-button {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  z-index: 1;
}

.delete-button:hover {
  background-color: #c82333;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--card-text);
  opacity: 0.7;
}

.error-message {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #dc3545;
  padding: 1rem;
  text-align: center;
}

.select-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid var(--card-border);
  background-color: var(--card-bg);
  color: var(--card-text);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.3s;
}

.select-button:hover {
  transform: scale(1.1);
}

.select-button.selected {
  background-color: #4CAF50;
  border-color: #4CAF50;
  color: white;
}

.pokemon-card.selected {
  border: 2px solid #4CAF50;
}
</style>