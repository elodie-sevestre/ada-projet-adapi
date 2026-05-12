// ==================== Table : resources_skills ====================

import express from "express";
import pool from "../db.js"; // connexion PostgreSQL

export const resourcesSkillsRouter = express.Router();

//! resources_skills est une table de liaison. Elle lie les tables resources et skills grâce à leur id.

// GET /resources_skills - création route GET pour récupérer les resources_skills
resourcesSkillsRouter.get("/", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM resources_skills");
  res.json(rows);
});

// GET /resource/:resource_id - création route GET pour récupérer une resources_skills
// id = resource_id
resourcesSkillsRouter.get("/resource/:resource_id", async (req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM resources_skills WHERE resource_id = $1 ",
    [req.params.resource_id],
  );
  res.json(rows);
});

// GET /skill/:skill_id - création route GET pour récupérer une resources_skills
// id = skill_id
resourcesSkillsRouter.get("/skill/:skill_id", async (req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM resources_skills WHERE skill_id = $1 ",
    [req.params.skill_id],
  );
  res.json(rows);
});

// POST - création route POST pour insérer une nouvelle resources_skills
resourcesSkillsRouter.post("/", async (req, res) => {
  const insertNewResourcesSkills = await pool.query(
    "INSERT INTO resources_skills (resource_id, skill_id) VALUES ($1, $2) RETURNING *",
    [req.body.resource_id, req.body.skill_id],
  );
  res.json(insertNewResourcesSkills.rows[0]);
});

// PUT - création route PUT pour remplacer une resources dans un skills
resourcesSkillsRouter.put("/:skill_id", async (req, res) => {
  const replaceResourcesSkillsName = await pool.query(
    "UPDATE resources_skills SET resource_id = $1 WHERE skill_id = $2 RETURNING *",
    [req.body.resource_id, req.params.skill_id],
  );
  res.json(replaceResourcesSkillsName.rows[0]);
});

// DELETE - création route DELETE pour supprimer une resources d'un skills
resourcesSkillsRouter.delete("/:skill_id/:resource_id", async (req, res) => {
  const deleteResourcesSkills = await pool.query(
    " DELETE FROM resources_skills WHERE skill_id=$1 AND resource_id=$2 RETURNING *",
    [req.params.skill_id, req.params.resource_id],
  );
  res.json(deleteResourcesSkills.rows[0]);
});
