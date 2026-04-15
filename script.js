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

async function searchMovies() {
  const query = document.getElementById("searchInput").value.trim();

  if (query === "") {
    alert("Enter a movie name!");
    return;
  }

  hideAllSections();
  document.getElementById("searchTitle").style.display = "block";

  const container = document.getElementById("movieContainer");
  container.innerHTML = "Loading...";

  try {
    const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`);
    const data = await response.json();

    if (data.Response === "False") {
      container.innerHTML = "No movies found";
      return;
    }

    displayMovies(data.Search);
    localStorage.setItem("lastSearch", JSON.stringify(data.Search));

  } catch (error) {
    container.innerHTML = "Error fetching data";
  }
}

