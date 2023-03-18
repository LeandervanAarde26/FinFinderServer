import express, { Express, Request, Response } from 'express';
import { FishModel } from '../models/fish.model';
import mongoose from 'mongoose';
import controller from '../Controllers/fish.controller';

const router = express();

router.get('/fish', controller.getAllFish);
router.get('/fish/:id', controller.getById);

module.exports = router;