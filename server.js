const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3001;

// Middleware pour parser le corps des requêtes
app.use(bodyParser.json());

// Fonction pour charger les données depuis le fichier JSON
function loadData() {
    const rawData = fs.readFileSync('data.json');
    return JSON.parse(rawData);
}

// Fonction pour enregistrer les données dans le fichier JSON
function saveData(data) {
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
}

// Route GET pour récupérer toutes les données
app.get('/all', (req, res) => {
    const data = loadData();
    res.json(data);
});

// Route POST pour ajouter de nouvelles données
app.post('/data', (req, res) => {
    const newData = req.body;
    const data = loadData();
    data.push(newData);
    saveData(data);
    res.status(201).json(newData);
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
