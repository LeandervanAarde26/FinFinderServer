import express, { Express, Request, Response } from "express";
import controller from "../Controllers/Decorations.controller";

const router = express();

router.post("/decoration", controller.addDecoration);
router.get("/decoration", controller.getDecorations);
router.get("/decoration/:id", controller.getById);

module.exports = router;
