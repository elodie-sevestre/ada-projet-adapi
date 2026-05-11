# Routes Express avec PostgreSQL

## 1. Qu'est-ce qu'Express ?

Express est un **framework Node.js** qui permet de créer un serveur HTTP facilement. Il fait le lien entre le client (navigateur, curl, frontend) et la base de données.

```
Client (navigateur / curl)
        ↓  requête HTTP
    Express (serveur)
        ↓  requête SQL
    PostgreSQL (base de données)
        ↓  résultat
    Express
        ↓  réponse JSON
Client
```

Express reçoit une requête HTTP, l'analyse (méthode + URL), exécute la route correspondante, interroge la BDD via `pool.query()`, et renvoie la réponse au client en JSON.

### Les éléments clés d'un serveur Express

```javascript
import express from "express";
const app = express();          // crée l'application Express

app.use(express.json());        // middleware : parse le body JSON

app.get("/skills", ...);        // définition des routes

app.listen(3000, () => { ... }) // démarre le serveur sur le port 3000
```

---

## 2. La connexion à la BDD — `db.js`

`db.js` est un fichier séparé qui gère uniquement la connexion à PostgreSQL. Il exporte un `pool` utilisé dans toutes les routes via `pool.query()`.

```javascript
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config(); // charge les variables du fichier .env

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: "localhost",
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

pool
  .connect()
  .then(() => console.log("✅ Connected to the database"))
  .catch((err) => console.log("❌ Error connecting to the database", err));

export default pool;
```

### Décorticage

- **`dotenv`** — module qui lit le fichier `.env` et injecte les variables dans `process.env`
- **`Pool`** — classe de `pg` qui gère un ensemble de connexions réutilisables à PostgreSQL
- **`new Pool({...})`** — crée le pool avec les identifiants de connexion
- **`process.env.POSTGRES_USER`** — lit la variable `POSTGRES_USER` définie dans `.env`
- **`pool.connect()`** — teste la connexion au démarrage et affiche un message selon le résultat
- **`export default pool`** — exporte le pool pour l'utiliser dans `server.js` via `import pool from "./db.js"`

### Le fichier `.env`

Les identifiants de connexion ne doivent jamais être écrits en dur dans le code — ils sont stockés dans un fichier `.env` ignoré par Git.

```dotenv
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin
POSTGRES_DB=adatabase
POSTGRES_PORT=5432
```

⚠️ Toujours ajouter `.env` dans `.gitignore`. Créer un `.env.example` avec les clés mais sans les valeurs pour documenter les variables nécessaires.

---

## 3. Le CRUD

Le **CRUD** regroupe les 4 opérations fondamentales sur une base de données :

| CRUD       | Signification | Méthode HTTP    | SQL           |
| ---------- | ------------- | --------------- | ------------- |
| **C**reate | Créer         | `POST`          | `INSERT INTO` |
| **R**ead   | Lire          | `GET`           | `SELECT`      |
| **U**pdate | Modifier      | `PUT` / `PATCH` | `UPDATE`      |
| **D**elete | Supprimer     | `DELETE`        | `DELETE FROM` |

> Toute API REST est construite autour de ces 4 opérations.

---

## 4. Différences entre les méthodes HTTP

| Méthode  | Action                               | SQL           |
| -------- | ------------------------------------ | ------------- |
| `GET`    | Lire des données                     | `SELECT`      |
| `POST`   | Créer une ressource                  | `INSERT INTO` |
| `PUT`    | Remplacer une ressource entière      | `UPDATE`      |
| `PATCH`  | Modifier partiellement une ressource | `UPDATE`      |
| `DELETE` | Supprimer une ressource              | `DELETE FROM` |

> `POST`, `PUT`, `PATCH` envoient des données dans le **body** — `GET` et `DELETE` passent par l'**URL**.

---

## 5. Le middleware `app.use(express.json())`

Par défaut, Express ne sait pas lire le contenu d'une requête POST. Il reçoit les données brutes mais ne les décode pas automatiquement.

`app.use(express.json())` est un middleware — une fonction qui s'exécute avant tes routes et qui dit à Express : _"si la requête contient du JSON, parse-le et mets le résultat dans `req.body`"_.

Sans lui :

```js
req.body; // undefined
req.body.name; // TypeError 💥
```

Avec lui :

```js
req.body; // { name: "C#" }
req.body.name; // "C#" ✅
```

⚠️ Doit être placé **avant** toutes les routes. Inutile pour `GET` et `DELETE` car ils n'ont pas de body.

- **`app.use()`** — enregistre un middleware qui s'exécute à chaque requête
- **`express.json()`** — lit le body, détecte le JSON, le convertit en objet JavaScript dans `req.body`

---

## 6. Les routes `/skills`

### GET — récupérer toutes les skills

```javascript
app.get("/skills", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM skills ORDER BY id");
  res.json(rows);
});
```

```bash
curl http://localhost:3000/skills
```

---

### GET — récupérer une skill par son id

```javascript
app.get("/skills/:id", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM skills WHERE id = $1", [
    req.params.id,
  ]);
  res.json(rows[0]);
});
```

```bash
curl http://localhost:3000/skills/1
```

---

### POST — insérer une nouvelle skill

```javascript
app.post("/skills", async (req, res) => {
  const insertNewSkill = await pool.query(
    "INSERT INTO skills (name) VALUES ($1) RETURNING *",
    [req.body.name],
  );
  res.json(insertNewSkill.rows[0]);
});
```

```bash
curl -X POST http://localhost:3000/skills \
  -H "Content-Type: application/json" \
  -d '{"name": "C#"}'
```

---

### PUT — remplacer le nom d'une skill par son id

```javascript
app.put("/skills/:id", async (req, res) => {
  const replaceNameSkills = await pool.query(
    "UPDATE skills SET name = $1 WHERE id = $2 RETURNING *",
    [req.body.name, req.params.id],
  );
  res.json(replaceNameSkills.rows[0]);
});
```

```bash
curl -X PUT http://localhost:3000/skills/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "TypeScript"}'
```

---

### DELETE — supprimer une skill par son id

```javascript
app.delete("/skills/:id", async (req, res) => {
  const deleteSkills = await pool.query(
    "DELETE FROM skills WHERE id=$1 RETURNING *",
    [req.params.id],
  );
  res.json(deleteSkills.rows[0]);
});
```

```bash
curl -X DELETE http://localhost:3000/skills/1
```

⚠️ Si la skill est référencée dans une table liée (ex: `resources_skills`), PostgreSQL bloque la suppression avec une erreur de clé étrangère. Solution : ajouter `ON DELETE CASCADE` sur la contrainte dans la migration.

---

## 7. Points clés à retenir

- **`$1`, `$2`...** — paramètres positionnels PostgreSQL, toujours passés dans un tableau `[valeur1, valeur2]`
- **`RETURNING *`** — indispensable après `INSERT`, `UPDATE`, `DELETE` pour récupérer la ligne dans `rows`
- **`rows[0]`** — à utiliser quand on attend une seule ligne en retour
- **`rows`** — tableau, à utiliser quand on attend plusieurs lignes
- **`req.params.id`** — valeur du segment dynamique `:id` dans l'URL
- **`req.body.name`** — valeur envoyée dans le body de la requête

---

## 8. Tester avec curl

Le serveur doit rester lancé. Ouvrir un **second terminal** pour lancer les commandes curl.

- **`curl`** — outil en ligne de commande pour envoyer des requêtes HTTP
- **`-X`** — spécifie la méthode HTTP (`POST`, `PUT`, `DELETE` — omis pour `GET`)
- **`-H "Content-Type: application/json"`** — indique au serveur que le body est du JSON
- **`-d '{...}'`** — le body de la requête
- **`\`** — permet de continuer la commande sur la ligne suivante pour la lisibilité
