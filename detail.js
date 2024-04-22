  // Récupérer l'identifiant des film, acteurs et réalisateurs à partir de l'URL
  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get('movieId');

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

  async function fetchPersonDetails(personId) {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/person/${personId}?language=fr`, options);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de la personne :', error);
    }
  }
  
  // Fonction pour récupérer les noms des réalisateurs
async function getDirectors(movieDetails) {
    if (movieDetails && movieDetails.credits && movieDetails.credits.crew && movieDetails.credits.crew.length > 0) {
      const directors = [];
      for (const crewMember of movieDetails.credits.crew) {
        if (crewMember.job === 'Director') {
          const directorDetails = await fetchPersonDetails(crewMember.id);
          if (directorDetails) {
            directors.push(directorDetails.name);
          }
        }
      }
      return directors.length > 0 ? directors.join(', ') : "Information non disponible";
    } else {
      return "Information non disponible";
    }
  }
  
  // Fonction pour récupérer les noms des acteurs principaux
  async function getActors(movieDetails) {
    if (movieDetails && movieDetails.credits && movieDetails.credits.cast && movieDetails.credits.cast.length > 0) {
      const actors = movieDetails.credits.cast.slice(0, 5); // Prend les 5 premiers acteurs
      const actorNames = [];
      for (const actor of actors) {
        const actorDetails = await fetchPersonDetails(actor.id);
        if (actorDetails) {
          actorNames.push(actorDetails.name);
        }
      }
      return actorNames.length > 0 ? actorNames.join(', ') : "Information non disponible";
    } else {
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

 // Fonction pour afficher les détails du film
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
        const baseUrl = 'https://image.tmdb.org/t/p/';
        const posterUrl = `${baseUrl}${movieDetails.poster_path}`;
        console.log('Poster URL:', posterUrl); // Vérifiez l'URL de l'affiche dans la console du navigateur

        const directors = await getDirectors(movieDetails);
        console.log('Directors:', directors); // Vérifiez les réalisateurs dans la console du navigateur

        const actors = await getActors(movieDetails);
        console.log('Actors:', actors); // Vérifiez les acteurs dans la console du navigateur

        const genres = getGenres(movieDetails);
        const productionCountries = getProductionCountries(movieDetails);

        // Création de la structure HTML pour afficher les détails
        movieDetailsContainer.innerHTML = `
            <h2>${movieDetails.title}</h2>
            <img src="${posterUrl}" alt="${movieDetails.title} Poster">
            <p><strong>Description :</strong> ${movieDetails.overview}</p>
            <p><strong>Date de sortie :</strong> ${movieDetails.release_date}</p>
            <p><strong>Réalisateur :</strong> ${directors}</p>
            <p><strong>Acteurs :</strong> ${actors}</p>
            <p><strong>Genres :</strong> ${genres}</p>
            <p><strong>Pays d'origine :</strong> ${productionCountries}</p>
        `;
    } else {
        movieDetailsContainer.innerHTML = "<p>Les détails de ce film ne sont pas disponibles pour le moment.</p>";
    }
}

// Charger les détails du film lors du chargement initial de la page
displayMovieDetails();