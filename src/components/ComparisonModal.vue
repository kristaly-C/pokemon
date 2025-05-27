<script setup>
import { getStatClass } from '../utils/comparisonUtils'

const props = defineProps({
  selectedPokemons: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['close'])

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <div class="modal-overlay" @click="handleClose">
    <div class="modal-content" @click.stop>
      <button class="close-modal" @click="handleClose">×</button>
      <div class="comparison-grid">
        <div v-for="(pokemon, index) in selectedPokemons" :key="pokemon.name" class="comparison-card">
          <h2>{{ pokemon.name }}</h2>
          <div class="comparison-stats">
            <div class="stat-row" :class="getStatClass(selectedPokemons, 'height', index)">
              <span>Height:</span>
              <span>{{ pokemon.height }}</span>
            </div>
            <div class="stat-row" :class="getStatClass(selectedPokemons, 'weight', index)">
              <span>Weight:</span>
              <span>{{ pokemon.weight }}</span>
            </div>
            <div v-for="stat in pokemon.stats" :key="stat.stat.name" 
                 class="stat-row" 
                 :class="getStatClass(selectedPokemons, stat.stat.name, index, stat.base_stat)">
              <span>{{ stat.stat.name }}:</span>
              <span>{{ stat.base_stat }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--card-bg);
  padding: 2rem;
  border-radius: 8px;
  position: relative;
  width: 80%;
  max-width: 1000px;
  max-height: 80vh;
  overflow-y: auto;
}

.close-modal {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-color);
}

.comparison-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-top: 1rem;
}

.comparison-card {
  padding: 1rem;
  background-color: var(--card-header-bg);
  border-radius: 8px;
}

.comparison-card h2 {
  margin: 0 0 1rem 0;
  color: var(--text-color);
  text-align: center;
}

.comparison-stats {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0;
  border-bottom: 1px solid var(--card-border);
}

.stat-row span:first-child {
  font-weight: bold;
  color: var(--text-color);
}

.stat-row span:last-child {
  color: var(--text-color);
  opacity: 0.8;
}

.stat-row.higher span:last-child {
  color: #4CAF50;
  font-weight: bold;
  opacity: 1;
}

.stat-row.lower span:last-child {
  color: #f44336;
  opacity: 0.7;
}
</style> 