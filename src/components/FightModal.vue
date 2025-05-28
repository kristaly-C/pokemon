<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  selectedPokemons: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['close'])

const currentAttacker = ref(Math.random() < 0.5 ? 0 : 1)
const baseHP = [
  props.selectedPokemons[0].stats.find(s => s.stat.name === 'hp').base_stat,
  props.selectedPokemons[1].stats.find(s => s.stat.name === 'hp').base_stat
]
const maxHP = ref([baseHP[0], baseHP[1]])
const pokemonHealth = ref([baseHP[0], baseHP[1]])
const battleLog = ref([])
const isBattleOver = ref(false)
const winner = ref(null)
const criticalHits = ref([false, false])
const doubleHP = ref([false, false])

const handleClose = () => {
  emit('close')
}

const calculateDamage = (attacker, defender) => {
  const attackStat = props.selectedPokemons[attacker].stats.find(s => s.stat.name === 'attack').base_stat
  const defenseStat = props.selectedPokemons[defender].stats.find(s => s.stat.name === 'defense').base_stat
  const attackerSpeed = props.selectedPokemons[attacker].stats.find(s => s.stat.name === 'speed').base_stat
  
  // Calculate base damage
  const attackCoefficient = attackStat / 100
  const defenseCoefficient = attackCoefficient * defenseStat
  let damage = Math.max(1, Math.floor(attackStat - defenseCoefficient))
  
  // Check for critical hit based on speed (independent of defender's speed)
  const criticalChance = attackerSpeed / 100 // Convert speed to percentage
  if (Math.random() * 100 < criticalChance) {
    damage = Math.floor(damage * 1.5) // 50% more damage on critical hit
    criticalHits.value[attacker] = true
    return { damage, isCritical: true }
  }
  
  criticalHits.value[attacker] = false
  return { damage, isCritical: false }
}

const initializeBattle = () => {
  // Check for double HP chance based on speed
  props.selectedPokemons.forEach((pokemon, index) => {
    const speed = pokemon.stats.find(s => s.stat.name === 'speed').base_stat
    const doubleHPChance = speed / 100 // Convert speed to percentage
    if (Math.random() * 100 < doubleHPChance) {
      maxHP.value[index] = baseHP[index] * 2
      pokemonHealth.value[index] = baseHP[index] * 2
      doubleHP.value[index] = true
    } else {
      maxHP.value[index] = baseHP[index]
      pokemonHealth.value[index] = baseHP[index]
      doubleHP.value[index] = false
    }
  })
}

const performAttack = () => {
  if (isBattleOver.value) return
  
  const attacker = currentAttacker.value
  const defender = attacker === 0 ? 1 : 0
  
  const { damage, isCritical } = calculateDamage(attacker, defender)
  pokemonHealth.value[defender] = Math.max(0, pokemonHealth.value[defender] - damage)
  
  battleLog.value.push({
    attacker: props.selectedPokemons[attacker].name,
    defender: props.selectedPokemons[defender].name,
    damage,
    remainingHealth: pokemonHealth.value[defender],
    maxHealth: maxHP.value[defender],
    isCritical,
    attackerSpeed: props.selectedPokemons[attacker].stats.find(s => s.stat.name === 'speed').base_stat
  })
  
  if (pokemonHealth.value[defender] <= 0) {
    isBattleOver.value = true
    winner.value = props.selectedPokemons[attacker].name
  } else {
    currentAttacker.value = defender
  }
}

const resetBattle = () => {
  battleLog.value = []
  isBattleOver.value = false
  winner.value = null
  currentAttacker.value = Math.random() < 0.5 ? 0 : 1
  criticalHits.value = [false, false]
  doubleHP.value = [false, false]
  initializeBattle()
}

// Initialize battle when component is mounted
initializeBattle()
</script>

<template>
  <div class="modal-overlay" @click="handleClose">
    <div class="modal-content" @click.stop>
      <button class="close-modal" @click="handleClose">×</button>
      <h2>Pokemon Battle</h2>
      
      <div class="battle-area">
        <div v-for="(pokemon, index) in selectedPokemons" :key="pokemon.name" 
             class="battle-pokemon" 
             :class="{ 
               'current-attacker': currentAttacker === index,
               'double-hp': doubleHP[index]
             }">
          <h3>{{ pokemon.name }}</h3>
          <img :src="pokemon.sprites.front_default" :alt="pokemon.name">
          <div class="pokemon-stats">
            <div class="stat">Speed: {{ pokemon.stats.find(s => s.stat.name === 'speed').base_stat }}</div>
            <div v-if="doubleHP[index]" class="double-hp-badge">Double HP!</div>
          </div>
          <div class="health-bar">
            <div class="health-fill" 
                 :style="{ width: `${(pokemonHealth[index] / maxHP[index]) * 100}%` }">
            </div>
            <span class="health-text">{{ pokemonHealth[index] }} / {{ maxHP[index] }}</span>
          </div>
        </div>
      </div>
      
      <div class="battle-controls">
        <button @click="performAttack" 
                :disabled="isBattleOver"
                class="attack-button">
          {{ isBattleOver ? 'Battle Over' : 'Attack!' }}
        </button>
        <button @click="resetBattle" class="reset-button">
          Reset Battle
        </button>
      </div>
      
      <div v-if="isBattleOver" class="battle-result">
        <h3>{{ winner }} wins the battle!</h3>
      </div>
      
      <div class="battle-log">
        <h3>Battle Log:</h3>
        <div v-for="(log, index) in battleLog" :key="index" 
             class="log-entry"
             :class="{ 'critical-hit': log.isCritical }">
          {{ log.attacker }} attacks {{ log.defender }} for {{ log.damage }} damage!
          <span v-if="log.isCritical" class="critical-text">Critical Hit!</span>
          {{ log.defender }} has {{ log.remainingHealth }}/{{ log.maxHealth }} HP remaining.
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
  max-width: 800px;
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

.battle-area {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin: 2rem 0;
}

.battle-pokemon {
  text-align: center;
  padding: 1rem;
  background-color: var(--card-header-bg);
  border-radius: 8px;
  transition: all 0.3s;
}

.battle-pokemon.current-attacker {
  box-shadow: 0 0 10px #ffd700;
  transform: scale(1.05);
}

.battle-pokemon img {
  max-width: 150px;
  height: auto;
}

.health-bar {
  width: 100%;
  height: 20px;
  background-color: #444;
  border-radius: 10px;
  margin-top: 1rem;
  position: relative;
  overflow: hidden;
}

.health-fill {
  height: 100%;
  background-color: #4CAF50;
  transition: width 0.3s ease;
}

.health-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.8rem;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
}

.battle-controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0;
}

.attack-button, .reset-button {
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s;
}

.attack-button {
  background-color: #dc3545;
  color: white;
}

.attack-button:hover:not(:disabled) {
  background-color: #c82333;
  transform: scale(1.05);
}

.attack-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.reset-button {
  background-color: #6c757d;
  color: white;
}

.reset-button:hover {
  background-color: #5a6268;
  transform: scale(1.05);
}

.battle-result {
  text-align: center;
  margin: 1rem 0;
  padding: 1rem;
  background-color: #28a745;
  color: white;
  border-radius: 8px;
}

.battle-log {
  margin-top: 2rem;
  padding: 1rem;
  background-color: var(--card-header-bg);
  border-radius: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.log-entry {
  padding: 0.5rem;
  border-bottom: 1px solid var(--card-border);
  color: var(--text-color);
}

.log-entry:last-child {
  border-bottom: none;
}

.pokemon-stats {
  margin: 0.5rem 0;
  font-size: 0.9rem;
  color: var(--text-color);
}

.double-hp-badge {
  background-color: #ffd700;
  color: #000;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-top: 0.5rem;
  display: inline-block;
}

.battle-pokemon.double-hp {
  border: 2px solid #ffd700;
}

.critical-hit {
  color: #ff4444;
  font-weight: bold;
}

.critical-text {
  color: #ff4444;
  font-weight: bold;
  margin-left: 0.5rem;
}
</style> 