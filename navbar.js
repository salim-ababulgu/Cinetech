// Vérifie si le script est exécuté sur navbar.html
if (window.location.pathname !== '/navbar.html') {
  // Récupère le conteneur du Navbar
  const navbarContainer = document.getElementById('navbar');

  // Charge le contenu de navbar.html
  fetch('navbar.html')
    .then(response => response.text())
    .then(data => {
      // Injecte le contenu dans le conteneur du Navbar
      navbarContainer.innerHTML = data;
    })
    .catch(error => console.error('Une erreur s\'est produite : ', error));
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


document.getElementById('myInput').addEventListener('input', async (event) => {
  console.log('La fonction de recherche est appelée.'); // Vérifie si la fonction est appelée
  const searchTerm = event.target.value.trim(); // Récupérer le terme de recherche
  // Reste du code de la fonction de recherche...
});


const searchResultsContainer = document.getElementById('searchResults');
console.log('Conteneur de résultats de recherche :', searchResultsContainer); // Vérifie si le conteneur est récupéré


console.log('Données de recherche récupérées :', searchData); // Vérifie si les données de recherche sont récupérées

