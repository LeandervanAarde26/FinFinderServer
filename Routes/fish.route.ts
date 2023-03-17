import express, {Express, Request, Response} from 'express';
import { FishModel } from '../models/fish.model';
import mongoose from 'mongoose';

const router = express();


router.get('/allFish', async (req: Request, res: Response) =>{
    const fish = await FishModel.find()

    return res.send(fish)
});


module.exports = router;