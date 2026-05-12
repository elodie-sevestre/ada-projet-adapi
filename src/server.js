import express from "express";
import pool from "./db.js"; // connexion PostgreSQL

const app = express();

app.use(express.json()); // middleware indispensable à POST

app.get("/", async (req, res) => res.send("Hello Ada!\n"));

// ==================== Table : skills ====================

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
  const insertNewSkills = await pool.query(
    "INSERT INTO skills (name) VALUES ($1) RETURNING *",
    [req.body.name],
  );
  res.json(insertNewSkills.rows[0]);
});

// PUT /skills - création route PUT pour remplacer le nom d'une skills par son id
app.put("/skills/:id", async (req, res) => {
  const replaceSkillsName = await pool.query(
    "UPDATE skills SET name = $1 WHERE id = $2 RETURNING *",
    [req.body.name, req.params.id],
  );
  res.json(replaceSkillsName.rows[0]);
});

// DELETE - création route DELETE pour supprimer une skills par son id
app.delete("/skills/:id", async (req, res) => {
  const deleteSkills = await pool.query(
    " DELETE FROM skills WHERE id=$1 RETURNING *",
    [req.params.id],
  );
  res.json(deleteSkills.rows[0]);
});
//! adatabase : table ressources_skills : skill_id est déclaré en foreign key, pour supprimer une skills par son id on delete skills_id dans la table de liaison resources_skills soit on ajoute ON DELETE CASCADE dans le type de donnée de skills_id

// ==================== Table : themes ====================

// GET /themes - création route GET pour récupérer les themes
app.get("/themes", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM themes ORDER BY id"); // on aurait pu écrire const results = ...
  res.json(rows); // et ici res.json(results.rows)
});

// GET /themes/:id - création route GET pour récupérer une themes par son id
app.get("/themes/:id", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM themes WHERE id = $1 ", [
    req.params.id,
  ]);
  res.json(rows[0]);
});

// POST /themes - création route POST pour insérer une nouvelle themes
app.post("/themes", async (req, res) => {
  const insertNewThemes = await pool.query(
    "INSERT INTO themes (name) VALUES ($1) RETURNING *",
    [req.body.name],
  );
  res.json(insertNewThemes.rows[0]);
});

// PUT /themes - création route PUT pour remplacer le nom d'une themes par son id
app.put("/themes/:id", async (req, res) => {
  const replaceThemesName = await pool.query(
    "UPDATE themes SET name = $1 WHERE id = $2 RETURNING *",
    [req.body.name, req.params.id],
  );
  res.json(replaceThemesName.rows[0]);
});

// DELETE - création route DELETE pour supprimer une themes par son id
app.delete("/themes/:id", async (req, res) => {
  const deleteThemes = await pool.query(
    " DELETE FROM themes WHERE id=$1 RETURNING *",
    [req.params.id],
  );
  res.json(deleteThemes.rows[0]);
});

// ==================== Table : resources ====================

// GET /themes - création route GET pour récupérer les themes
app.get("/themes", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM themes ORDER BY id"); // on aurait pu écrire const results = ...
  res.json(rows); // et ici res.json(results.rows)
});

// GET /themes/:id - création route GET pour récupérer une themes par son id
app.get("/themes/:id", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM themes WHERE id = $1 ", [
    req.params.id,
  ]);
  res.json(rows[0]);
});

// POST /themes - création route POST pour insérer une nouvelle themes
app.post("/themes", async (req, res) => {
  const insertNewThemes = await pool.query(
    "INSERT INTO themes (name) VALUES ($1) RETURNING *",
    [req.body.name],
  );
  res.json(insertNewThemes.rows[0]);
});

// PUT /themes - création route PUT pour remplacer le nom d'une themes par son id
app.put("/themes/:id", async (req, res) => {
  const replaceThemesName = await pool.query(
    "UPDATE themes SET name = $1 WHERE id = $2 RETURNING *",
    [req.body.name, req.params.id],
  );
  res.json(replaceThemesName.rows[0]);
});

// DELETE - création route DELETE pour supprimer une themes par son id
app.delete("/themes/:id", async (req, res) => {
  const deleteThemes = await pool.query(
    " DELETE FROM themes WHERE id=$1 RETURNING *",
    [req.params.id],
  );
  res.json(deleteThemes.rows[0]);
});

// Serveur express écoute port 3000, affiche "" et se connecte à la BDD

app.listen(3000, () => {
  console.log("🚀 Serveur lancé : http://localhost:3000");
});
