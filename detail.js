// Récupérer l'identifiant du film depuis l'URL
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('movieId');
console.log('Movie ID:', movieId); // Vérifiez la valeur de movieId dans la console du navigateur

  // Fonction pour récupérer les détails du film depuis l'API
  async function fetchMovieDetails(movieId) {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMWNmODYyODdiMTY1YjM5NDM2ZWZjYTU0OTgxMWZlZiIsInN1YiI6IjY2MjYyZDNiYjI2ODFmMDFhOTc0YmE4MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.H0aSH9tT7Je3Lu3VawcUPx7v8vnShlKfqIgNFL_WnfI'
      }
    };

    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=fr`, options);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des détails du film :', error);
    }
  }

  async function fetchMovieCredits(movieId) {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMWNmODYyODdiMTY1YjM5NDM2ZWZjYTU0OTgxMWZlZiIsInN1YiI6IjY2MjYyZDNiYjI2ODFmMDFhOTc0YmE4MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.H0aSH9tT7Je3Lu3VawcUPx7v8vnShlKfqIgNFL_WnfI'
      }
    };
  
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`, options);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des crédits du film :', error);
      return null;
    }
  }

  async function fetchSimilarMovies(movieId, limit) {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMWNmODYyODdiMTY1YjM5NDM2ZWZjYTU0OTgxMWZlZiIsInN1YiI6IjY2MjYyZDNiYjI2ODFmMDFhOTc0YmE4MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.H0aSH9tT7Je3Lu3VawcUPx7v8vnShlKfqIgNFL_WnfI'
      }
    };
  
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/similar?language=en-US&page=1`, options);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const similarMovies = data.results.slice(0, limit).map(movie => ({
          title: movie.title,
          posterPath: movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : null
        }));
        return similarMovies;
      } else {
        return "Aucun film similaire trouvé";
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des films similaires :', error);
      return "Information non disponible";
    }
  }
  
  
let displayedActors = 10; // Nombre d'acteurs déjà affichés

// Fonction pour récupérer les noms des acteurs du film avec une limite
async function getActorsNames(movieId, limit) {
  try {
    const movieCredits = await fetchMovieCredits(movieId);
    if (movieCredits && movieCredits.cast && movieCredits.cast.length > 0) {
      const actorsNames = movieCredits.cast.slice(0, limit).map(actor => actor.name);
      return actorsNames.join(', ');
    } else {
      return "Information non disponible";
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des acteurs :', error);
    return "Information non disponible";
  }
}
  
  // Fonction pour récupérer les genres du film
function getGenres(movieDetails) {
    if (movieDetails && movieDetails.genres && movieDetails.genres.length > 0) {
      return movieDetails.genres.map(genre => genre.name).join(', ');
    } else {
      return "Information non disponible";
    }
  }  

  // Fonction pour récupérer les pays d'origine du film
function getProductionCountries(movieDetails) {
    if (movieDetails && movieDetails.production_countries && movieDetails.production_countries.length > 0) {
      return movieDetails.production_countries.map(country => country.name).join(', ');
    } else {
      return "Information non disponible";
    }
  }

 // Fonction pour récupérer le réalisateur du film
async function getDirector(movieId) {
  try {
    const movieCredits = await fetchMovieCredits(movieId);
    if (movieCredits && movieCredits.crew && movieCredits.crew.length > 0) {
      const director = movieCredits.crew.find(member => member.job === 'Director');
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

// Fonction pour afficher les détails du film, y compris le réalisateur et l'affiche du film
async function displayMovieDetails() {
  const movieDetailsContainer = document.getElementById('movie-details');

  // Récupérer l'identifiant du film depuis l'URL
  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get('movieId');

  // Récupérer les détails du film
  const movieDetails = await fetchMovieDetails(movieId);
  console.log('Movie Details:', movieDetails); // Vérifiez les détails du film dans la console du navigateur

  // Afficher les détails du film dans le conteneur
  if (movieDetails) {

    // Récupérer les noms des acteurs avec une limite
    const actors = await getActorsNames(movieId, displayedActors);
    console.log('Actors:', actors); // Vérifiez les acteurs dans la console du navigateur

    const genres = getGenres(movieDetails);
    const productionCountries = getProductionCountries(movieDetails);

    // Récupérer le réalisateur du film
    const director = await getDirector(movieId);
    console.log('Director:', director); // Vérifiez le réalisateur dans la console du navigateur

    // Récupérer les recommandations de films similaires avec leurs posters
    const similarMovies = await fetchSimilarMovies(movieId, 10);
    console.log('Similar Movies:', similarMovies); // Vérifiez les films similaires dans la console du navigateur

      // Créer les cartes Bootstrap pour afficher les films similaires
    const similarMoviesHTML = similarMovies.map(movie => `
    <div class="col-lg-2 col-md-4 col-sm-6 mb-4">
      <div class="card">
        <img src="${movie.posterPath ? movie.posterPath : 'https://via.placeholder.com/300x450'}" class="card-img-top" alt="Poster du film ${movie.title}">
        <div class="card-body">
          <h5 class="card-title">${movie.title}</h5>
        </div>
      </div>
    </div>
  `).join('');

  // Insérer les cartes dans le conteneur des films similaires avec une barre de défilement horizontale
  movieDetailsContainer.innerHTML = `
    <h2>${movieDetails.title}</h2>
    <img src="https://image.tmdb.org/t/p/w500/${movieDetails.poster_path}" alt="Poster du film ${movieDetails.title}">
    <p><strong>Description :</strong> ${movieDetails.overview}</p>
    <p><strong>Date de sortie :</strong> ${movieDetails.release_date}</p>
    <p><strong>Réalisateur :</strong> ${director}</p>
    <p><strong>Acteurs :</strong> ${actors}</p>
    <p><strong>Genres :</strong> ${genres}</p>
    <p><strong>Pays d'origine :</strong> ${productionCountries}</p>
    <h3>Films similaires :</h3>
    <div class="row flex-nowrap overflow-auto">
      ${similarMoviesHTML}
    </div>
  `;
} else {
  movieDetailsContainer.innerHTML = "<p>Les détails de ce film ne sont pas disponibles pour le moment.</p>";
}
}

// Charger les détails du film lors du chargement initial de la page
displayMovieDetails();