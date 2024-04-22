// Récupérer le chemin de la page actuelle
const currentPagePath = window.location.pathname;

// Charger le Navbar sur toutes les pages sauf index.html
if (currentPagePath !== "/navbar.html") {
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            // Insérer le contenu du Navbar dans la balise <div id="navbar">
            document.getElementById('navbar').innerHTML = data;
        })
        .catch(error => console.error('Une erreur s\'est produite :', error));
}
