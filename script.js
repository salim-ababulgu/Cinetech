const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMWNmODYyODdiMTY1YjM5NDM2ZWZjYTU0OTgxMWZlZiIsInN1YiI6IjY2MjYyZDNiYjI2ODFmMDFhOTc0YmE4MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.H0aSH9tT7Je3Lu3VawcUPx7v8vnShlKfqIgNFL_WnfI'
    }
};

let currentPageMovies = 1;
let currentPageSeries = 1;

// Fonction pour récupérer les données des films populaires depuis l'API
async function fetchPopularMovies(page) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/popular?language=fr&page=${page}`, options);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des données des films :', error);
    }
}

// Fonction pour récupérer les données des séries populaires depuis l'API
async function fetchPopularSeries(page) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/tv/popular?language=fr&page=${page}`, options);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des données des séries :', error);
    }
}



async function displayPopularMedia(mediaType, page) {
    const mediaList = document.getElementById(`${mediaType}-list`);
    mediaList.innerHTML = ''; // Effacer les médias précédents

    try {
        let responseData;
        if (mediaType === 'movies') {
            responseData = await fetchPopularMovies(page);
        } else if (mediaType === 'series') {
            responseData = await fetchPopularSeries(page);
        }

        const mediaData = responseData.results.slice(0, 4); // Sélectionnez uniquement les 4 premiers médias

        // Ajouter les médias aux cartes existantes
        mediaData.forEach((media, index) => {
            const card = document.createElement('div');
            card.classList.add('col');
            card.innerHTML = `
                <div class="card h-100 bg-dark text-light">
                    <img src="https://image.tmdb.org/t/p/w500${media.poster_path}" class="card-img" alt="${mediaType === 'movies' ? media.title : media.name}">
                    <div class="card-body">
                        <h5 class="card-title">${mediaType === 'movies' ? media.title : media.name}</h5>
                        <p class="card-text">${media.overview}</p>
                    </div>
                    <div class="border-light border-top">
                        <a href="#" class="card-footer btn btn-dark w-100">Découvrir</a>
                    </div>
                </div>
            `;
            mediaList.appendChild(card);
        });
    } catch (error) {
        console.error(`Erreur lors de la récupération et de l'affichage des médias ${mediaType === 'movies' ? 'de film' : 'de série'} :`, error);
    }
}



// Fonction pour afficher une donnée de film ou de série aléatoire
async function displayRandomMedia() {
    // Choix aléatoire entre film et série
    const isMovie = Math.random() < 0.5;

    try {
        let randomMedia;
        if (isMovie) {
            const moviesData = await fetchPopularMovies(1);
            const movies = moviesData.results;
            randomMedia = movies[Math.floor(Math.random() * movies.length)];
        } else {
            const seriesData = await fetchPopularSeries(1);
            const series = seriesData.results;
            randomMedia = series[Math.floor(Math.random() * series.length)];
        }

        // Créer le contenu pour le bloc 1 avec l'image
        const blocUnContent = `
            <div class="col-md-5 w-50 bloc_un flex-grow-1 d-flex align-items-center">
                <img src="https://image.tmdb.org/t/p/w500${randomMedia.poster_path}" class="card-img-landing" alt="${isMovie ? randomMedia.title : randomMedia.name}">
            </div>
        `;

        // Créer le contenu pour le bloc 2 avec le texte
        const blocDeuxContent = `
            <div class="col-md-5 text-light w-50 border-none bloc_deux flex-grow-1 d-flex justify-content-center flex-column p-5">
                <h5 class="card-title text">${isMovie ? randomMedia.title : randomMedia.name}</h5> 
                <p class="card-text">${randomMedia.overview}</p>
                <p class="card-text"><small>Last updated 3 mins ago</small></p>
            </div>
        `;

        // Ajouter le contenu à la ligne principale
        const randomMediaList = document.querySelector('.row');
        randomMediaList.innerHTML = blocUnContent + blocDeuxContent;
    } catch (error) {
        console.error('Erreur lors de la récupération et de l\'affichage du média aléatoire :', error);
    }
}

// Appeler la fonction pour afficher une donnée de film ou de série aléatoire
displayRandomMedia();





// Fonction pour afficher les films ou les séries les plus populaires

// Fonction pour afficher quatre médias populaires (deux films et deux séries) de manière aléatoire
async function displayRandomPopularMedia() {
    const { movies, series } = await fetchPopularMedia();

    // Mélanger les films et les séries ensemble
    const allMedia = [...movies, ...series];
    allMedia.sort(() => Math.random() - 0.5);

    // Sélectionner les deux premiers films et les deux premières séries
    const selectedMedia = allMedia.slice(0, 4);

    // Afficher les médias sélectionnés
    const mediaList = document.getElementById('popular-media-list');
    mediaList.innerHTML = ''; // Effacer le contenu précédent

    selectedMedia.forEach((media, index) => {
        const card = document.createElement('div');
        card.classList.add('col');
        card.innerHTML = `
            <div class="card h-100 bg-dark text-light">
                <img src="https://image.tmdb.org/t/p/w500${media.poster_path}" class="card-img" alt="${media.title || media.name}">
                <div class="card-body">
                    <h5 class="card-title">${media.title || media.name}</h5>
                    <p class="card-text">${media.overview}</p>
                </div>
                <div class="border-light border-top">
                    <a href="#" class="card-footer btn btn-dark w-100">Découvrire</a>
                </div>
            </div>
        `;
        mediaList.appendChild(card);
    });
}

// Appeler la fonction pour afficher les médias populaires
displayRandomPopularMedia();





// Fonction pour afficher les films sur la page
async function displayMovies(page) {
    const moviesList = document.getElementById('movies-list');
    moviesList.innerHTML = ''; // Effacer les films précédents

    const moviesData = await fetchPopularMovies(page);
    const movies = moviesData.results.slice(0, 4); // Sélectionnez uniquement les 4 premiers films
    console.log(movies);

    // Ajouter les films aux cartes existantes
    movies.forEach((movie, index) => {
        const card = document.createElement('div');
        card.classList.add('col');
        card.innerHTML = `
            <div class="card h-100 bg-dark text-light">
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img" alt="${movie.title}">
                <div class="card-body">
                    <h5 class="card-title">${movie.title}</h5>
                    <p class="card-text">${movie.overview}</p>
                </div>
                <div class="border-light border-top">
                    <a href="#" class="card-footer btn btn-dark w-100">Découvrire</a>
                </div>
            </div>
        `;
        moviesList.appendChild(card);
    });
}



// Fonction pour afficher les séries sur la page
async function displaySeries(page) {
    const seriesList = document.getElementById('series-list');
    seriesList.innerHTML = ''; // Effacer les séries précédentes

    const seriesData = await fetchPopularSeries(page);
    const series = seriesData.results.slice(0, 4); // Sélectionnez uniquement les 4 premières séries

    // Ajouter les séries aux cartes existantes
    series.forEach((serie, index) => {
        const card = document.createElement('div');
        card.classList.add('col');
        card.innerHTML = `
            <div class="card h-100 bg-dark text-light">
                <img src="https://image.tmdb.org/t/p/w500${serie.poster_path}" class="card-img" alt="${serie.name}">
                <div class="card-body">
                    <h5 class="card-title">${serie.name}</h5>
                    <p class="card-text">${serie.overview}</p>
                </div>
                <div class="border-light border-top">
                    <a href="#" class="card-footer btn btn-dark w-100">Découvrire</a>
                </div>
            </div>
        `;
        seriesList.appendChild(card);
    });
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


// Fonction pour effectuer une recherche en temps réel à chaque frappe de clavier un film ou séries
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
                        <div class="text-light">${result.title}</div>
                    `;
                    button.addEventListener('click', () => {
                        // Action à effectuer lorsque l'utilisateur clique sur le bouton
                        // Par exemple : rediriger vers la page du film ou de la série
                    });
                    searchResultsContainer.appendChild(button);
                } else if (!result.backdrop_path && result.title) {
                    const button = document.createElement('button');
                    button.classList.add('btn', 'd-flex', 'align-items-center', 'justify-content-between', 'flex-row-reverse', 'w-100', 'border-bottom', 'text-light', 'm-1');
                    button.innerHTML = `
                        <div class="text-light">${result.title}</div>
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

// Charger les films et les séries de la première page lors du chargement initial
displayMovies(currentPageMovies);
displaySeries(currentPageSeries);

// Appeler la fonction pour afficher une donnée de film ou de série aléatoire
displayRandomMedia();