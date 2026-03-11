// ================================
// Variables and DOM Elements
// ================================
let movies = [];  // search results
let trends = [];  // trending movies
const MAX_TRENDS = 6;

let moviePanel = document.getElementById('moviePanel');
const movieContent = document.getElementById('movieContent');
const closeBtn = document.getElementById('closeBtn');
let moviePanelOpen = false;

let resultsDiv = document.getElementById('results');
let latestDiv = document.getElementById('latest');

const API_KEY = 'd194eb72915bc79fac2eb1a70a71ddd3';
const BASE_URL = 'https://api.themoviedb.org/3';

// ================================
// Movie Panel Functions
// ================================
function toggleMoviePanel(open) {
  if (open) {
    $('#moviePanel').animate({ bottom: 0 }, 320, 'swing');
    moviePanelOpen = true;
  } else {
    $('#moviePanel').animate({ bottom: -$('#moviePanel').outerHeight() }, 260, 'swing');
    moviePanelOpen = false;
  }
}

closeBtn.addEventListener('click', () => {
  toggleMoviePanel(false);
});

async function showMovie(movie) {
  const videos = await fetchMovieVideos(movie.id);
  console.log('Fetched videos for movie:', movie.title, videos);

  const trailer =
    videos.filter(v => v.site === "YouTube" && v.name.toLowerCase().includes("trailer"))
      .pop() ||
    videos.find(v => v.site === "YouTube");

  let trailerEmbed = '';

  if (trailer) {
    const thumbnailUrl = `https://img.youtube.com/vi/${trailer.key}/hqdefault.jpg`;

    trailerEmbed = `
      <div class="trailer-wrapper">
        <a href="https://www.youtube.com/watch?v=${trailer.key}" target="_blank">
          <img src="${thumbnailUrl}" class="trailer-thumbnail" alt="Watch Trailer">
        </a>
      </div>
    `;
  } else {
    trailerEmbed = '<p class="no-trailer">Trailer not available</p>';
  }

  const inWatchlist = watchlist.includes(movie.id);

  movieContent.innerHTML = `
    <div class="moviePanelLeft">
      <img src="https://image.tmdb.org/t/p/w342${movie.posterPath}" class="largePoster">

      ${trailerEmbed}

      <h1>${movie.title}</h1>
      <p>${movie.overview}</p>
      <div class="year">${movie.releaseDate}</div>
      <div class="rating">Rating: ${movie.voteAverage}</div>

      <button id="watchlist-btn" class="watchlist-btn ${inWatchlist ? 'active' : ''}">
        <img class="watchlist-icon" src="${inWatchlist ? ACTIVE_ICON : EMPTY_ICON}">
        <span>${inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
      </button>
    </div>
  `;

  // ✅ Button logic AFTER HTML exists
  const btn = document.getElementById('watchlist-btn');
  const icon = btn.querySelector('.watchlist-icon');
  const text = btn.querySelector('span');

  btn.addEventListener('click', () => {
    if (watchlist.includes(movie.id)) {
      watchlist = watchlist.filter(id => id !== movie.id);
      btn.classList.remove('active');
      icon.src = EMPTY_ICON;
      text.textContent = 'Add to Watchlist';
    } else {
      watchlist.push(movie.id);
      btn.classList.add('active');
      icon.src = ACTIVE_ICON;
      text.textContent = 'In Watchlist';
    }

    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    syncWatchlistUI();
  });

  toggleMoviePanel(true);
}



// ================================
// Fetch Movie by ID
// ================================
async function fetchMovieById(id) {
  const url = `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  const data = await response.json();
  return Movie.fromJson(data);
}

async function fetchMovieVideos(id) {
  const url = `${BASE_URL}/movie/${id}/videos?api_key=6d60dad579d4904b8b4d356fc0614b7a`;
  const response = await fetch(url);
  const data = await response.json();
  return data.results.map(json => MovieVideo.fromJson(json));
}


// ================================
// Search and Trending Functions
// ================================
async function searchMovies() {
  const query = document.querySelector('#txtSearch').value;
  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  const data = await response.json();
  movies = data.results.map(json => Movie.fromJson(json));
  showPosters();
}

async function getTrending() {
  const query = document.querySelector('#txtSearch').value;
  const url = `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  const data = await response.json();
  trends = data.results.map(json => Movie.fromJson(json));
  displayTrends();
}

// ================================
// Display Functions
// ================================
function showPosters() {
  console.log('showPosters called, movies:', movies.length);
  resultsDiv.innerHTML = '';

  for (let i = 0; i < movies.length; i++) {
  const movie = movies[i];

    if (!movies[i].posterPath) continue;

  const card = document.createElement('div');
  card.className ='movie-card';
  card.dataset.id = movie.id;

  card.innerHTML = `
 <img 
 src="https://image.tmdb.org/t/p/w342${movie.posterPath}" 
 alt="${movie.title}"
 class="poster"
>

<button class="watchlist-btn">
<img class="watchlist-icon" src="assets/images/watchlist-logo-active.png">
<span>Add to Watchlist</span>
</button>
 `;

 card.querySelector('.poster').addEventListener('click', async () => {
console.log('Poster clicked:', movie.title);
const fullMovie = await fetchMovieById(movie.id);
console.log("Full movie fetched:", fullMovie);
showMovie(fullMovie);
 });

resultsDiv.appendChild(card);
  }

syncWatchlistUI();
}

async function showWatchlist() {
resultsDiv.innerHTML = '';

if (watchlist.length === 0) {
resultsDiv.innerHTML = '<p>Your watchlist is empty</p>';
return;
}

for (const id of watchlist) {
const movie = await fetchMovieById(id);


const card = document.createElement('div');
card.className = 'movie-card';
card.dataset.id = movie.id;


card.innerHTML = `
<img
src="https://image.tmdb.org/t/p/w342${movie.posterPath}"
class="poster"
alt="${movie.title}"
>
`;

card.querySelector('.poster').addEventListener('click', () => {
showMovie(movie);
});

resultsDiv.appendChild(card);
}
}

// ================================
// Example static items (if any)
// ================================
document.querySelectorAll('.movieItem').forEach(el => {
  el.addEventListener('click', async () => {
    const movie = await fetchMovieById(el.dataset.id);
    showMovie(movie);
  });
});

// ================================
// Menu and Lightbox (unchanged)
// ================================
let menuOpen = false;

function toggleMenu() {
  if (!menuOpen) $('nav').animate({ right: 0 }, 320, 'swing');
  else $('nav').animate({ right: -226 }, 260, 'swing');
  menuOpen = !menuOpen;
}

function showBox(num) {
  $('#lightbox').css('visibility', 'visible');
  $('#lightboxImage').attr('src', 'assets/images/pic' + num + '.png');
}

function hideBox() {
  $('#lightbox').css('visibility', 'hidden');
}

function closeNav() {
  $('nav').animate({ right: -226 }, 220, 'swing');
  menuOpen = false;
}

let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

const EMPTY_ICON = "assets/images/watchlist-logo-active.png";
const ACTIVE_ICON = "assets/images/watchlist-logo-active.png";


function syncWatchlistUI() {
document.querySelectorAll(".movie-card").forEach(card => {
const movieId = card.dataset.id;
const btn = card.querySelector(".watchlist-btn");
const icon = btn? btn.querySelector(".watchlist-icon"): null;

if (!btn || !icon) return;

if (watchlist.includes(movieId)) {
btn.classList.add("active");
icon.src = ACTIVE_ICON;
} else {
btn.classList.remove("active");
icon.src = EMPTY_ICON;
}
});
}

const apiKey = '6d60dad579d4904b8b4d356fc0614b7a';
const container = document.getElementById('trending-movies');
container.innerHTML ='';

fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`)
.then(res => res.json())
.then(data => {
data.results.slice(0, 6).forEach(movie => {
const card = document.createElement('div');
card.classList.add('movie-card');
card.innerHTML = `
<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
alt="${movie.title} Poster"
class="poster">
`;

card.querySelector('.poster').addEventListener('click', async () => {
try {
const fullMovie = await fetchMovieById(movie.id);
showMovie(fullMovie);
} catch (err) {
console.error('failed to load movie details:', err);
}
});
container.appendChild(card);
});
})
.catch(err => console.error('Error fetching trending movies:', err));

const watchlistIcon = document.getElementById('watchlistIcon');

watchlistIcon.addEventListener('click', () => {
  renderWatchlist();
  watchlistPanel.style.display = 'block';
});

const watchlistPanel = document.getElementById('watchlistPanel');
const watchlistMoviesDiv = document.getElementById('watchlistMovies');
const closeWatchlistBtn = document.getElementById('closeWatchlist');


closeWatchlistBtn.addEventListener('click', () => {
watchlistPanel.style.display = 'none';
});

function renderWatchlist() {
  watchlistMoviesDiv.innerHTML = '';

  if (watchlist.length === 0) {
    watchlistMoviesDiv.innerHTML = '<p>Your watchlist is empty</p>';
    return;
  }

  watchlist.forEach(async (id) => {
    const movie = await fetchMovieById(id);

    const movieDiv = document.createElement('div');
    movieDiv.className = 'watchlist-movie';

    movieDiv.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w92${movie.posterPath}" alt="${movie.title}">
      <span>${movie.title}</span>
      <button class="remove-btn">Remove</button>
    `;

    const removeBtn = movieDiv.querySelector('.remove-btn');
    removeBtn.addEventListener('click', () => {
      watchlist = watchlist.filter(mId => mId !== movie.id);
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
      renderWatchlist();
      syncWatchlistUI();
    });

    watchlistMoviesDiv.appendChild(movieDiv);
  });
} // <-- closes renderWatchlist


