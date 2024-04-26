const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMWNmODYyODdiMTY1YjM5NDM2ZWZjYTU0OTgxMWZlZiIsInN1YiI6IjY2MjYyZDNiYjI2ODFmMDFhOTc0YmE4MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.H0aSH9tT7Je3Lu3VawcUPx7v8vnShlKfqIgNFL_WnfI'
  }
};

let currentPage = 1;
const maxPagesToShow = 7; // Modifier le nombre maximum de pages affichées

// Fonction pour récupérer les données des séries populaires depuis l'API
async function fetchPopularSeries(page) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/tv/popular?language=fr-FR&page=${page}`, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error);
  }
}

// Fonction pour afficher les séries sur la page
async function displaySeries(page) {
  const seriesList = document.getElementById('series-list');
  seriesList.innerHTML = ''; // Clear previous series

  const seriesData = await fetchPopularSeries(page);
  const series = seriesData.results;

  // Ajouter chaque série à la liste avec un bouton "Ajouter aux favoris"
  series.forEach(serie => {
    // Création de la carte Bootstrap pour chaque série
    const card = document.createElement('div');
    card.classList.add('col-md-4', 'mb-4');

    card.innerHTML = `
      <div class="card">
        <img src="https://image.tmdb.org/t/p/w500${serie.poster_path}" class="card-img-top" alt="${serie.original_name}">
        <div class="card-body">
          <h5 class="card-title">${serie.original_name}</h5>
          <p class="card-text">${serie.overview}</p>
          <a href="detailserie.html?seriesId=${serie.id}" class="btn btn-primary">Détails</a>
          <button class="btn btn-outline-primary add-to-favorites" data-id="${serie.id}">Ajouter aux favoris</button>
        </div>
      </div>
    `;

    const addToFavoritesButton = card.querySelector('.add-to-favorites');
    addToFavoritesButton.addEventListener('click', () => {
      addToFavorites(serie);
    });

    seriesList.appendChild(card);
  });

  // Mettre à jour la pagination
  updatePagination(seriesData.total_pages, page);
}

// Fonction pour ajouter une série aux favoris
function addToFavorites(series) {
  let favorites = JSON.parse(localStorage.getItem('seriesFavorites')) || [];
  // Vérifier si la série est déjà dans la liste des favoris
  const isAlreadyAdded = favorites.some(favorite => favorite.id === series.id);
  if (isAlreadyAdded) {
    alert("Cette série est déjà dans la liste de favoris.");
    return; // Ne pas ajouter la série si elle est déjà dans la liste
  }
  favorites.push(series);
  localStorage.setItem('seriesFavorites', JSON.stringify(favorites));
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
    displaySeries(1);
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
      displaySeries(i);
      currentPage = i;
    });
    li.appendChild(link);
    pagination.appendChild(li);
  }
}

// Fonction pour effectuer la recherche de films et séries
async function searchMoviesAndSeries(query) {
  try {
      const response = await fetch(`https://api.themoviedb.org/3/search/multi?query=${query}&include_adult=false&language=fr-FR&page=1`, options);
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Erreur lors de la recherche de films et séries :', error);
  }
}

// Fonction pour effectuer une recherche en temps réel à chaque frappe de clavier
// Fonction pour effectuer une recherche en temps réel à chaque frappe de clavier
document.getElementById('myInput').addEventListener('input', async (event) => {
  const searchTerm = event.target.value.trim(); // Récupérer le terme de recherche

  if (searchTerm) { // Vérifier si le champ de recherche n'est pas vide
      const searchData = await searchMoviesAndSeries(searchTerm);

      // Afficher les résultats dans la modal-body
      const searchResultsContainer = document.getElementById('searchResults');
      searchResultsContainer.innerHTML = ''; // Effacer le contenu précédent

      // Vérifier si des résultats ont été trouvés
      if (searchData.results.length > 0) {
          searchData.results.forEach(result => {
              if (result.backdrop_path && result.title) {
                  const button = document.createElement('button');
                  button.classList.add('btn', 'd-flex', 'align-items-center', 'justify-content-between', 'flex-row-reverse', 'w-100', 'border-bottom', 'm-1');
                  const imageUrl = `https://image.tmdb.org/t/p/w500${result.backdrop_path}`;
                  button.innerHTML = `
                      <img src="${imageUrl}" width="75px" alt="${result.title}">
                      <div class="mt-2">${result.title}</div>
                  `;
                  button.addEventListener('click', () => {
                      
                      // Action à effectuer lorsque l'utilisateur clique sur le bouton
                      // Par exemple : rediriger vers la page du film ou de la série
                  });
                  searchResultsContainer.appendChild(button);
              } else if (!result.backdrop_path && result.title) {
                  const button = document.createElement('button');
                  button.classList.add('btn', 'd-flex', 'align-items-center', 'justify-content-between', 'flex-row-reverse', 'w-100', 'border-bottom', 'm-1');
                  button.innerHTML = `
                      <div class="mt-2">${result.title}</div>
                  `;
                  button.addEventListener('click', () => {
                      // Action à effectuer lorsque l'utilisateur clique sur le bouton
                      // Par exemple : rediriger vers la page du film ou de la série
                  });
                  searchResultsContainer.appendChild(button);
              }
          });
      } else {
  searchResultsContainer.innerHTML = '<p>Aucun résultat trouvé.</p>';
}

  } else {
      const searchResultsContainer = document.getElementById('searchResults');
      searchResultsContainer.innerHTML = ''; // Effacer le contenu si le champ de recherche est vide
  }
});


// Charger les séries de la première page lors du chargement initial
displaySeries(currentPage);
