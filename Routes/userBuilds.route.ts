import express, { Express, Request, Response } from "express";
import controller from '../Controllers/UserBuilds';

const router = express();

router.get('/userBuilds/:id', controller.getAllUserBuilds);

module.exports = router;