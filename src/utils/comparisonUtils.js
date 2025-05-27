export function getStatClass(selectedPokemons, statName, index, value) {
    if (selectedPokemons.length !== 2) return '';
    
    const otherIndex = index === 0 ? 1 : 0;
    const otherPokemon = selectedPokemons[otherIndex];
    
    if (statName === 'height' || statName === 'weight') {
        const currentValue = selectedPokemons[index][statName];
        const otherValue = otherPokemon[statName];
        return currentValue > otherValue ? 'higher' : currentValue < otherValue ? 'lower' : '';
    } else {
        const currentStat = selectedPokemons[index].stats.find(s => s.stat.name === statName);
        const otherStat = otherPokemon.stats.find(s => s.stat.name === statName);
        
        if (!currentStat || !otherStat) return '';
        
        return currentStat.base_stat > otherStat.base_stat ? 'higher' : 
               currentStat.base_stat < otherStat.base_stat ? 'lower' : '';
    }
} 