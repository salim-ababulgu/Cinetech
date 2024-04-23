// Récupérer l'identifiant de la série depuis l'URL
const urlParams = new URLSearchParams(window.location.search);
const seriesId = urlParams.get('seriesId');
console.log('Série ID:', seriesId); // Vérifiez la valeur de seriesId dans la console du navigateur

// Fonction pour récupérer les détails de la série depuis l'API
async function fetchSeriesDetails(seriesId) {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMWNmODYyODdiMTY1YjM5NDM2ZWZjYTU0OTgxMWZlZiIsInN1YiI6IjY2MjYyZDNiYjI2ODFmMDFhOTc0YmE4MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.H0aSH9tT7Je3Lu3VawcUPx7v8vnShlKfqIgNFL_WnfI'
    }
  };

  try {
    const response = await fetch(`https://api.themoviedb.org/3/tv/${seriesId}?language=en-US`, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des détails de la série :', error);
  } 
}

async function fetchSeriesCredits(seriesId) {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMWNmODYyODdiMTY1YjM5NDM2ZWZjYTU0OTgxMWZlZiIsInN1YiI6IjY2MjYyZDNiYjI2ODFmMDFhOTc0YmE4MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.H0aSH9tT7Je3Lu3VawcUPx7v8vnShlKfqIgNFL_WnfI'
      }
    };
  
    try {
      const response = await fetch(`https://api.themoviedb.org/3/tv/${seriesId}/credits?language=en-US`, options);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des crédits de la série :', error);
      return null;
    }
  }

  async function fetchSimilarSeries(seriesId, limit) {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMWNmODYyODdiMTY1YjM5NDM2ZWZjYTU0OTgxMWZlZiIsInN1YiI6IjY2MjYyZDNiYjI2ODFmMDFhOTc0YmE4MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.H0aSH9tT7Je3Lu3VawcUPx7v8vnShlKfqIgNFL_WnfI'
      }
    };
  
    try {
      const response = await fetch(`https://api.themoviedb.org/3/tv/${seriesId}/similar?language=en-US&page=1`, options);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const similarSeries = data.results.slice(0, limit).map(serie => ({
          name: serie.name,
          posterPath: serie.poster_path ? `https://image.tmdb.org/t/p/w500/${serie.poster_path}` : null
        }));
        return similarSeries;
      } else {
        return "Aucune série similaire trouvée";
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des séries similaires :', error);
      return "Information non disponible";
    }
  }
  
  let displayedActors = 10; // Nombre d'acteurs déjà affichés

// Fonction pour récupérer les noms des acteurs de la série avec une limite
async function getActorsNames(seriesId, limit) {
  try {
    const seriesCredits = await fetchSeriesCredits(seriesId);
    if (seriesCredits && seriesCredits.cast && seriesCredits.cast.length > 0) {
      const actorsNames = seriesCredits.cast.slice(0, limit).map(actor => actor.name);
      return actorsNames.join(', ');
    } else {
      return "Information non disponible";
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des acteurs :', error);
    return "Information non disponible";
  }
}

// Fonction pour récupérer les genres de la série
function getSeriesGenres(seriesDetails) {
    if (seriesDetails && seriesDetails.genres && seriesDetails.genres.length > 0) {
      return seriesDetails.genres.map(genre => genre.name).join(', ');
    } else {
      return "Information non disponible";
    }
}

// Fonction pour récupérer les pays d'origine de la série
function getSeriesProductionCountries(seriesDetails) {
    if (seriesDetails && seriesDetails.production_countries && seriesDetails.production_countries.length > 0) {
      return seriesDetails.production_countries.map(country => country.name).join(', ');
    } else {
      return "Information non disponible";
    }
  }
  
  // Fonction pour récupérer le réalisateur de la série
  async function getSeriesDirector(seriesId) {
    try {
      const seriesCredits = await fetchSeriesCredits(seriesId);
      if (seriesCredits && seriesCredits.crew && seriesCredits.crew.length > 0) {
        const director = seriesCredits.crew.find(member => member.job === 'Director');
        if (director) {
          return director.name;
        } else {
          return "Information non disponible";
        }
      } else {
        return "Information non disponible";
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du réalisateur :', error);
      return "Information non disponible";
    }
  }
  


// Fonction pour afficher les détails de la série, y compris le réalisateur et l'affiche de la série
async function displaySeriesDetails() {
    const seriesDetailsContainer = document.getElementById('series-details');
  
    // Récupérer l'identifiant de la série depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const seriesId = urlParams.get('seriesId');
  
    // Récupérer les détails de la série
    let seriesDetails; // Déclarer seriesDetails avec let
    try {
      seriesDetails = await fetchSeriesDetails(seriesId);
      console.log('Series Details:', seriesDetails); // Vérifiez les détails de la série dans la console du navigateur
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de la série :', error);
      seriesDetailsContainer.innerHTML = "<p>Les détails de cette série ne sont pas disponibles pour le moment.</p>";
      return; // Sortir de la fonction si une erreur se produit
    }
  
    // Afficher les détails de la série dans le conteneur
    if (seriesDetails) {
  
      // Récupérer les noms des acteurs avec une limite
      const actors = await getActorsNames(seriesId, displayedActors);
      console.log('Actors:', actors); // Vérifiez les acteurs dans la console du navigateur
  
      const genres = getSeriesGenres(seriesDetails); // Remplacer getGenres par getSeriesGenres
      const productionCountries = getSeriesProductionCountries(seriesDetails); // Utiliser la fonction appropriée pour les pays d'origine
  
      // Récupérer le réalisateur de la série
      const director = await getSeriesDirector(seriesId);
      console.log('Director:', director); // Vérifiez le réalisateur dans la console du navigateur
  
      // Récupérer les séries similaires
      const similarSeries = await fetchSimilarSeries(seriesId, 10);
      console.log('Similar Series:', similarSeries); // Vérifiez les séries similaires dans la console du navigateur
  
      // Créer les cartes Bootstrap pour afficher les séries similaires
      const similarSeriesHTML = similarSeries.map(serie => `
        <div class="col-lg-2 col-md-4 col-sm-6 mb-4">
          <div class="card">
            <img src="${serie.posterPath ? serie.posterPath : 'https://via.placeholder.com/300x450'}" class="card-img-top" alt="Poster de la série ${serie.name}">
            <div class="card-body">
              <h5 class="card-title">${serie.name}</h5>
            </div>
          </div>
        </div>
      `).join('');
  
      // Insérer les cartes dans le conteneur des séries similaires avec une barre de défilement horizontale
      seriesDetailsContainer.innerHTML = `
        <h2>${seriesDetails.name}</h2>
        <img src="https://image.tmdb.org/t/p/w500/${seriesDetails.poster_path}" alt="Poster de la série ${seriesDetails.name}">
        <p><strong>Description :</strong> ${seriesDetails.overview}</p>
        <p><strong>Date de première diffusion :</strong> ${seriesDetails.first_air_date}</p>
        <p><strong>Réalisateur :</strong> ${director}</p>
        <p><strong>Acteurs :</strong> ${actors}</p>
        <p><strong>Genres :</strong> ${genres}</p>
        <p><strong>Pays d'origine :</strong> ${productionCountries}</p>
        <h3>Séries similaires :</h3>
        <div class="row flex-nowrap overflow-auto">
          ${similarSeriesHTML}
        </div>
      `;
    } else {
      seriesDetailsContainer.innerHTML = "<p>Les détails de cette série ne sont pas disponibles pour le moment.</p>";
    }
  }
  
  // Charger les détails de la série lors du chargement initial de la page
  displaySeriesDetails();
  