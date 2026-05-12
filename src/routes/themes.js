// ==================== Table : themes ====================

import express from "express";
import pool from "../db.js"; // connexion PostgreSQL

export const themesRouter = express.Router();

// GET / - création route GET pour récupérer les themes
themesRouter.get("/", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM themes ORDER BY id"); // on aurait pu écrire const results = ...
  res.json(rows); // et ici res.json(results.rows)
});

// GET /:id - création route GET pour récupérer une themes par son id
themesRouter.get("/:id", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM themes WHERE id = $1 ", [
    req.params.id,
  ]);
  res.json(rows[0]);
});

// POST - création route POST pour insérer une nouvelle themes
themesRouter.post("/", async (req, res) => {
  const insertNewThemes = await pool.query(
    "INSERT INTO themes (name) VALUES ($1) RETURNING *",
    [req.body.name],
  );
  res.json(insertNewThemes.rows[0]);
});

// PUT - création route PUT pour remplacer le nom d'une themes par son id
themesRouter.put("/:id", async (req, res) => {
  const replaceThemesName = await pool.query(
    "UPDATE themes SET name = $1 WHERE id = $2 RETURNING *",
    [req.body.name, req.params.id],
  );
  res.json(replaceThemesName.rows[0]);
});

// DELETE - création route DELETE pour supprimer une themes par son id
themesRouter.delete("/:id", async (req, res) => {
  const deleteThemes = await pool.query(
    " DELETE FROM themes WHERE id=$1 RETURNING *",
    [req.params.id],
  );
  res.json(deleteThemes.rows[0]);
});
