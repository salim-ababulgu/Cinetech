// Récupérer le numéro de la page actuelle
const currentPageNumber = window.location.pathname.match(/\d+/)[0];

// Charger le Navbar sur toutes les pages sauf la page 1
if (currentPageNumber !== "1") {
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            // Insérer le contenu du Navbar dans la balise <div id="navbar">
            document.getElementById('navbar').innerHTML = data;
        })
        .catch(error => console.error('Une erreur s\'est produite :', error));
}
