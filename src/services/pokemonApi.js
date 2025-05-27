const BASE_URL = 'https://pokeapi.co/api/v2/pokemon'

export async function fetchPokemonList(limit = 10, offset = 0) {
    const response = await fetch(`${BASE_URL}?limit=${limit}&offset=${offset}`)
    if (!response.ok) {
        throw new Error(`Failed to fetch Pokemon list: ${response.status}`)
    }
    return response.json()
}

export async function fetchPokemonDetails(name) {
    const response = await fetch(`${BASE_URL}/${name}`)
    if (!response.ok) {
        throw new Error(`Failed to fetch Pokemon data: ${response.status}`)
    }
    return response.json()
}

export async function fetchRandomPokemon() {
    const randomId = Math.floor(Math.random() * 898) + 1
    return fetchPokemonDetails(randomId)
} 