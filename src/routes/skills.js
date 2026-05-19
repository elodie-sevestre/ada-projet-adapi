// ==================== Table : skills ====================

import express from "express";
import pool from "./../db.js"; // connexion PostgreSQL

export const skillsRouter = express.Router();

// GET - création route GET pour récupérer les skills
skillsRouter.get("/", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM skills ORDER BY id");
  res.json(rows);
});

// GET /:id - création route GET pour récupérer une skills par son id
skillsRouter.get("/:id", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM skills WHERE id = $1 ", [
    req.params.id,
  ]);
  res.json(rows[0]);
});

// GET skills/:id/resources - route pour lier skills à resources via l'id

skillsRouter.get("/:id/resources", async (req, res) => {
  const { rows } = await pool.query(
    " SELECT * FROM resources JOIN resources_skills ON resources.id=resources_skills.resource_id WHERE skill_id=$1",
    [req.params.id],
  );
  res.json(rows);
});

// POST - création route POST pour insérer une nouvelle skills
skillsRouter.post("/", async (req, res) => {
  const insertNewSkills = await pool.query(
    "INSERT INTO skills (name) VALUES ($1) RETURNING *",
    [req.body.name],
  );
  res.json(insertNewSkills.rows[0]);
});

// PUT - création route PUT pour remplacer le nom d'une skills par son id
skillsRouter.put("/:id", async (req, res) => {
  const replaceSkillsName = await pool.query(
    "UPDATE skills SET name = $1 WHERE id = $2 RETURNING *",
    [req.body.name, req.params.id],
  );
  res.json(replaceSkillsName.rows[0]);
});

// DELETE - création route DELETE pour supprimer une skills par son id
skillsRouter.delete("/:id", async (req, res) => {
  const deleteSkills = await pool.query(
    " DELETE FROM skills WHERE id=$1 RETURNING *",
    [req.params.id],
  );
  res.json(deleteSkills.rows[0]);
});

//! adatabase : table ressources_skills : skill_id est déclaré en foreign key, pour supprimer une skills par son id on delete skills_id dans la table de liaison resources_skills soit on ajoute ON DELETE CASCADE dans le type de donnée de skills_id
