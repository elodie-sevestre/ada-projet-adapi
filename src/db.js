// import des modules nécessaires

// initialisation dotenv pour lire fichier .env

import dotenv from "dotenv";
import { Pool } from "pg";

// création d'une instance d'express

dotenv.config();

// configuration connexion à la BDD avec les variables d'environnement

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: "localhost",
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

// tentative de connection à la BDD et affichage d'un message en fonction du résultat

pool
  .connect()
  .then(() => {
    console.log("✅ Connected to the database");
  })
  .catch((err) => {
    console.log("❌ Error connecting to the database", err);
  });

export default pool;

// ce fichier génère la connexion à la BDD via le pool de pg
