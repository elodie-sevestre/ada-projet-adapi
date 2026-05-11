import express from "express";
import pool from "./db.js"; // connexion PostgreSQL

const app = express();

app.use(express.json()); // middleware indispensable à POST

app.get("/", async (req, res) => res.send("Hello Ada!\n"));

app.get("/resources", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM resources"); // on aurait pu écrire const results = ...
  res.json(rows); // et ici res.json(results.rows)
});

// GET /skills - création route GET pour récupérer les skills
app.get("/skills", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM skills ORDER BY id");
  res.json(rows);
});

// GET /skills/:id - création route GET pour récupérer une skills par son id
app.get("/skills/:id", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM skills WHERE id = $1 ", [
    req.params.id,
  ]);
  res.json(rows[0]);
});

// POST /skills - création route POST pour insérer une nouvelle skills
app.post("/skills", async (req, res) => {
  const insertNewSkill = await pool.query(
    "INSERT INTO skills (name) VALUES ($1) RETURNING *",
    [req.body.name],
  );
  // console.log(req.body);
  res.json(insertNewSkill.rows[0]);
});

// PUT /skills - création route PUT pour remplacer le nom d'une skills par son id
app.put("/skills/:id", async (req, res) => {
  const replaceNameSkills = await pool.query(
    "UPDATE skills SET name = $1 WHERE id = $2 RETURNING *",
    [req.body.name, req.params.id],
  );
  res.json(replaceNameSkills.rows[0]);
});

// DELETE - création route DELETE pour supprimer une skills par son id
app.delete("/skills/:id", async (req, res) => {
  const deleteSkills = await pool.query(
    " DELETE FROM skills WHERE id=$1 RETURNING *",
    [req.params.id],
  );
  res.json(deleteSkills.rows[0]);
});
//! ici ça ne fonctionne pas car l'id de skills est une clé étrangère rattach

// Serveur express écoute port 3000, affiche "" et se connecte à la BDD

app.listen(3000, () => {
  console.log("🚀 Serveur lancé : http://localhost:3000");
});
