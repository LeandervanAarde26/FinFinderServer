import express from "express";
import controller from "../Controllers/Utilities.controller";

const router = express();

router.post("/utility", controller.addUtility);
router.get("/utility", controller.getUtilities);
router.get("/utility/:id", controller.getById);

module.exports = router;
