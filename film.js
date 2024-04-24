const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMWNmODYyODdiMTY1YjM5NDM2ZWZjYTU0OTgxMWZlZiIsInN1YiI6IjY2MjYyZDNiYjI2ODFmMDFhOTc0YmE4MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.H0aSH9tT7Je3Lu3VawcUPx7v8vnShlKfqIgNFL_WnfI'
  }
};

let currentPage = 1;
const maxPagesToShow = 7; // Modifier le nombre maximum de pages affichées

// Fonction pour récupérer les données des films populaires depuis l'API
async function fetchPopularMovies(page) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/popular?language=fr&page=${page}`, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error);
  }
}

// Fonction pour ajouter un film aux favoris
function addToFavorites(movie) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  favorites.push(movie);
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Fonction pour afficher les films sur la page
async function displayMovies(page) {
  const moviesList = document.getElementById('movies-list');
  moviesList.innerHTML = ''; // Clear previous movies

  const moviesData = await fetchPopularMovies(page);
  const movies = moviesData.results;

  // Ajouter un bouton "Ajouter aux favoris" à chaque film
  movies.forEach(movie => {
    // Création de la carte Bootstrap pour chaque film
    const card = document.createElement('div');
    card.classList.add('col-md-4', 'mb-4');

    card.innerHTML = `
      <div class="card">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.title}">
        <div class="card-body">
          <h5 class="card-title">${movie.title}</h5>
          <p class="card-text">${movie.overview}</p>
          <a href="detail.html?movieId=${movie.id}" class="btn btn-primary">Détails</a>
          <button class="btn btn-outline-primary add-to-favorites">Ajouter aux favoris</button>
        </div>
      </div>
    `;

    const addToFavoritesButton = card.querySelector('.add-to-favorites');
    addToFavoritesButton.addEventListener('click', () => {
      addToFavorites(movie);
    });

    moviesList.appendChild(card);
  });

  // Mettre à jour la pagination
  updatePagination(moviesData.total_pages, page);
}

// Fonction pour mettre à jour la pagination
function updatePagination(totalPages, currentPage) {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  // Ajouter un bouton pour aller à la première page
  const firstPageItem = document.createElement('li');
  firstPageItem.classList.add('page-item');
  const firstPageLink = document.createElement('a');
  firstPageLink.classList.add('page-link');
  firstPageLink.href = '#';
  firstPageLink.innerText = '<<';
  firstPageLink.addEventListener('click', () => {
    displayMovies(1);
    currentPage = 1;
  });
  firstPageItem.appendChild(firstPageLink);
  pagination.appendChild(firstPageItem);


  // Créer les liens de pagination
  for (let i = startPage; i <= endPage; i++) {
    const li = document.createElement('li');
    li.classList.add('page-item');
    if (i === currentPage) {
      li.classList.add('active');
    }
    const link = document.createElement('a');
    link.classList.add('page-link');
    link.href = '#';
    link.innerText = i;
    link.addEventListener('click', () => {
      displayMovies(i);
      currentPage = i;
    });
    li.appendChild(link);
    pagination.appendChild(li);
  }
}

// Charger les films de la première page lors du chargement initial
displayMovies(currentPage);