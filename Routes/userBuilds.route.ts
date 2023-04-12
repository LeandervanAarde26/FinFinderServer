import express, { Express, Request, Response } from "express";
import controller from '../Controllers/UserBuilds.controller';

const router = express();

router.get('/userBuilds/:id', controller.getAllUserBuilds);
router.get('/userBuild/:id', controller.viewUserBuild);
router.patch('/userBuild/:id', controller.updateUserBuildMaterial);

module.exports = router;