// CONSTANTS
const RECIPE_URLS = [
  'https://adarsh249.github.io/Lab8-Starter/recipes/1_50-thanksgiving-side-dishes.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/2_roasting-turkey-breast-with-stuffing.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/3_moms-cornbread-stuffing.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/4_50-indulgent-thanksgiving-side-dishes-for-any-holiday-gathering.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/5_healthy-thanksgiving-recipe-crockpot-turkey-breast.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/6_one-pot-thanksgiving-dinner.json',
];

// Run the init() function when the page has loaded
window.addEventListener('DOMContentLoaded', init);

// Starts the program, all function calls trace back here
async function init() {
  // initialize ServiceWorker
  initializeServiceWorker();
  // Get the recipes from localStorage
  let recipes;
  try {
    recipes = await getRecipes();
  } catch (err) {
    console.error(err);
  }
  // Add each recipe to the <main> element
  addRecipesToDocument(recipes);
}

function initializeServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
        .then(reg => {
          console.log('Service Worker has been registered');
        })
        .catch(err => {
          console.log('Service Worker registration failed:', err);
        });
    });
  } else {
    console.log('Service Worker is not supported');
  }
}

async function getRecipes() {
  const localRecipes = localStorage.getItem('recipes');
  if (localRecipes) {
    console.log('Recipes found in localStorage');
    return JSON.parse(localRecipes);
  }

  const fetchedRecipes = [];

  try {
    const fetchPromises = RECIPE_URLS.map(async (url) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
      }
      return await response.json();
    });

    const recipes = await Promise.all(fetchPromises);
    saveRecipesToStorage(recipes);
    return recipes;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
}

function saveRecipesToStorage(recipes) {
  localStorage.setItem('recipes', JSON.stringify(recipes));
}

function addRecipesToDocument(recipes) {
  if (!recipes) return;
  const main = document.querySelector('main');
  recipes.forEach((recipe) => {
    const recipeCard = document.createElement('recipe-card');
    recipeCard.data = recipe;
    main.append(recipeCard);
  });
}
