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

function displayMovies(movies) {
  const container = document.getElementById("movieContainer");
  const favourites = getFavourites();

  container.innerHTML = movies.map(movie => {
    const isLiked = favourites.some(f => f.imdbID === movie.imdbID);

    return `
      <div class="movie">
        <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/150"}"
             onclick="showMovieDetails('${movie.imdbID}')" />
        <h3>${movie.Title}</h3>
        <p>${movie.Year}</p>

        ${
          isLiked
            ? `<button onclick="removeFromFavourites('${movie.imdbID}')">💔 Unlike</button>`
            : `<button onclick="addToFavourites('${movie.imdbID}')">❤️ Like</button>`
        }
      </div>
    `;
  }).join("");
}

async function showMovieDetails(id) {
  hideAllSections();

  const container = document.getElementById("movieContainer");
  container.innerHTML = "Loading...";

  try {
    const response = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`);
    const movie = await response.json();

    const favourites = getFavourites();
    const isLiked = favourites.some(f => f.imdbID === movie.imdbID);

    container.innerHTML = `
      <div class="movie-details">
        <button class="back-btn" onclick="goBack()">⬅ Back</button>
        <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/150"}" />
        <h2>${movie.Title}</h2>
        <p><b>Year:</b> ${movie.Year}</p>
        <p><b>Genre:</b> ${movie.Genre}</p>
        <p><b>Plot:</b> ${movie.Plot}</p>

        ${
          isLiked
            ? `<button onclick="removeFromFavourites('${movie.imdbID}')">💔 Unlike</button>`
            : `<button onclick="addToFavourites('${movie.imdbID}')">❤️ Like</button>`
        }
      </div>
    `;
  } catch (error) {
    container.innerHTML = "Error loading movie details";
  }
}

function goBack() {
  const lastSearch = JSON.parse(localStorage.getItem("lastSearch"));

  if (lastSearch && lastSearch.length > 0) {
    hideAllSections();
    document.getElementById("searchTitle").style.display = "block";
    displayMovies(lastSearch);
  } else {
    document.getElementById("trendingContainer").style.display = "flex";
    document.getElementById("trendingTitle").style.display = "block";

    displayFavourites();
    document.getElementById("movieContainer").innerHTML = "";
  }
}

async function addToFavourites(id) {
  const response = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`);
  const movie = await response.json();

  let favourites = getFavourites();

  if (!favourites.some(m => m.imdbID === id)) {
    favourites.push(movie);
    saveFavourites(favourites);
    displayFavourites();

    
    const lastSearch = JSON.parse(localStorage.getItem("lastSearch"));
    if (lastSearch) displayMovies(lastSearch);
  }
}

function removeFromFavourites(id) {
  let favourites = getFavourites();

  favourites = favourites.filter(movie => movie.imdbID !== id);

  saveFavourites(favourites);


  displayFavourites();

  
  if (favourites.length === 0) {
    document.getElementById("trendingContainer").style.display = "flex";
    document.getElementById("trendingTitle").style.display = "block";

    document.getElementById("searchTitle").style.display = "none";
    document.getElementById("movieContainer").innerHTML = "";

    localStorage.removeItem("lastSearch");
  }
}

function displayFavourites() {
  const container = document.getElementById("favouriteContainer");
  const title = document.getElementById("favouriteTitle");
  const favourites = getFavourites();

  if (favourites.length === 0) {
    container.innerHTML = "";
    container.style.display = "none";
    title.style.display = "none";
    return;
  }

  container.style.display = "flex";
  title.style.display = "block";

  container.innerHTML = favourites.map(movie => `
    <div class="movie">
      <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/150"}"
           onclick="showMovieDetails('${movie.imdbID}')" />
      <h3>${movie.Title}</h3>
      <button onclick="removeFromFavourites('${movie.imdbID}')">💔 Unlike</button>
    </div>
  `).join("");
}


document.getElementById("searchInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    searchMovies();
  }
});


window.onload = function () {
  document.getElementById("trendingContainer").style.display = "flex";
  document.getElementById("trendingTitle").style.display = "block";
  document.getElementById("searchTitle").style.display = "none";
  document.getElementById("movieContainer").innerHTML = "";

  displayFavourites();
};