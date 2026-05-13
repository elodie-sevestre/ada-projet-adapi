// Router : pour organiser les routes
// Pour éviter que app.js devienne trop gros, on utilise express.Router().

import express from "express";
import { skillsRouter } from "./routes/skills.js";
import { resourcesSkillsRouter } from "./routes/resources_skills.js";
import { themesRouter } from "./routes/themes.js";
import { resourcesRouter } from "./routes/resources.js";

export const router = express.Router();

router.use("/skills", skillsRouter);
router.use("/resources_skills", resourcesSkillsRouter);
router.use("/themes", themesRouter);
router.use("/resources", resourcesRouter);

// export default router;  on peut mettre ceci si on ne met pas le "export" devant

// module.exports = router; autre syntaxe pour export const router = express.Router();
// il se place à la fin pour ne pas brouiller la vue
