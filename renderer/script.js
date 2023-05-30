const { ipcRenderer } = require("electron");

const titleElement = document.querySelector("#show-title");
const yearElement = document.querySelector("#year");
const ratingElement = document.querySelector("#rating");
const genreElement = document.querySelector("#genre");
const imdbRatingElement = document.querySelector("#imdb-rating");
const posterImageElement = document.querySelector("#poster-image");
const searchBtn = document.querySelector("button");

searchBtn.addEventListener("click", (event) => {
    event.preventDefault();

    const movieTitle = document.querySelector("#show-search-box").value;
    if (movieTitle.length === 0) {
        clearMovieInfo();

        const divTag = document.querySelector(".movie-info");
        const msgElement = document.createElement("h2");
        msgElement.textContent = "Please enter a movie title";
        divTag.appendChild(msgElement);
    } else {
        ipcRenderer.send("movie-title", movieTitle);
    };
});

function updateMovieInfo(title, year, rating, genre, imdbRating, imageUrl) {
    const msgElement = document.querySelector("h2");
    msgElement?.remove();

    titleElement.textContent = `Title: ${title}`;
    yearElement.textContent = `Year: ${year}`;
    ratingElement.textContent = `Rating: ${rating}`;
    genreElement.textContent = `Genre: ${genre}`;
    imdbRatingElement.textContent = `IMDB Rating: ${imdbRating}`;
    (imageUrl != "N/A") ? posterImageElement.src = imageUrl : null;
};

function clearMovieInfo() {
    const divTag = document.querySelector(".movie-info");
    const divTagElements = divTag.querySelectorAll("*");
  
    divTagElements.forEach((element) => {
      element.textContent = "";
      element.src = "";
      element.classList.remove("show-border");
    });
};

function showImageBorder() {
    let imageElement = document.querySelector("img");
    imageElement.classList.add("show-border");
};

ipcRenderer.on("notFoundMessage", (event, notFoundMessage) => {
    clearMovieInfo();

    const divTag = document.querySelector(".movie-info");
    const msgElement = document.createElement("h2");
    msgElement.textContent = notFoundMessage;
    divTag.appendChild(msgElement);
});

ipcRenderer.on("movieData", (event, title, year, rating, genre, imdbRating, imageUrl) => {
    clearMovieInfo();
    updateMovieInfo(title, year, rating, genre, imdbRating, imageUrl);
});