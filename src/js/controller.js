import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";

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

    //  0. Update the results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1. Loading the recipe
    await model.loadRecipe(id);

    // 2. Rendering the recipe
    recipeView.render(model.state.recipe);

    //  3.Updating the bookmarks view
    bookmarksView.update(model.state.bookmarks);
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
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 4) Render the initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1) Render the New Results
  console.log(model.state.search.results);
  // resultsView.render(model.state.search.results);
  resultsView.render(model.getSearchResultsPage(gotoPage));

  // 2) Render the new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //  1) Update the recipe servings (in state)
  model.updateServings(newServings);
  //  2) Updating the Recipe View
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add/Remove a bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  console.log(model.state.recipe);
  // 2) Update the recipe view
  recipeView.update(model.state.recipe);

  // 3) Render the bookmarks
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const init = function () {
  bookMarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};

init();

// window.addEventListener("hashchange", showRecipe);

// window.addEventListener("load", showRecipe);

const createBookmarks = function () {};
