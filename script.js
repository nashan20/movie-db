const API_KEY = "397bfad5";

function getFavourites() {
  return JSON.parse(localStorage.getItem("favourites")) || [];
}

function saveFavourites(favs) {
  localStorage.setItem("favourites", JSON.stringify(favs));
}

function hideAllSections() {
  document.getElementById("trendingContainer").style.display = "none";
  document.getElementById("trendingTitle").style.display = "none";
  document.getElementById("searchTitle").style.display = "none";
  document.getElementById("favouriteContainer").style.display = "none";
  document.getElementById("favouriteTitle").style.display = "none";
}
