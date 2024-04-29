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
    const response = await fetch(`https://api.themoviedb.org/3/tv/${seriesId}?language=fr-FR`, options);
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
      const response = await fetch(`https://api.themoviedb.org/3/tv/${seriesId}/credits?language=fr-FR`, options);
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
      const response = await fetch(`https://api.themoviedb.org/3/tv/${seriesId}/similar?language=fr-FR&page=1`, options);
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
async function getExecutiveProducer(seriesId) {
    try {
      const seriesCredits = await fetchSeriesCredits(seriesId);
      if (seriesCredits && seriesCredits.crew && seriesCredits.crew.length > 0) {
        const executiveProducer = seriesCredits.crew.find(member => member.job === 'Executive Producer');
        if (executiveProducer) {
          return executiveProducer.name;
        } else {
          return "Information non disponible";
        }
      } else {
        return "Information non disponible";
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'Executive Producer :', error);
      return "Information non disponible";
    }
  }

  async function fetchSeriesReviews(seriesId) {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMWNmODYyODdiMTY1YjM5NDM2ZWZjYTU0OTgxMWZlZiIsInN1YiI6IjY2MjYyZDNiYjI2ODFmMDFhOTc0YmE4MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.H0aSH9tT7Je3Lu3VawcUPx7v8vnShlKfqIgNFL_WnfI'
      }
    };
  
    try {
      const response = await fetch(`https://api.themoviedb.org/3/tv/${seriesId}/reviews?language=en-US&page=1`, options);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des critiques de la série :', error);
      return null;
    }
  }
  
  // Fonction pour afficher les détails de la série, y compris l'Executive Producer et l'affiche de la série
  async function displaySeriesDetails() {
    const seriesDetailsContainer = document.getElementById('series-details');
  
    // Récupérer l'identifiant de la série depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const seriesId = urlParams.get('seriesId');
  
    // Récupérer les détails de la série
    const seriesDetails = await fetchSeriesDetails(seriesId);
    console.log('Series Details:', seriesDetails); // Vérifiez les détails de la série dans la console du navigateur
  
    // Afficher les détails de la série dans le conteneur
    if (seriesDetails) {
  
      // Récupérer les noms des acteurs avec une limite
      const actors = await getActorsNames(seriesId, displayedActors);
      console.log('Actors:', actors); // Vérifiez les acteurs dans la console du navigateur
  
      const genres = getSeriesGenres(seriesDetails);
      const productionCountries = getSeriesProductionCountries(seriesDetails);
  
      // Récupérer l'Executive Producer de la série
      const executiveProducer = await getExecutiveProducer(seriesId);
      console.log('Executive Producer:', executiveProducer); // Vérifiez l'Executive Producer dans la console du navigateur
  
      // Récupérer les séries similaires
      const similarSeries = await fetchSimilarSeries(seriesId, 10);
      console.log('Similar Series:', similarSeries); // Vérifiez les séries similaires dans la console du navigateur
  
      // Créer les cartes Bootstrap pour afficher les séries similaires
      const similarSeriesHTML = similarSeries.map(serie => `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-4"> <!-- Ajustement des classes pour rendre les cartes plus grandes -->
          <div class="card">
            <img class="similar-series-image img-fluid" src="${serie.posterPath ? serie.posterPath : 'https://via.placeholder.com/300x450'}" class="card-img-top" alt="Poster de la série ${serie.name}">
            <div class="card-body">
              <h5 class="card-title">${serie.name}</h5>
            </div>
          </div>
        </div>
      `).join('');
  
      // Récupérer les critiques de la série
      const seriesReviews = await fetchSeriesReviews(seriesId);
  
      // Affichage des détails de la série
      let detailsHTML = `
      <h2 class="animate__animated animate__fadeInDown">${seriesDetails.name}</h2>
      <div class="row">
        <div class="col-lg-6">
          <img src="https://image.tmdb.org/t/p/w500/${seriesDetails.poster_path}" alt="Poster de la série ${seriesDetails.name}" class="animate__animated animate__bounceIn">
        </div>
        <div class="col-lg-6">
          <p><strong>Description :</strong> ${seriesDetails.overview}</p>
          <p><strong>Date de première diffusion :</strong> ${seriesDetails.first_air_date}</p>
          <p><strong>Producteur :</strong> ${executiveProducer}</p>
          <p><strong>Acteurs :</strong> ${actors}</p>
          <p><strong>Genres :</strong> ${genres}</p>
          <p><strong>Pays d'origine :</strong> ${productionCountries}</p>
        </div>
      </div>
        <h3>Séries similaires :</h3>
        <div class="row flex-nowrap overflow-auto">
          ${similarSeriesHTML}
        </div>
      `;
  
    // Affichage des critiques de séries
let seriesReviewsHTML = '';
if (seriesReviews && seriesReviews.results && seriesReviews.results.length > 0) {
  seriesReviewsHTML = `
    <div class="row mt-4">
      <div class="col-12">
        <h3>Critiques :</h3>
        <ul class="list-group">
          ${seriesReviews.results.map(review => `
            <li class="list-group-item">
              <p><strong>Auteur:</strong> ${review.author}</p>
              <p><strong>Date de publication:</strong> ${new Date(review.created_at).toLocaleDateString()}</p>
              <p>${review.content}</p>
            </li>
          `).join('')}
        </ul>
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-12">
        <h4>Envoyer un commentaire :</h4>
        <input id="authorInput" type="text" class="form-control" placeholder="Votre nom">
        <textarea id="commentInput" class="form-control" placeholder="Votre commentaire"></textarea>
        <button onclick="addComment()" class="btn btn-primary mt-2">Envoyer</button>
      </div>
    </div>
  `;
} else {
  seriesReviewsHTML = `
    <p class='mt-4'>Aucune critique disponible pour cette série.</p>
    <div class="row mt-4">
      <div class="col-12">
        <h4>Envoyer un commentaire :</h4>
        <input id="authorInput" type="text" class="form-control" placeholder="Votre nom">
        <textarea id="commentInput" class="form-control" placeholder="Votre commentaire"></textarea>
        <button onclick="addComment()" class="btn btn-primary mt-2">Envoyer</button>
      </div>
    </div>
  `;
}

// Insérer les détails et les critiques dans le conteneur
seriesDetailsContainer.innerHTML = detailsHTML + seriesReviewsHTML;

// Fonction pour ajouter un commentaire
function addComment() {
  const commentInput = document.getElementById('commentInput');
  const authorInput = document.getElementById('authorInput'); // Nouvelle ligne pour récupérer l'auteur
  const comment = commentInput.value.trim();
  const author = authorInput.value.trim(); // Nouvelle ligne pour récupérer l'auteur

  if (comment !== '' && author !== '') {
    // Récupérer les commentaires existants depuis le stockage local
    const existingComments = JSON.parse(localStorage.getItem('seriesComments')) || [];

    // Ajouter le nouveau commentaire avec l'auteur et la date de publication
    const newComment = {
      author: author,
      content: comment,
      created_at: new Date().toISOString() // Utilisation de la date actuelle
    };
    existingComments.push(newComment);

    // Mettre à jour le stockage local avec la nouvelle liste de commentaires
    localStorage.setItem('seriesComments', JSON.stringify(existingComments));

    // Mettre à jour l'affichage des commentaires
    renderComments();

    // Effacer les champs de saisie
    commentInput.value = '';
    authorInput.value = '';
  }
}

// Fonction pour afficher les commentaires locaux
function renderComments() {
  const existingComments = JSON.parse(localStorage.getItem('seriesComments')) || [];
  const commentsContainer = document.getElementById('commentsContainer');

  if (existingComments.length > 0) {
    const commentsHTML = existingComments.map(comment => `
      <li class="list-group-item">
        <p><strong>Auteur:</strong> ${comment.author}</p>
        <p><strong>Date de publication:</strong> ${new Date(comment.created_at).toLocaleDateString()}</p>
        <p>${comment.content}</p>
      </li>
    `).join('');
    commentsContainer.innerHTML = `
      <h4>Vos commentaires :</h4>
      <ul class="list-group">${commentsHTML}</ul>
    `;
  } else {
    commentsContainer.innerHTML = "<p>Aucun commentaire disponible.</p>";
  }
}

// Appel initial pour afficher les commentaires existants
renderComments();

    }
  }
  
  
  // Charger les détails de la série lors du chargement initial de la page
  displaySeriesDetails();
  