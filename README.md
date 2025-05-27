# Pokemon Card Viewer

A Vue.js application that displays Pokemon cards with detailed information fetched from the PokeAPI. Users can view Pokemon details, add random Pokemon to their collection, compare Pokemon stats, and manage their Pokemon cards.

## Features

- Display Pokemon cards with detailed information
- View Pokemon abilities and stats
- Add random Pokemon to your collection
- Compare up to 2 Pokemon side by side
- Delete Pokemon cards
- Dark/Light theme toggle
- Responsive design with smooth animations
- Real-time data fetching from PokeAPI

## Technologies Used

- Vue.js 3
- Vite
- PokeAPI
- CSS3 with Flexbox and Grid
- Modern JavaScript (ES6+)

## Project Structure

```
src/
├── components/
│   ├── HelloWorld.vue      # Pokemon card component
│   └── ComparisonModal.vue # Pokemon comparison modal
├── services/
│   └── pokemonApi.js       # API service functions
├── utils/
│   └── comparisonUtils.js  # Comparison utility functions
├── App.vue                 # Main application component
└── main.js                # Application entry point
```

## Project Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd pokemon
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Component Details

### App.vue
- Main application component
- Manages the list of Pokemon
- Handles theme switching
- Manages Pokemon selection for comparison
- Provides the main layout structure

### HelloWorld.vue
- Individual Pokemon card component
- Displays Pokemon information:
  - Name
  - Image
  - Abilities
  - Stats (Height, Weight, Base Stats)
- Handles loading states and error messages
- Provides delete functionality
- Selection toggle for comparison

### ComparisonModal.vue
- Modal component for Pokemon comparison
- Side-by-side comparison of two Pokemon
- Highlights higher/lower stats
- Responsive design
- Easy to close with click outside or close button

## Services

### pokemonApi.js
- Centralized API calls to PokeAPI
- Functions:
  - `fetchPokemonList`: Get initial Pokemon list
  - `fetchPokemonDetails`: Get detailed Pokemon data
  - `fetchRandomPokemon`: Get a random Pokemon

## Utilities

### comparisonUtils.js
- Utility functions for Pokemon comparison
- `getStatClass`: Determines if a stat is higher/lower for styling

## Features in Detail

### Pokemon Card Display
- Each card shows:
  - Pokemon name
  - Front-facing sprite
  - List of abilities
  - Base stats
  - Height and weight
  - Selection toggle for comparison

### Pokemon Comparison
- Select up to 2 Pokemon for comparison
- Compare button enables when exactly 2 Pokemon are selected
- Side-by-side comparison in modal
- Visual indicators for higher/lower stats:
  - Green for higher values
  - Red for lower values
  - Bold text for emphasis

### Theme Switching
- Toggle between dark and light themes
- Persists across the application
- Smooth transitions
- Consistent styling in both themes

### Add Random Pokemon
- Click the "Add Random Pokemon" button to fetch and add a random Pokemon
- Random Pokemon are selected from the first 898 Pokemon in the PokeAPI

### Delete Pokemon
- Each card has a delete button
- Clicking the delete button removes the Pokemon from the collection
- Also removes from comparison selection if selected

## Styling

The application uses a modern, clean design with:
- Card-based layout
- Hover animations
- Responsive grid system
- Consistent color scheme
- Loading and error states
- Theme-aware styling
- Smooth transitions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.
