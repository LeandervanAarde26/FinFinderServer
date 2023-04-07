import express, { Express, Request, Response } from 'express';
import controller from '../Controllers/Builds.controller';

const router = express();

router.get('/builds', controller.addBuild);
router.post('/builds', controller.addAllBuilds)

module.exports = router;

