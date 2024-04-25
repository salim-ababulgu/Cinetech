// Récupère le conteneur du footer
const footerContainer = document.getElementById('chargementDuFooter');

// Charge le contenu du footer depuis un fichier footer.html (si vous en avez un)
fetch('footer.html')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.text();
  })
  .then(data => {
    // Insère le contenu dans le conteneur du footer
    footerContainer.innerHTML = data;
  })
  .catch(error => {
    console.error('Une erreur s\'est produite lors du chargement du footer :', error);
  });
