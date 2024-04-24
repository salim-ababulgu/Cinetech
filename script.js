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

// Fonction pour afficher les films sur la page
async function displayMovies(page) {
    const moviesList = document.getElementById('movies-list');
    moviesList.innerHTML = ''; // Clear previous movies

    const moviesData = await fetchPopularMovies(page);
    const movies = moviesData.results;

    // Ajouter les films aux cartes existantes
    movies.forEach((movie, index) => {
        const cardHTML = `
            <section class="container bg-dark">
                <div class="row">
                    <div class="md-lg-12">
                        <div class="card d-flex" style="width: 18rem;">
                            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.title}">
                            <div class="card-body">
                                <h5 class="card-title">${movie.title}</h5>
                                <p class="card-text">${movie.overview}</p>
                            </div>
                            <div class="card-footer">
                                <a href="#" class="btn btn-primary">Go somewhere</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;

        // Créer un élément div pour la carte et lui assigner le HTML de la carte
        const card = document.createElement('div');
        card.innerHTML = cardHTML;

        // Ajouter la carte à la liste des films
        moviesList.appendChild(card.firstChild);
    });
}


// Fonction pour afficher les séries sur la page
async function displaySeries(page) {
    const seriesList = document.getElementById('series-list');
    seriesList.innerHTML = ''; // Clear previous series

    const seriesData = await fetchPopularSeries(page);
    const series = seriesData.results;

    // Ajouter les séries aux cartes existantes
    series.forEach((serie, index) => {
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
            <section class="container">
                <div class="row">
                    <div class="md-lg-12">
                        <div class="card d-flex" style="width: 18rem;">
                            <img src="https://image.tmdb.org/t/p/w500${serie.poster_path}" class="card-img-top" alt="${serie.name}">
                            <div class="card-body">
                                <h5 class="card-title">${serie.name}</h5>
                                <p class="card-text">${serie.overview}</p>
                            </div>
                            <div class="card-footer">
                                <a href="#" class="btn btn-primary">Go somewhere</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;

        seriesList.appendChild(card);
    });
}

// Charger les films et les séries de la première page lors du chargement initial
displayMovies(currentPageMovies);
displaySeries(currentPageSeries);
