import express, { Express, query, Request, Response } from 'express';
import { TankModel } from '../models/tanks.model';

async function addAllTanks(req: Request, res: Response) {
    try {
        const tank = req.body;

        if(!tank){
            return res.status(204).json({msg: `no content inserted`})
        }

        console.log(tank)
        const insertedTanks = await TankModel.insertMany(tank);

        if (!insertedTanks) {
            return res.status(404).json({msg: 'tanks could not be inserted, please try again later.'})
        }
    
        return res.status(200).json(insertedTanks)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error })
    }
}

export default {addAllTanks};