import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";

import "core-js/stable"; // This is to polyfill everything
import "regenerator-runtime/runtime"; // This is for polyfilling the async and await

if (module.hot) {
  // This is simply coming from parcel but not from java script...
  module.hot.accept();
}

// const recipeContainer = document.querySelector(".recipe");

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    console.log(id);

    if (!id) return;

    recipeView.renderSpinner();

    // 1. Loading the recipe
    await model.loadRecipe(id);

    // 2. Rendering the recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Get the search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load the search results
    await model.loadSearchResults(query);

    // 3) Render the results
    console.log(model.state.search.results);
    resultsView.render(model.state.search.results);
  } catch (err) {
    console.log(err);
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
};

init();

// window.addEventListener("hashchange", showRecipe);

// window.addEventListener("load", showRecipe);
