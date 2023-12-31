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


let pageSection = document.createElement("div");
    pageSection.id = "page";
    pageSection.innerHTML = `<button id="prevPageBtn"><i class="fa fa-angle-left"></i></button>
        <span id="pageNumber"><span class="currentPage"></span> of <span class="totalPages"></span></span>
        <button id="nextPageBtn"><i class="fa fa-angle-right"></i></button>
        `;

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
let j = 0;
let page = 1;
let addItems = (data) => {
  let newMovieSection = document.createElement("section");
  newMovieSection.classList.add("popular");
  let newMovieScroll = document.createElement("div");
  newMovieScroll.classList.add("movie-scroll-small");
  let newHeading = document.createElement("h1");

  if (j > 0) {
    newHeading.innerText = "Search Results";
  } else {
    newHeading.innerText = typeArray[i++ % 3];
  }

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

    if (movie.poster_path === null) {
      newScrollDiv.style.backgroundImage = "url(https://www.prokerala.com/movies/assets/img/no-poster-available.webp)";
      console.log(movie.poster_path);
    } else {
      newScrollDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`;
    //   console.log(movie.poster_path);
    }
    newMovieContainer.appendChild(newScrollDiv);
    newMovieScroll.appendChild(newMovieContainer);
  });
  newMovieSection.appendChild(newHeading);
  newMovieSection.appendChild(newMovieScroll);
  mainContainer.appendChild(newMovieSection);

  if (j > 0) {
    newMovieScroll.classList.add("search");
    mainContainer.appendChild(pageSection);
    let currentPage = document.querySelector(".currentPage");
    let totalPages = document.querySelector(".totalPages");

    currentPage.innerText = data.page;
    totalPages.innerText = data.total_pages;
    j--;
  } else {
    newMovieScroll.classList.remove("search");
  }
};

// ========== Add Search Data =========== //

let addSearchItems = () => {};

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
    addItems(popularData);
  }
};

// ========== Search Results =========== //

let debounce = (func, delay) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

let handleInput = async () => {
  if (searchInput.value === "") {
    page = 1;
    mainContainer.innerHTML = "";
    fetchTrending();
    fetchPopular();
  } else {
      let fetchSerchData = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${searchInput.value}&include_adult=false&language=en-US&page=${page}`,
        options
      );
      if (fetchSerchData.status === 200) {
        let searchData = await fetchSerchData.json();
        j++;
        mainContainer.innerHTML = "";
        addItems(searchData);
      }else if(fetchSerchData.status === 404){
        console.log("error");
      }
  }
};

const debounceInputHandler = debounce(handleInput, 500);

searchInput.addEventListener("input", () => {
  page = 1;
  debounceInputHandler();
});

pageSection.addEventListener("click", (e) => {
    if (e.target.id === "prevPageBtn") {
      if (page >= 2) {
        page--;
      }
      handleInput();
    } else if (e.target.id === "nextPageBtn") {
      if (page < document.querySelector(".totalPages").innerText) {
        page++;
      }
      handleInput();
    }
  });


window.onload = () => {
  fetchTrending();
  fetchPopular();
};
