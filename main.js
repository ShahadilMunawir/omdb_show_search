require("dotenv").config();
const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require("path");
const axios = require("axios");

const omdbApiKey = process.env.OMDB_API_KEY;

function createWindow() {
    let mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    Menu.setApplicationMenu(null);
    mainWindow.loadFile(path.join(__dirname, "renderer", "index.html"));

    ipcMain.on("movie-title", (event, movieTitle) => {
        axios.get(`http://www.omdbapi.com/?apikey=${omdbApiKey}&t=${movieTitle}`)
            .then(response => {
                let title = response.data["Title"];
                let year = response.data["Year"];
                let rating = response.data["Rated"];
                let genre = response.data["Genre"];
                let imdbRating = response.data["imdbRating"];
                let imageUrl = response.data["Poster"];

                if (!title) {
                    mainWindow.webContents.send("notFoundMessage", "No such movie or TV show found");
                } else {
                    mainWindow.webContents.send("movieData", title, year, rating, genre, imdbRating, imageUrl);
                };
            }
        );
    });

    mainWindow.on("close", () => {
        mainWindow = null;
    });
};

app.on("ready", createWindow);