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
  
    // Création de la carte Bootstrap pour chaque série
    series.forEach(serie => {
      const card = document.createElement('div');
      card.classList.add('col-md-4', 'mb-4');
  
      card.innerHTML = `
        <div class="card">
          <img src="https://image.tmdb.org/t/p/w500${serie.poster_path}" class="card-img-top" alt="${serie.name}">
          <div class="card-body">
            <h5 class="card-title">${serie.name}</h5>
            <p class="card-text">${serie.overview}</p>
            <a href="detailserie.html?seriesId=${serie.id}" class="btn btn-primary">Détails</a>
          </div>
        </div>
      `;
  
      seriesList.appendChild(card);
    });
  
    // Mettre à jour la pagination
    updatePagination(seriesData.total_pages, page);
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
  
  // Charger les séries de la première page lors du chargement initial
  displaySeries(currentPage);
  