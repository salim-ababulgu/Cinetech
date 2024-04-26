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

// Fonction pour gérer la saisie dans le champ de recherche
document.getElementById('myInput').addEventListener('input', async (event) => {
    const searchTerm = event.target.value.trim(); // Récupérer le terme de recherche

    if (searchTerm) { // Vérifier si le champ de recherche n'est pas vide
        const searchData = await searchMoviesAndSeries(searchTerm);

        // Afficher les résultats dans le conteneur prévu
        const searchResultsContainer = document.getElementById('searchResults');
        searchResultsContainer.innerHTML = ''; // Effacer le contenu précédent

        // Afficher les résultats de la recherche
        // (Assure-toi que le HTML des résultats est correctement formaté)
        // ...
    } else {
        const searchResultsContainer = document.getElementById('searchResults');
        searchResultsContainer.innerHTML = ''; // Effacer le contenu si le champ de recherche est vide
    }
});

