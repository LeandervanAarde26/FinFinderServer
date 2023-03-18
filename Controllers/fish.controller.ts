import { FishModel } from '../models/fish.model';
import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';


async function getAllFish(req: Request, res: Response) {
    try {
        const fish = await FishModel.find();
        return res.status(200).json(fish ?? { error: 'Fault in route, please try again later' })
    } catch (error) {
        return res.status(500).json({ error: 'There was a server error' })
    }
};

async function getById(req: Request, res: Response) {
    const id = req.params.id
    try {
        const individualFish = await FishModel.findById(id).populate([
            {
                path: 'compatibility',
                populate: { path: 'name', select: 'name' },
                select: '-compatibility',
            },
            {
                path: 'notCompatible',
                populate: { path: 'name', select: 'name' },
                select: '-notCompatible',
            },

        ]
        );
        return res.status(200).json(individualFish ?? { error: `Fish with ID ${id} does not exist or cannot be found` });
    } catch (error) {
        return res.status(500).json({ error: 'There was a server error' });
    }
};








export default { getAllFish, getById }