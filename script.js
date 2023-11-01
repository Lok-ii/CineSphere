let mainContainer = document.querySelector("main");
let searchInput = document.querySelector("input");

let typeArray = ["Popular", "Top Rated", "Upcoming"];

const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhODdkNGZjOTE5MmE5NTNkY2ZhYTMzYzA5OWZkNjc4ZCIsInN1YiI6IjY1NDIwM2ZiMTM2NTQ1MDBmYzhhOTRmMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZNpTZeaOEiY1jA_zFxOn9HMqQMmCWbmBHrv4khpxnJw",
    },
};

// ========== Get Genre =========== //

let fetchGenre = async () => {
    let fetchG = await fetch(
        `https://api.themoviedb.org/3/genre/movie/list?language=en`,
        options
    );
    let dataGenre = await fetchG.json();
    let genre = new Map();
    genreData = dataGenre;
    dataGenre.genres.forEach((element) => {
        genre.set(element.id, element.name);
    });

    return genre;
};
let newGenreData;
fetchGenre().then((genre) => {
    newGenreData = genre;
});

// ========== Add Trending Section to Webpage=========== //

let addTrendingItems = (data) => {
    let newMovieSection = document.createElement("section");
    newMovieSection.classList.add("hero");
    let newMovieScroll = document.createElement("div");
    newMovieScroll.classList.add("movie-scroll");
    let newHeading = document.createElement("h1");
    newHeading.innerText = "Trending";
    data.results.forEach((movie) => {
        let rating = movie.vote_average;
        rating = rating.toString();
        rating = rating.slice(0, 3);

        let releaseDate = movie.release_date;
        if (releaseDate === undefined) {
            releaseDate = "";
        } else {
            releaseDate = releaseDate.toString().substring(0, 4);
        }

        let genreOne = newGenreData.has(movie.genre_ids[0])
            ? newGenreData.get(movie.genre_ids[0])
            : "";
        let genreTwo = newGenreData.has(movie.genre_ids[1])
            ? newGenreData.get(movie.genre_ids[1])
            : "";

        let mediaName = movie.title === undefined ? movie.name : movie.title;

        let newMovieContainer = document.createElement("div");
        newMovieContainer.classList.add("movie-scroll-item");
        newMovieContainer.innerHTML = `<div class="movie-background">
    <div class="icons">
        <div class="star">
            <i class="fa-regular fa-star"></i>
            <span class="rating">${rating}</span>
        </div>
    </div>

    <p class="movie-name">${mediaName}</p>
    <div class="movie-details">
        <span>${genreOne}</span>
        <span>${genreTwo}</span>
        <span>${releaseDate}</span>
    </div>
</div>`;

        newMovieContainer.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`;

        newMovieScroll.appendChild(newMovieContainer);
    });
    newMovieSection.appendChild(newHeading);
    newMovieSection.appendChild(newMovieScroll);
    mainContainer.appendChild(newMovieSection);
};

// ========== Add Other Sections to Home page=========== //

let i = 0;
let addItems = (data) => {
    let newMovieSection = document.createElement("section");
    newMovieSection.classList.add("popular");
    let newMovieScroll = document.createElement("div");
    newMovieScroll.classList.add("movie-scroll-small");
    let newHeading = document.createElement("h1");
    newHeading.innerText = typeArray[i++ % 3];

    data.results.forEach((movie) => {
        let rating = movie.vote_average;
        rating = rating.toString();
        rating = rating.slice(0, 3);

        let releaseDate = movie.release_date;
        if (releaseDate === undefined) {
            releaseDate = "";
        } else {
            releaseDate = releaseDate.toString().substring(0, 4);
        }

        let genreOne = newGenreData.has(movie.genre_ids[0])
            ? newGenreData.get(movie.genre_ids[0])
            : "";
        let genreTwo = newGenreData.has(movie.genre_ids[1])
            ? newGenreData.get(movie.genre_ids[1])
            : "";

        let mediaName = movie.title === undefined ? movie.name : movie.title;

        let newMovieContainer = document.createElement("div");
        newMovieContainer.classList.add("movie-container");
        let newScrollDiv = document.createElement("div");
        newScrollDiv.classList.add("movie-scroll-item-small");
        newScrollDiv.innerHTML = `<div class="movie-background-small">
        <div class="icons-small">
            <div class="star">
                <i class="fa-regular fa-star"></i>
                <span class="rating">${rating}</span>
            </div>
        </div>
    </div>
    <br>`;

        newScrollDiv.innerHTML += `
    <div class="details">
        <p class="movie-name-small">${mediaName}</p>
        <div class="movie-details">
        <span>${genreOne}</span>
        <span>${genreTwo}</span>
        <span>${releaseDate}</span>
        </div>
        </div>`;

        newScrollDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`;
        newMovieContainer.appendChild(newScrollDiv);
        newMovieScroll.appendChild(newMovieContainer);
    });
    newMovieSection.appendChild(newHeading);
    newMovieSection.appendChild(newMovieScroll);
    mainContainer.appendChild(newMovieSection);
};

// ========== Fetch Trending Data =========== //

let fetchTrending = async () => {
    let fetchTrendingData = await fetch(
        "https://api.themoviedb.org/3/trending/all/day?language=en-US",
        options
    );
    let trendingData = await fetchTrendingData.json();
    addTrendingItems(trendingData);
};

// ========== Fetch Popular, Top Rated, Upcoming Data =========== //

let fetchPopular = async () => {
    let keys = [
        `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`,
        `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1`,
        `https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1`,
    ];
    for (let i = 0; i < 3; i++) {
        let fetchPopularData = await fetch(keys[i], options);
        let popularData = await fetchPopularData.json();
        console.log(popularData);
        addItems(popularData);
    }
};

// ========== Search Results =========== //

let debounce = (func, delay) => {
        let timer;
        return function(...args) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                func(...args);
            }, delay);
        };
 };

 let handleInput = async ()=>{
   if(searchInput.value === ""){
    mainContainer.innerHTML = "";
    fetchTrending();
    fetchPopular();
   }else{
    let fetchSerchData = await fetch(`https://api.themoviedb.org/3/search/movie?query=${searchInput.value}&include_adult=false&language=en-US&page=1`, options);
    let searchData = await fetchSerchData.json();

    mainContainer.innerHTML = "";
    addItems(searchData);
   }
 }

 const debounceInputHandler = debounce(handleInput, 500); 

searchInput.addEventListener("input", () => {
    debounceInputHandler();
});

window.onload = () => {
    fetchTrending();
    fetchPopular();
};
