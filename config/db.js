const mysql = require("mysql2");


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "peliculas_db",
    port: 3307
});

db.connect(err => {
    if (err) {
        console.log("Error conexion BD", err);
    } else {
        console.log("Conectado a MySQL");
    }
});

module.exports = db;