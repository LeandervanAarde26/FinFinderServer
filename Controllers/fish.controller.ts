import { FishModel } from '../models/fish.model';
import express, { Express, query, Request, Response } from 'express';
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
        console.log(error)
        return res.status(500).json({ error: 'There was a server error' });
    }
};


async function getCompat(req: Request, res: Response) {
    try {
        let id = req.params.id
        let compat: string[] = [
            "Cory Cats",
            "Danios",
            "Gourami",
            "Guppy",
            "Loaches",
            "Molly",
            "Plecostomus",
            "Rainbow Fish",
            "Rasbora",
            "Red Tail Shark",
            "Neon Tetra",
            "Ghost Knife",
            "Silver Dollar",
            "Angel Fish",
            "Barbs",
        ]

        let noncompat: string[] = [
            "Beta Fish",
            "Cichlid",
            "Discus",
            "Gold Fish",
            "Koi",
            "Oscars",
            "Shrimp",
        ]
    
        // let noncompat = [
        //     "Beta Fish",
        //     "Cory Cats",
        //     "Danios",
        //     "Discus",
        //     "Gold Fish",
        //     "Gourami",
        //     "Guppy",
        //     "Koi",
        //     "Loaches",
        //     "Molly",
        //     "Oscars",
        //     "Plecostomus",
        //     "Rainbow Fish",
        //     "Rasbora",
        //     "Red Tail Shark",
        //     "Neon Tetra",
        //     "Shrimp",
        //     "Ghost Knife",
        //     "Silver Dollar",
        //     "Angel Fish",
        //     "Barbs",
        //     "Cichlid"
        // ];

    
        // let queryFish = FishModel.findById(id);
        const Can = await FishModel.find({name: {$in: compat}}).select('_id');
        const Cant = await FishModel.find({name: {$in: noncompat}}).select('_id');
        const Fish = await FishModel.updateOne({_id: id}, {$push: {compatibility: Can, notCompatible: Cant}});
        
        
        // queryFish.update()

        // if(!queryFish){
        //     return res.status(404).json({msg: 'fish not found'})
        // }
    
        return res.status(200).json({can: Can , Cant: Cant, fish: Fish})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: error})
    }
}








export default { getAllFish, getById , getCompat}