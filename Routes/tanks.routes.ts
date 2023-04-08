import express from "express";
import controller from "../Controllers/Tanks.controller";

const router = express();

router.post("/tanks", controller.addAllTanks);

module.exports = router;
