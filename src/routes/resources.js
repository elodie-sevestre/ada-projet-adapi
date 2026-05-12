// ==================== Table : resources ====================

import express from "express";
import pool from "../db.js"; // connexion PostgreSQL

export const resourcesRouter = express.Router();

// GET - création route GET pour récupérer les resources
resourcesRouter.get("/", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM resources ORDER BY id");
  res.json(rows);
});

// GET /:id - création route GET pour récupérer une resources par son id
resourcesRouter.get("/:id", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM resources WHERE id = $1 ", [
    req.params.id,
  ]);
  res.json(rows[0]);
});

// POST - création route POST pour insérer une nouvelle resources
resourcesRouter.post("/", async (req, res) => {
  const insertNewResources = await pool.query(
    "INSERT INTO resources (name) VALUES ($1) RETURNING *",
    [req.body.name],
  );
  res.json(insertNewResources.rows[0]);
});

// PUT - création route PUT pour remplacer le titre d'une resources par son id
resourcesRouter.put("/:id", async (req, res) => {
  const replaceResourcesTitle = await pool.query(
    "UPDATE resources SET title = $1 WHERE id = $2 RETURNING *",
    [req.body.title, req.params.id],
  );
  res.json(replaceResourcesTitle.rows[0]);
});

// DELETE - création route DELETE pour supprimer une resources par son id
resourcesRouter.delete("/:id", async (req, res) => {
  const deleteResources = await pool.query(
    " DELETE FROM resources WHERE id=$1 RETURNING *",
    [req.params.id],
  );
  res.json(deleteResources.rows[0]);
});
