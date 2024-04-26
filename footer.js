// Récupère le conteneur du Navbar
const navbarContainer = document.getElementById('mon_footer');

// Charge le contenu de navbar.html depuis la branche navbar
fetch('footer.html')
  .then(response => response.text())
  .then(data => {
    // Injecte le contenu dans le conteneur du Navbar
    navbarContainer.innerHTML = data;
  })
  .catch(error => console.error('Une erreur s\'est produite : ', error));