import express, { Express, Request, Response } from "express";
import controller from "../Controllers/Builds.controller";

const router = express();

router.get("/builds/:id", controller.getallBuilds);
router.post("/builds", controller.addAllBuilds);
router.patch("/builds/craft/:id", controller.craftBuild);

module.exports = router;